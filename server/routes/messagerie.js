const express = require('express');
const router = express.Router();
const Messagerie = require('../models/Messagerie');
const authMiddleware = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

// Track admin online status and typing
let adminOnline = {};
let typingStatus = {};

// SSE for live chat
const sseClients = new Map();

function broadcast(data) {
  sseClients.forEach((res) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

// SSE endpoint
router.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const clientId = Date.now().toString();
  sseClients.set(clientId, res);

  res.write(`data: ${JSON.stringify({ type: 'connected', clientId })}\n\n`);

  req.on('close', () => {
    sseClients.delete(clientId);
    // If admin disconnects
    if (adminOnline[clientId]) {
      delete adminOnline[clientId];
      broadcast({ type: 'admin-status', online: Object.keys(adminOnline).length > 0 });
    }
  });
});

// Admin goes online
router.post('/admin-online', authMiddleware, (req, res) => {
  // Check if user is admin
  const usersPath = path.join(__dirname, '../db/users.json');
  const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
  const user = users.find(u => u.id === req.user.id);
  
  if (!user || user.role !== 'administrateur') {
    return res.status(403).json({ message: 'Non autorisé' });
  }

  const clientId = req.body.clientId || req.user.id;
  adminOnline[clientId] = { userId: req.user.id, name: `${user.firstName} ${user.lastName}` };
  broadcast({ type: 'admin-status', online: true });
  res.json({ success: true });
});

// Admin goes offline
router.post('/admin-offline', authMiddleware, (req, res) => {
  const clientId = req.body.clientId || req.user.id;
  delete adminOnline[clientId];
  broadcast({ type: 'admin-status', online: Object.keys(adminOnline).length > 0 });
  res.json({ success: true });
});

// Check admin online status
router.get('/admin-status', (req, res) => {
  res.json({ online: Object.keys(adminOnline).length > 0 });
});

// Send message (visitor or admin)
router.post('/send', (req, res) => {
  try {
    const { sessionId, visitorName, senderType, senderName, content } = req.body;
    if (!sessionId || !content || !senderType) {
      return res.status(400).json({ message: 'Champs requis manquants' });
    }
    const msg = Messagerie.create({ sessionId, visitorName, senderType, senderName, content });
    broadcast({ type: 'new-message', message: msg });
    // Clear typing
    delete typingStatus[sessionId + '-' + senderType];
    broadcast({ type: 'typing', sessionId, senderType, isTyping: false });
    res.status(201).json(msg);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get conversation
router.get('/conversation/:sessionId', (req, res) => {
  const messages = Messagerie.getConversation(req.params.sessionId);
  res.json(messages);
});

// Get all active conversations (admin)
router.get('/conversations', authMiddleware, (req, res) => {
  const conversations = Messagerie.getActiveConversations();
  res.json(conversations);
});

// Mark conversation as read
router.put('/read/:sessionId', authMiddleware, (req, res) => {
  Messagerie.markConversationRead(req.params.sessionId);
  res.json({ success: true });
});

// Unread count for admin
router.get('/unread-count', authMiddleware, (req, res) => {
  const count = Messagerie.getUnreadCountForAdmin();
  res.json({ count });
});

// Typing indicator
router.post('/typing', (req, res) => {
  const { sessionId, senderType, isTyping } = req.body;
  typingStatus[sessionId + '-' + senderType] = isTyping;
  broadcast({ type: 'typing', sessionId, senderType, isTyping });
  res.json({ success: true });
});

module.exports = router;
