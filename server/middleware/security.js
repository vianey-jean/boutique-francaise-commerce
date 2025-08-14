const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');

// Rate limiting configurations
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: message,
        retryAfter: Math.round(windowMs / 1000)
      });
    }
  });
};

// Security middlewares
const securityMiddlewares = {
  // Helmet for security headers
  helmet: helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    },
    crossOriginEmbedderPolicy: false
  }),

  // Rate limiting for different endpoints
  generalLimiter: createRateLimit(15 * 60 * 1000, 100, 'Trop de requêtes, réessayez plus tard'),
  authLimiter: createRateLimit(15 * 60 * 1000, 5, 'Trop de tentatives de connexion, réessayez plus tard'),
  apiLimiter: createRateLimit(15 * 60 * 1000, 200, 'Trop de requêtes API, réessayez plus tard'),

  // CORS configuration
  corsOptions: {
    origin: function (origin, callback) {
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://server-gestion-ventes.onrender.com',
        process.env.FRONTEND_URL
      ].filter(Boolean);

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Non autorisé par CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400 // 24 hours
  },

  // Request validation middleware
  validateRequest: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Données invalides',
        details: errors.array()
      });
    }
    next();
  },

  // Anti-brute force for sensitive operations
  bruteForceProtection: (req, res, next) => {
    const clientId = req.ip + (req.user?.id || 'anonymous');
    const attempts = global.bruteForceAttempts || {};
    const maxAttempts = 10;
    const lockoutTime = 30 * 60 * 1000; // 30 minutes

    if (attempts[clientId] && attempts[clientId].count >= maxAttempts) {
      const timeElapsed = Date.now() - attempts[clientId].lastAttempt;
      if (timeElapsed < lockoutTime) {
        return res.status(429).json({
          error: 'Compte temporairement verrouillé suite à trop de tentatives',
          retryAfter: Math.round((lockoutTime - timeElapsed) / 1000)
        });
      } else {
        delete attempts[clientId];
      }
    }

    next();
  },

  // Input sanitization
  sanitizeInput: (req, res, next) => {
    const sanitize = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = obj[key]
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/[<>&"']/g, (match) => {
              const entityMap = {
                '<': '&lt;',
                '>': '&gt;',
                '&': '&amp;',
                '"': '&quot;',
                "'": '&#39;'
              };
              return entityMap[match];
            });
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitize(obj[key]);
        }
      }
    };

    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);

    next();
  },

  // CSRF protection
  csrfProtection: (req, res, next) => {
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      const token = req.headers['x-csrf-token'] || req.body._csrf;
      const sessionToken = req.session?.csrfToken;

      if (!token || !sessionToken || token !== sessionToken) {
        return res.status(403).json({
          error: 'Token CSRF invalide'
        });
      }
    }
    next();
  },

  // Generate CSRF token
  generateCSRFToken: (req, res, next) => {
    if (!req.session.csrfToken) {
      req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    }
    res.locals.csrfToken = req.session.csrfToken;
    next();
  },

  // SQL injection protection
  sqlInjectionProtection: (req, res, next) => {
    const checkSQLInjection = (value) => {
      const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
        /(--|\/\*|\*\/|;|'|"|`)/,
        /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i
      ];

      return sqlPatterns.some(pattern => pattern.test(value));
    };

    const validateObject = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'string' && checkSQLInjection(obj[key])) {
          return false;
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (!validateObject(obj[key])) return false;
        }
      }
      return true;
    };

    if ((req.body && !validateObject(req.body)) ||
        (req.query && !validateObject(req.query)) ||
        (req.params && !validateObject(req.params))) {
      return res.status(400).json({
        error: 'Contenu suspect détecté'
      });
    }

    next();
  }
};

// Validation schemas
const validationSchemas = {
  user: [
    body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
    body('password').isLength({ min: 8 }).withMessage('Mot de passe trop court'),
    body('firstName').isLength({ min: 2, max: 50 }).withMessage('Prénom invalide'),
    body('lastName').isLength({ min: 2, max: 50 }).withMessage('Nom invalide'),
    body('phone').isMobilePhone().withMessage('Numéro de téléphone invalide')
  ],

  product: [
    body('nom').isLength({ min: 2, max: 100 }).withMessage('Nom du produit invalide'),
    body('prix').isFloat({ min: 0 }).withMessage('Prix invalide'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantité invalide')
  ],

  sale: [
    body('productId').isUUID().withMessage('ID produit invalide'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantité invalide'),
    body('prix').isFloat({ min: 0 }).withMessage('Prix invalide')
  ]
};

module.exports = {
  securityMiddlewares,
  validationSchemas
};