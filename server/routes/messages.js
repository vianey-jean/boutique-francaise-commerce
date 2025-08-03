const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const messagesFilePath = path.join(__dirname, '../data/messages.json');

// Fonction utilitaire pour lire les messages
const readMessages = async () => {
  try {
    const data = await fs.readFile(messagesFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Fonction utilitaire pour écrire les messages
const writeMessages = async (messages) => {
  await fs.writeFile(messagesFilePath, JSON.stringify(messages, null, 2), 'utf-8');
};

// GET - Récupérer tous les messages
router.get('/', async (req, res) => {
  try {
    const messages = await readMessages();
    res.json(messages);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST - Créer un nouveau message
router.post('/', async (req, res) => {
  try {
    const { nom, email, sujet, message } = req.body;
    
    if (!nom || !email || !sujet || !message) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    const messages = await readMessages();
    const newMessage = {
      id: Date.now().toString(),
      nom,
      email,
      sujet,
      message,
      dateEnvoi: new Date().toISOString(),
      lu: false
    };

    messages.push(newMessage);
    await writeMessages(messages);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Erreur lors de la création du message:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT - Marquer un message comme lu
router.put('/:id/mark-read', async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await readMessages();
    
    const messageIndex = messages.findIndex(msg => msg.id === id);
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }

    messages[messageIndex].lu = true;
    await writeMessages(messages);

    res.json(messages[messageIndex]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du message:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;