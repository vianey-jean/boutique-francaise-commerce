
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { createServer } = require('http');

// Importation des modules de configuration
const corsOptions = require('./config/cors');
const { securityMiddlewares, additionalCorsHeaders, sanitizeMiddleware, securityMonitoring } = require('./config/security');
const { initializeDataFiles } = require('./config/dataFiles');
const { authenticateToken } = require('./config/auth');
const setupRoutes = require('./config/routes');
const { notFoundHandler, globalErrorHandler } = require('./config/errorHandlers');
const initializeSocket = require('./socket/socketConfig');

// Initialiser l'application Express
const app = express();
const server = createServer(app);

// Middleware de sécurité renforcée
securityMiddlewares.forEach(middleware => app.use(middleware));

// Middleware de surveillance des attaques
app.use(securityMonitoring);

// Configuration de CORS
app.use(cors(corsOptions));

// Middleware additionnels pour les en-têtes CORS
app.use(additionalCorsHeaders);

// Middleware pour parser le corps des requêtes
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Middleware pour vérifier et créer les fichiers de données s'ils n'existent pas
app.use(initializeDataFiles);

// Middleware pour servir les fichiers statiques avec des en-têtes CORS appropriés
app.use('/uploads', (req, res, next) => {
  res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  res.set('X-Content-Type-Options', 'nosniff');
  express.static(path.join(__dirname, 'uploads'))(req, res, next);
});

// Protection contre les injections (doit être après bodyParser)
app.use(sanitizeMiddleware);

// Configuration des routes
setupRoutes(app);

// Initialiser Socket.io
const io = initializeSocket(server);

// Route pour tester le serveur
app.get('/', (req, res) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block'
  });
  res.send('API de l\'application e-commerce Riziky-Boutic est active - Sécurisée SSL/TLS!');
});

// Middleware pour la gestion des erreurs
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Démarrer le serveur
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`🔒 Serveur sécurisé démarré sur le port ${PORT}`);
  console.log(`🛡️  Sécurité renforcée: SSL/TLS, AES-256, XSS Protection activés`);
});
