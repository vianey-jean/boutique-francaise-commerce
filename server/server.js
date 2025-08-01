const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Charger les variables d'environnement
dotenv.config();

// Initialiser l'application Express
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Dossier pour les fichiers uploadés
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/appointments', require('./routes/appointements'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/sms', require('./routes/sms'));

// Route de base pour vérifier si le serveur fonctionne
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API de Riziky-Agendas' });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Lancement du serveur
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
