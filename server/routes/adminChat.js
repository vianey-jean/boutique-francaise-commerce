const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/auth');

const DB_PATH = path.join(__dirname, '../db/messagerie.json');

function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, '[]');
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch { return []; }
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Get admin messages only (type === 'admin_chat')
function getAdminMessages() {
  return readDB().filter(m => m.type === 'admin_chat');
}

// SSE clients for admin chat
const adminChatClients = new Map();

function broadcastToUser(userId, event, data) {
  adminChatClients.forEach((client) => {
    if (client.userId === userId) {
      try {
        client.res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
      } catch (e) {}
    }
  });
}

// SSE endpoint for admin chat (token via query since SSE can't send headers)
router.get('/events', (req, res) => {
  const jwt = require('jsonwebtoken');
  const User = require('../models/User');
  const token = req.query.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Non autorisé' });
  
  let decoded;
  try { decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecretkey'); }
  catch { return res.status(401).json({ message: 'Token invalide' }); }
  
  const reqUser = User.getById(decoded.id);
  if (!reqUser) return res.status(401).json({ message: 'Utilisateur non trouvé' });

  res.status(200);
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  const clientId = `adminchat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const userId = reqUser.id;

  adminChatClients.set(clientId, { res, userId });

  const heartbeat = setInterval(() => {
    try { res.write(':heartbeat\n\n'); } catch { clearInterval(heartbeat); }
  }, 15000);

  res.write(`event: connected\ndata: ${JSON.stringify({ clientId })}\n\n`);

  req.on('close', () => {
    clearInterval(heartbeat);
    adminChatClients.delete(clientId);
  });
});

// List all admins (for starting a conversation)
router.get('/admins', authMiddleware, (req, res) => {
  try {
    const usersPath = path.join(__dirname, '../db/users.json');
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    const admins = users
      .filter(u => (u.role === 'administrateur' || u.role === 'administrateur principale') && u.id !== req.user.id)
      .map(u => ({
        id: u.id,
        nom: `${u.firstName} ${u.lastName}`,
        role: u.role,
        profilePhoto: u.profilePhoto || null
      }));
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get conversations list for current admin
router.get('/conversations', authMiddleware, (req, res) => {
  try {
    const userId = req.user.id;
    const messages = getAdminMessages().filter(
      m => m.senderId === userId || m.receiverId === userId
    );

    // Group by the other person's ID
    const convMap = {};
    messages.forEach(m => {
      const otherId = m.senderId === userId ? m.receiverId : m.senderId;
      const otherNom = m.senderId === userId ? m.receiverNom : m.senderNom;
      if (!convMap[otherId]) {
        convMap[otherId] = {
          partnerId: otherId,
          partnerNom: otherNom,
          partnerRole: m.senderId === userId ? m.receiverRole : m.senderRole,
          partnerPhoto: m.senderId === userId ? m.receiverPhoto : m.senderPhoto,
          messages: [],
          unreadCount: 0
        };
      }
      convMap[otherId].messages.push(m);
      if (!m.lu && m.receiverId === userId) {
        convMap[otherId].unreadCount++;
      }
    });

    const conversations = Object.values(convMap).map(conv => {
      conv.lastMessage = conv.messages[conv.messages.length - 1];
      delete conv.messages;
      return conv;
    }).sort((a, b) => new Date(b.lastMessage.date) - new Date(a.lastMessage.date));

    res.json(conversations);
  } catch (error) {
    console.error('Error fetching admin conversations:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get messages between two admins
router.get('/messages/:partnerId', authMiddleware, (req, res) => {
  try {
    const userId = req.user.id;
    const { partnerId } = req.params;
    const messages = getAdminMessages().filter(
      m => (m.senderId === userId && m.receiverId === partnerId) ||
           (m.senderId === partnerId && m.receiverId === userId)
    ).sort((a, b) => new Date(a.date) - new Date(b.date));
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Send message
router.post('/send', authMiddleware, (req, res) => {
  try {
    const { receiverId, contenu } = req.body;
    if (!receiverId || !contenu?.trim()) {
      return res.status(400).json({ message: 'Champs obligatoires manquants' });
    }

    const sender = req.user;
    const usersPath = path.join(__dirname, '../db/users.json');
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    const receiver = users.find(u => u.id === receiverId);
    if (!receiver) return res.status(404).json({ message: 'Destinataire non trouvé' });

    const allMessages = readDB();
    const newMessage = {
      id: `adm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'admin_chat',
      senderId: sender.id,
      senderNom: `${sender.firstName} ${sender.lastName}`,
      senderRole: sender.role,
      senderPhoto: sender.profilePhoto || null,
      receiverId: receiver.id,
      receiverNom: `${receiver.firstName} ${receiver.lastName}`,
      receiverRole: receiver.role,
      receiverPhoto: receiver.profilePhoto || null,
      contenu: contenu.trim(),
      date: new Date().toISOString(),
      lu: false
    };

    allMessages.push(newMessage);
    writeDB(allMessages);

    // Broadcast to both parties
    broadcastToUser(sender.id, 'admin_new_message', newMessage);
    broadcastToUser(receiver.id, 'admin_new_message', newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending admin message:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mark messages as read
router.put('/mark-read/:partnerId', authMiddleware, (req, res) => {
  try {
    const userId = req.user.id;
    const { partnerId } = req.params;
    const allMessages = readDB();
    let updated = false;

    allMessages.forEach(m => {
      if (m.type === 'admin_chat' && m.senderId === partnerId && m.receiverId === userId && !m.lu) {
        m.lu = true;
        updated = true;
      }
    });

    if (updated) writeDB(allMessages);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Edit message
router.put('/edit/:messageId', authMiddleware, (req, res) => {
  try {
    const { messageId } = req.params;
    const { contenu } = req.body;
    if (!contenu?.trim()) return res.status(400).json({ message: 'Contenu requis' });

    const allMessages = readDB();
    const idx = allMessages.findIndex(m => m.id === messageId && m.type === 'admin_chat');
    if (idx === -1) return res.status(404).json({ message: 'Message non trouvé' });
    if (allMessages[idx].senderId !== req.user.id) return res.status(403).json({ message: 'Non autorisé' });

    allMessages[idx].contenu = contenu.trim();
    allMessages[idx].edited = true;
    allMessages[idx].editedAt = new Date().toISOString();
    writeDB(allMessages);

    broadcastToUser(allMessages[idx].senderId, 'admin_message_edited', allMessages[idx]);
    broadcastToUser(allMessages[idx].receiverId, 'admin_message_edited', allMessages[idx]);

    res.json(allMessages[idx]);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Delete message
router.delete('/delete/:messageId', authMiddleware, (req, res) => {
  try {
    const { messageId } = req.params;
    const allMessages = readDB();
    const idx = allMessages.findIndex(m => m.id === messageId && m.type === 'admin_chat');
    if (idx === -1) return res.status(404).json({ message: 'Message non trouvé' });
    if (allMessages[idx].senderId !== req.user.id) return res.status(403).json({ message: 'Non autorisé' });

    allMessages[idx].contenu = '';
    allMessages[idx].deleted = true;
    allMessages[idx].deletedAt = new Date().toISOString();
    writeDB(allMessages);

    broadcastToUser(allMessages[idx].senderId, 'admin_message_deleted', allMessages[idx]);
    broadcastToUser(allMessages[idx].receiverId, 'admin_message_deleted', allMessages[idx]);

    res.json(allMessages[idx]);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Typing indicator
router.post('/typing', authMiddleware, (req, res) => {
  const { receiverId, isTyping } = req.body;
  broadcastToUser(receiverId, 'admin_typing', { senderId: req.user.id, isTyping });
  res.json({ ok: true });
});

// Unread count
router.get('/unread-count', authMiddleware, (req, res) => {
  try {
    const count = getAdminMessages().filter(
      m => m.receiverId === req.user.id && !m.lu
    ).length;
    res.json({ count });
  } catch { res.json({ count: 0 }); }
});

module.exports = router;
