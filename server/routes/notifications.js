
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { isAuthenticated, isAdmin } = require('../middlewares/auth');

const notificationsFilePath = path.join(__dirname, '../data/notifications.json');
const ordersFilePath = path.join(__dirname, '../data/commandes.json');
const contactsFilePath = path.join(__dirname, '../data/contacts.json');
const adminChatFilePath = path.join(__dirname, '../data/admin-chat.json');
const clientChatFilePath = path.join(__dirname, '../data/client-chat.json');

// Vérifier si le fichier notifications.json existe, sinon le créer
if (!fs.existsSync(notificationsFilePath)) {
  const initialData = {
    unreadMessages: {},
    unreadContacts: {},
    unreadOrders: {},
    unreadAdminChats: {},
    unreadClientChats: {}
  };
  fs.writeFileSync(notificationsFilePath, JSON.stringify(initialData, null, 2));
}

// Récupérer toutes les notifications pour un administrateur
router.get('/', isAuthenticated, isAdmin, (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = JSON.parse(fs.readFileSync(notificationsFilePath));
    
    // Calculer les notifications non lues pour le tableau de bord
    const orders = JSON.parse(fs.readFileSync(ordersFilePath));
    const contacts = JSON.parse(fs.readFileSync(contactsFilePath));
    const adminChat = JSON.parse(fs.readFileSync(adminChatFilePath));
    const clientChat = JSON.parse(fs.readFileSync(clientChatFilePath));
    
    // Calculer les commandes non lues
    const unreadOrders = orders.filter(order => {
      const orderNotif = notifications.unreadOrders[order.id];
      return !orderNotif || !orderNotif.read;
    }).length;
    
    // Calculer les contacts non lus
    const unreadContacts = contacts.filter(contact => {
      const contactNotif = notifications.unreadContacts[contact.id];
      return !contactNotif || !contactNotif.read;
    }).length;
    
    // Calculer les conversations admin non lues
    const unreadAdminChats = {};
    let totalUnreadAdminMessages = 0;
    
    // Parcourir les conversations admin
    Object.entries(adminChat.conversations || {}).forEach(([conversationId, conversation]) => {
      if (conversationId.includes(userId)) {
        const [user1, user2] = conversationId.split('-');
        const otherUserId = user1 === userId ? user2 : user1;
        
        // Compter les messages non lus de cette conversation
        const unreadCount = conversation.messages.filter(msg => 
          msg.senderId === otherUserId && 
          (!msg.read || msg.read === false)
        ).length;
        
        if (unreadCount > 0) {
          unreadAdminChats[otherUserId] = unreadCount;
          totalUnreadAdminMessages += unreadCount;
        }
      }
    });
    
    // Calculer les conversations client non lues
    const unreadClientChats = {};
    let totalUnreadClientMessages = 0;
    
    // Parcourir les conversations client (format différent)
    Object.entries(clientChat.conversations || {}).forEach(([conversationId, conversation]) => {
      if (conversationId.startsWith('client-')) {
        const clientId = conversationId.split('-')[1];
        
        // Compter les messages non lus de cette conversation
        const unreadCount = conversation.messages.filter(msg => 
          msg.senderId === clientId && 
          (!msg.read || msg.read === false)
        ).length;
        
        if (unreadCount > 0) {
          unreadClientChats[clientId] = unreadCount;
          totalUnreadClientMessages += unreadCount;
        }
      }
    });
    
    // Réponse compilée
    const response = {
      unreadOrders,
      unreadContacts,
      unreadAdminChats,
      totalUnreadAdminMessages,
      unreadClientChats,
      totalUnreadClientMessages,
      total: unreadOrders + unreadContacts + totalUnreadAdminMessages + totalUnreadClientMessages
    };
    
    res.json(response);
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications:", error);
    res.status(500).json({ message: 'Erreur lors de la récupération des notifications' });
  }
});

// Marquer les commandes comme lues
router.post('/orders/read', isAuthenticated, isAdmin, (req, res) => {
  try {
    const notifications = JSON.parse(fs.readFileSync(notificationsFilePath));
    const orders = JSON.parse(fs.readFileSync(ordersFilePath));
    
    // Marquer toutes les commandes comme lues
    orders.forEach(order => {
      if (!notifications.unreadOrders[order.id]) {
        notifications.unreadOrders[order.id] = {};
      }
      notifications.unreadOrders[order.id].read = true;
    });
    
    fs.writeFileSync(notificationsFilePath, JSON.stringify(notifications, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des notifications:", error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour des notifications' });
  }
});

// Marquer les messages de contact comme lus
router.post('/contacts/read', isAuthenticated, isAdmin, (req, res) => {
  try {
    const notifications = JSON.parse(fs.readFileSync(notificationsFilePath));
    const contacts = JSON.parse(fs.readFileSync(contactsFilePath));
    
    // Marquer tous les contacts comme lus
    contacts.forEach(contact => {
      if (!notifications.unreadContacts[contact.id]) {
        notifications.unreadContacts[contact.id] = {};
      }
      notifications.unreadContacts[contact.id].read = true;
    });
    
    fs.writeFileSync(notificationsFilePath, JSON.stringify(notifications, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des notifications:", error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour des notifications' });
  }
});

// Marquer les messages d'un chat admin comme lus
router.post('/admin-chat/:adminId/read', isAuthenticated, isAdmin, (req, res) => {
  try {
    const { adminId } = req.params;
    const userId = req.user.id;
    const notifications = JSON.parse(fs.readFileSync(notificationsFilePath));
    const adminChat = JSON.parse(fs.readFileSync(adminChatFilePath));
    
    // Construire l'ID de conversation (l'ID le plus petit en premier)
    const conversationId = userId < adminId 
      ? `${userId}-${adminId}` 
      : `${adminId}-${userId}`;
    
    if (adminChat.conversations && adminChat.conversations[conversationId]) {
      // Marquer tous les messages comme lus
      adminChat.conversations[conversationId].messages.forEach(message => {
        if (message.senderId === adminId) {
          message.read = true;
        }
      });
      
      fs.writeFileSync(adminChatFilePath, JSON.stringify(adminChat, null, 2));
      res.json({ success: true });
    } else {
      res.status(404).json({ message: 'Conversation non trouvée' });
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour des notifications:", error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour des notifications' });
  }
});

// Marquer les messages d'un chat client comme lus
router.post('/client-chat/:clientId/read', isAuthenticated, isAdmin, (req, res) => {
  try {
    const { clientId } = req.params;
    const clientChat = JSON.parse(fs.readFileSync(clientChatFilePath));
    
    const conversationId = `client-${clientId}-service`;
    
    if (clientChat.conversations && clientChat.conversations[conversationId]) {
      // Marquer tous les messages comme lus
      clientChat.conversations[conversationId].messages.forEach(message => {
        if (message.senderId === clientId) {
          message.read = true;
        }
      });
      
      fs.writeFileSync(clientChatFilePath, JSON.stringify(clientChat, null, 2));
      res.json({ success: true });
    } else {
      res.status(404).json({ message: 'Conversation non trouvée' });
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour des notifications:", error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour des notifications' });
  }
});

module.exports = router;
