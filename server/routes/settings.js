/**
 * =============================================================================
 * Routes Paramètres - Gestion des données et configuration
 * =============================================================================
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const authMiddleware = require('../middleware/auth');

const dbPath = path.join(__dirname, '../db');
const settingsPath = path.join(dbPath, 'settings.json');
const usersPath = path.join(dbPath, 'users.json');

// Helper: read JSON file safely
const readJson = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch { return null; }
};

// Helper: write JSON file
const writeJson = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Helper: check if user is admin
const isAdmin = (user) => {
  return user && user.role === 'administrateur';
};

// All DB files to backup/restore/delete
const DB_FILES = [
  'users.json', 'products.json', 'sales.json', 'clients.json',
  'pretfamilles.json', 'pretproduits.json', 'depensedumois.json',
  'depensefixe.json', 'benefice.json', 'commandes.json', 'remboursement.json',
  'fournisseurs.json', 'entreprise.json', 'pointage.json', 'travailleur.json',
  'tache.json', 'notes.json', 'noteColumns.json', 'rdv.json',
  'rdvNotifications.json', 'objectif.json', 'nouvelle_achat.json',
  'compta.json', 'avance.json', 'messages.json', 'messagerie.json',
  'shareTokens.json', 'lienIp.json', 'settings.json'
];

// ==================
// GET /api/settings
// ==================
router.get('/', authMiddleware, (req, res) => {
  try {
    const settings = readJson(settingsPath) || {};
    const isUserAdmin = isAdmin(req.user);
    res.json({ settings, isAdmin: isUserAdmin });
  } catch (error) {
    console.error('Error reading settings:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ==================
// PUT /api/settings
// ==================
router.put('/', authMiddleware, (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ message: 'Accès refusé. Administrateur requis.' });
    }
    const currentSettings = readJson(settingsPath) || {};
    const updatedSettings = { ...currentSettings, ...req.body };
    writeJson(settingsPath, updatedSettings);
    res.json({ success: true, settings: updatedSettings });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ==================
// POST /api/settings/backup - Sauvegarder toutes les données
// ==================
router.post('/backup', authMiddleware, (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ message: 'Accès refusé. Administrateur requis.' });
    }

    const { encryptionCode } = req.body;
    if (!encryptionCode || encryptionCode.length < 6) {
      return res.status(400).json({ message: 'Code de cryptage requis (min 6 caractères)' });
    }

    // Collect all DB data
    const backupData = {};
    DB_FILES.forEach(file => {
      const filePath = path.join(dbPath, file);
      const data = readJson(filePath);
      if (data !== null) {
        backupData[file] = data;
      }
    });

    // Add metadata
    backupData._metadata = {
      backupDate: new Date().toISOString(),
      version: '1.0',
      filesCount: Object.keys(backupData).length - 1
    };

    // Encrypt data with the code
    const jsonData = JSON.stringify(backupData);
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(encryptionCode, 'riziky-salt-2024', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(jsonData, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const encryptedPackage = {
      iv: iv.toString('hex'),
      data: encrypted,
      checksum: crypto.createHash('sha256').update(jsonData).digest('hex')
    };

    // Update last backup date
    const settings = readJson(settingsPath) || {};
    settings.backup = settings.backup || {};
    settings.backup.lastBackupDate = new Date().toISOString();
    writeJson(settingsPath, settings);

    res.json({
      success: true,
      backup: encryptedPackage,
      filename: `backup-riziky-${new Date().toISOString().split('T')[0]}.json`
    });
  } catch (error) {
    console.error('Error creating backup:', error);
    res.status(500).json({ message: 'Erreur lors de la sauvegarde' });
  }
});

// ==================
// POST /api/settings/restore - Injecter des données
// ==================
router.post('/restore', authMiddleware, (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ message: 'Accès refusé. Administrateur requis.' });
    }

    const { encryptedData, decryptionCode } = req.body;
    if (!encryptedData || !decryptionCode) {
      return res.status(400).json({ message: 'Données et code de décryptage requis' });
    }

    // Decrypt data
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(decryptionCode, 'riziky-salt-2024', 32);
    const iv = Buffer.from(encryptedData.iv, 'hex');
    
    let decrypted;
    try {
      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      decrypted = decipher.update(encryptedData.data, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
    } catch (e) {
      return res.status(400).json({ message: 'Code de décryptage incorrect. Impossible de lire les données.' });
    }

    // Verify checksum
    const backupData = JSON.parse(decrypted);
    const checksum = crypto.createHash('sha256').update(decrypted).digest('hex');
    
    // Restore each file
    let restoredCount = 0;
    DB_FILES.forEach(file => {
      if (backupData[file] !== undefined) {
        const filePath = path.join(dbPath, file);
        writeJson(filePath, backupData[file]);
        restoredCount++;
      }
    });

    res.json({
      success: true,
      message: `${restoredCount} fichiers restaurés avec succès`,
      metadata: backupData._metadata
    });
  } catch (error) {
    console.error('Error restoring backup:', error);
    res.status(500).json({ message: 'Erreur lors de la restauration' });
  }
});

// ==================
// POST /api/settings/delete-all - Supprimer toutes les données
// ==================
router.post('/delete-all', authMiddleware, (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ message: 'Accès refusé. Administrateur requis.' });
    }

    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'Mot de passe requis' });
    }

    // Verify admin password
    const users = readJson(usersPath) || [];
    const adminUser = users.find(u => u.id === req.user.id);
    if (!adminUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const isPasswordValid = bcrypt.compareSync(password, adminUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Delete all data - write empty arrays/objects
    DB_FILES.forEach(file => {
      const filePath = path.join(dbPath, file);
      if (fs.existsSync(filePath)) {
        if (file === 'depensefixe.json') {
          writeJson(filePath, {});
        } else if (file === 'settings.json') {
          writeJson(filePath, {});
        } else {
          writeJson(filePath, []);
        }
      }
    });

    res.json({ success: true, message: 'Toutes les données ont été supprimées' });
  } catch (error) {
    console.error('Error deleting all data:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
});

// ==================
// POST /api/settings/verify-password - Vérifier mot de passe admin
// ==================
router.post('/verify-password', authMiddleware, (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const { password } = req.body;
    const users = readJson(usersPath) || [];
    const adminUser = users.find(u => u.id === req.user.id);
    if (!adminUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const isValid = bcrypt.compareSync(password, adminUser.password);
    res.json({ valid: isValid });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
