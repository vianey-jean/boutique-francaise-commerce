const fs = require('fs');
const path = require('path');

class Messagerie {
  constructor() {
    this.dbPath = path.join(__dirname, '../db/messagerie.json');
    this.ensureFileExists();
  }

  ensureFileExists() {
    if (!fs.existsSync(this.dbPath)) {
      fs.writeFileSync(this.dbPath, JSON.stringify([], null, 2));
    }
  }

  getAll() {
    try {
      const data = fs.readFileSync(this.dbPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  getConversation(sessionId) {
    const all = this.getAll();
    return all.filter(m => m.sessionId === sessionId);
  }

  getActiveConversations() {
    const all = this.getAll();
    const sessions = {};
    all.forEach(m => {
      if (!sessions[m.sessionId]) {
        sessions[m.sessionId] = { sessionId: m.sessionId, visitorName: m.visitorName, messages: [], unread: 0 };
      }
      sessions[m.sessionId].messages.push(m);
      if (!m.lu && m.senderType === 'visitor') {
        sessions[m.sessionId].unread++;
      }
    });
    return Object.values(sessions);
  }

  create(data) {
    const all = this.getAll();
    const msg = {
      id: Date.now().toString(),
      sessionId: data.sessionId,
      visitorName: data.visitorName,
      senderType: data.senderType, // 'visitor' or 'admin'
      senderName: data.senderName,
      content: data.content,
      timestamp: new Date().toISOString(),
      lu: false
    };
    all.push(msg);
    this.saveAll(all);
    return msg;
  }

  markConversationRead(sessionId) {
    const all = this.getAll();
    all.forEach(m => {
      if (m.sessionId === sessionId && m.senderType === 'visitor') {
        m.lu = true;
      }
    });
    this.saveAll(all);
  }

  getUnreadCountForAdmin() {
    const all = this.getAll();
    return all.filter(m => !m.lu && m.senderType === 'visitor').length;
  }

  saveAll(data) {
    fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
  }
}

module.exports = new Messagerie();
