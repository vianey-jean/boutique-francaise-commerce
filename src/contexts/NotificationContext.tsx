
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import API from '@/services/api';
import { toast } from '@/components/ui/sonner';
import io from 'socket.io-client';

interface AdminNotification {
  [adminId: string]: number;
}

interface NotificationState {
  unreadOrders: number;
  unreadContacts: number;
  unreadAdminChats: AdminNotification;
  totalUnreadAdminMessages: number;
  unreadClientChats: AdminNotification;
  totalUnreadClientMessages: number;
  total: number;
  loading: boolean;
}

interface NotificationContextType {
  notifications: NotificationState;
  refreshNotifications: () => Promise<void>;
  markOrdersAsRead: () => Promise<void>;
  markContactsAsRead: () => Promise<void>;
  markAdminChatAsRead: (adminId: string) => Promise<void>;
  markClientChatAsRead: (clientId: string) => Promise<void>;
}

const defaultState: NotificationState = {
  unreadOrders: 0,
  unreadContacts: 0,
  unreadAdminChats: {},
  totalUnreadAdminMessages: 0,
  unreadClientChats: {},
  totalUnreadClientMessages: 0,
  total: 0,
  loading: true
};

const NotificationContext = createContext<NotificationContextType>({
  notifications: defaultState,
  refreshNotifications: async () => {},
  markOrdersAsRead: async () => {},
  markContactsAsRead: async () => {},
  markAdminChatAsRead: async () => {},
  markClientChatAsRead: async () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<NotificationState>(defaultState);
  const [socket, setSocket] = useState<any>(null);

  // Connecter au serveur Socket.io
  useEffect(() => {
    if (isAuthenticated && user && user.role === 'admin') {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:10000';
      try {
        const socketInstance = io(apiUrl);
        setSocket(socketInstance);

        socketInstance.on('connect', () => {
          console.log('Socket.io connected for notifications');
          socketInstance.emit('authenticate', user);
        });

        socketInstance.on('notification', (data: any) => {
          console.log('Notification received:', data);
          
          // Rafraîchir les notifications
          refreshNotifications();
          
          // Afficher une notification toast
          toast(data.content, {
            description: 'Cliquez pour voir les détails',
            duration: 5000,
          });
        });

        return () => {
          socketInstance.disconnect();
        };
      } catch (error) {
        console.error('Erreur lors de la connexion au socket:', error);
      }
    }
  }, [isAuthenticated, user]);

  // Charger les notifications au démarrage
  useEffect(() => {
    if (isAuthenticated && user && user.role === 'admin') {
      refreshNotifications();
      
      // Actualiser les notifications toutes les 30 secondes
      const intervalId = setInterval(() => {
        refreshNotifications();
      }, 30000);
      
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated, user]);

  // Fonction pour rafraîchir les notifications
  const refreshNotifications = async () => {
    if (!isAuthenticated || !user || user.role !== 'admin') return;
    
    try {
      setNotifications(prev => ({ ...prev, loading: true }));
      const response = await API.get('/notifications');
      if (response && response.data) {
        setNotifications({
          ...response.data,
          loading: false
        });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      setNotifications(prev => ({ ...prev, loading: false }));
    }
  };

  // Marquer les commandes comme lues
  const markOrdersAsRead = async () => {
    if (!isAuthenticated || !user || user.role !== 'admin') return;
    
    try {
      await API.put('/notifications/orders/read');
      refreshNotifications();
    } catch (error) {
      console.error('Erreur lors du marquage des commandes comme lues:', error);
    }
  };

  // Marquer les messages de contact comme lus
  const markContactsAsRead = async () => {
    if (!isAuthenticated || !user || user.role !== 'admin') return;
    
    try {
      await API.put('/notifications/contacts/read');
      refreshNotifications();
    } catch (error) {
      console.error('Erreur lors du marquage des contacts comme lus:', error);
    }
  };

  // Marquer les messages d'un chat admin comme lus
  const markAdminChatAsRead = async (adminId: string) => {
    if (!isAuthenticated || !user || user.role !== 'admin') return;
    
    try {
      await API.put(`/notifications/admin-chat/${adminId}/read`);
      refreshNotifications();
    } catch (error) {
      console.error('Erreur lors du marquage des messages admin comme lus:', error);
    }
  };

  // Marquer les messages d'un chat client comme lus
  const markClientChatAsRead = async (clientId: string) => {
    if (!isAuthenticated || !user || user.role !== 'admin') return;
    
    try {
      await API.put(`/notifications/client-chat/${clientId}/read`);
      refreshNotifications();
    } catch (error) {
      console.error('Erreur lors du marquage des messages client comme lus:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        refreshNotifications,
        markOrdersAsRead,
        markContactsAsRead,
        markAdminChatAsRead,
        markClientChatAsRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
