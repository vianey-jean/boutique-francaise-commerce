import api from './api';
import { getBaseURL } from './api';

export const messagerieApi = {
  checkAdminOnline: async () => {
    const res = await api.get('/api/messagerie/admin-status');
    return res.data;
  },

  sendMessage: async (data: {
    sessionId: string;
    visitorName: string;
    senderType: 'visitor' | 'admin';
    senderName: string;
    content: string;
  }) => {
    const res = await api.post('/api/messagerie/send', data);
    return res.data;
  },

  getConversation: async (sessionId: string) => {
    const res = await api.get(`/api/messagerie/conversation/${sessionId}`);
    return res.data;
  },

  getConversations: async () => {
    const res = await api.get('/api/messagerie/conversations');
    return res.data;
  },

  markRead: async (sessionId: string) => {
    const res = await api.put(`/api/messagerie/read/${sessionId}`);
    return res.data;
  },

  getUnreadCount: async () => {
    const res = await api.get('/api/messagerie/unread-count');
    return res.data;
  },

  goOnline: async (clientId: string) => {
    const res = await api.post('/api/messagerie/admin-online', { clientId });
    return res.data;
  },

  goOffline: async (clientId: string) => {
    const res = await api.post('/api/messagerie/admin-offline', { clientId });
    return res.data;
  },

  sendTyping: async (sessionId: string, senderType: string, isTyping: boolean) => {
    const res = await api.post('/api/messagerie/typing', { sessionId, senderType, isTyping });
    return res.data;
  },

  getEventsUrl: () => {
    return `${getBaseURL()}/api/messagerie/events`;
  }
};

export default messagerieApi;
