
const helmet = require('helmet');
const xssClean = require('xss-clean');

const securityMiddlewares = [
  helmet({ 
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        scriptSrc: ["'self'", "'unsafe-eval'"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "ws:", "wss:"],
        mediaSrc: ["'self'"],
        objectSrc: ["'none'"],
        childSrc: ["'self'"],
        workerSrc: ["'self'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"]
      }
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    noSniff: true,
    frameguard: { action: 'deny' },
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
  }),
  xssClean()
];

const additionalCorsHeaders = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'credentialless');
  res.header('Cross-Origin-Opener-Policy', 'same-origin');
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.header('X-Powered-By', ''); // Masquer la technologie utilisée
  next();
};

const sanitizeMiddleware = (req, res, next) => {
  // Vérifier et nettoyer les paramètres de la requête
  if (req.params) {
    const keys = Object.keys(req.params);
    for (let key of keys) {
      req.params[key] = req.params[key]
        .replace(/[<>]/g, '') // Supprimer les balises HTML
        .replace(/javascript:/gi, '') // Supprimer les scripts JavaScript
        .replace(/on\w+=/gi, '') // Supprimer les événements JavaScript
        .trim();
    }
  }
  
  // Vérifier et nettoyer le corps de la requête
  if (req.body && typeof req.body === 'object') {
    const sanitize = (obj) => {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
          sanitized[key] = value
            .replace(/[<>]/g, '') // Supprimer les balises HTML
            .replace(/javascript:/gi, '') // Supprimer les scripts JavaScript
            .replace(/on\w+=/gi, '') // Supprimer les événements JavaScript
            .trim();
        } else if (typeof value === 'object' && value !== null) {
          sanitized[key] = sanitize(value);
        } else {
          sanitized[key] = value;
        }
      }
      return sanitized;
    };

    // Ne pas sanitiser les fichiers ou données binaires
    if (!req.is('multipart/form-data')) {
      req.body = sanitize(req.body);
    }
  }

  // Vérifier les headers suspects
  const suspiciousHeaders = ['x-forwarded-for', 'x-real-ip', 'user-agent'];
  suspiciousHeaders.forEach(header => {
    if (req.headers[header]) {
      req.headers[header] = req.headers[header]
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .trim();
    }
  });

  next();
};

// Middleware pour détecter les tentatives d'attaque
const securityMonitoring = (req, res, next) => {
  const suspiciousPatterns = [
    /(<script|javascript:|onload=|onerror=)/i,
    /(union\s+select|drop\s+table|insert\s+into)/i,
    /(\.\.\/|\.\.\\)/,
    /(%3C|%3E|%22|%27)/i
  ];

  const checkSuspicious = (str) => {
    if (typeof str !== 'string') return false;
    return suspiciousPatterns.some(pattern => pattern.test(str));
  };

  // Vérifier l'URL
  if (checkSuspicious(req.url)) {
    console.warn(`Tentative d'attaque détectée - URL: ${req.url} - IP: ${req.ip}`);
    return res.status(403).json({ error: 'Requête suspecte détectée' });
  }

  // Vérifier les paramètres
  if (req.query) {
    for (const [key, value] of Object.entries(req.query)) {
      if (checkSuspicious(value)) {
        console.warn(`Tentative d'attaque détectée - Param ${key}: ${value} - IP: ${req.ip}`);
        return res.status(403).json({ error: 'Paramètre suspect détecté' });
      }
    }
  }

  next();
};

module.exports = {
  securityMiddlewares,
  additionalCorsHeaders,
  sanitizeMiddleware,
  securityMonitoring
};
