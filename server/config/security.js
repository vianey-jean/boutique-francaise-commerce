
const helmet = require('helmet');

const securityConfig = (app) => {
  // Configuration Helmet avec des règles CSP pour Stripe
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'", 
          "'unsafe-inline'", 
          "'unsafe-eval'",
          "https://js.stripe.com",
          "https://m.stripe.network",
          "https://m.stripe.com"
        ],
        styleSrc: [
          "'self'", 
          "'unsafe-inline'",
          "https://fonts.googleapis.com"
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com"
        ],
        connectSrc: [
          "'self'",
          "https://api.stripe.com",
          "https://m.stripe.network",
          "https://m.stripe.com",
          "wss://m.stripe.network"
        ],
        frameSrc: [
          "'self'",
          "https://js.stripe.com",
          "https://hooks.stripe.com"
        ],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));
};

module.exports = securityConfig;
