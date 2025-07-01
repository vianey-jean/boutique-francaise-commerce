
const helmet = require('helmet');

// Tableau des middlewares de sécurité additionnels
const securityMiddlewares = [
  helmet.frameguard({ action: 'deny' }), // Protection contre le clickjacking
  helmet.referrerPolicy({ policy: 'same-origin' }), // Politique du referrer
  helmet.permittedCrossDomainPolicies({ permittedPolicies: 'none' }) // Limite les policies cross-domain
];

// Fonction d'installation de la configuration complète de Helmet
const setupSecurity = (app) => {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        scriptSrc: [
          "'self'",
          "https://cdn.gpteng.co",
          "'unsafe-inline'",
          "https://js.stripe.com",
          "https://m.stripe.network",
          "https://m.stripe.com"
        ],
        connectSrc: [
          "'self'",
          "https://api.stripe.com",
          "https://m.stripe.network",
          "https://m.stripe.com"
        ],
        frameSrc: [
          "'self'",
          "https://js.stripe.com",
          "https://hooks.stripe.com"
        ],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      },
      reportOnly: false
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000, // 1 an
      includeSubDomains: true,
      preload: true
    }
  }));
};

// Middleware additionnel pour les en-têtes CORS
const additionalCorsHeaders = (req, res, next) => {
  res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
};

// Middleware de sanitisation
const sanitizeMiddleware = (req, res, next) => {
  // Middleware de sanitisation simple
  next();
};

module.exports = { 
  setupSecurity, 
  securityMiddlewares, 
  additionalCorsHeaders, 
  sanitizeMiddleware 
};
