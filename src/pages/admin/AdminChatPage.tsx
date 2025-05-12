
import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { VideoCallProvider } from '@/contexts/VideoCallContext';
import API from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import NotificationBadge from '@/components/ui/notification-badge';

// Types
interface Admin {
  id: string;
  nom: string;
  email: string;
  photo?: string;
  role: string;
  isOnline?: boolean;
  lastSeen?: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read?: boolean;
  isEdited?: boolean;
  isAutoReply?: boolean;
}

interface Conversation {
  messages: Message[];
  participants: string[];
}

const AdminChatContent = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [messageText, setMessageText] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const { markAdminChatAsRead, notifications } = useNotifications();
  
  // Requête pour récupérer la liste des administrateurs
  const { data: admins = [] } = useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      const response = await API.get('/admin-chat/admins');
      return response.data;
    },
    enabled: !!user
  });
  
  // Requête pour récupérer la conversation avec l'administrateur sélectionné
  const { data: conversation = { messages: [] } } = useQuery({
    queryKey: ['adminChat', selectedAdmin?.id],
    queryFn: async () => {
      if (!selectedAdmin) return { messages: [] };
      const response = await API.get(`/admin-chat/conversations/${selectedAdmin.id}`);
      return response.data as Conversation;
    },
    enabled: !!user && !!selectedAdmin,
    refetchInterval: selectedAdmin ? 3000 : false
  });
  
  // Effet pour marquer les messages comme lus lorsque l'administrateur est sélectionné
  useEffect(() => {
    if (selectedAdmin) {
      markAdminChatAsRead(selectedAdmin.id);
    }
  }, [selectedAdmin, conversation.messages]);
  
  // Mutation pour envoyer un message
  const sendMessageMutation = useMutation({
    mutationFn: async ({ adminId, message }: { adminId: string; message: string }) => {
      return API.post(`/admin-chat/conversations/${adminId}`, { message });
    },
    onSuccess: () => {
      setMessageText('');
      queryClient.invalidateQueries({ queryKey: ['adminChat', selectedAdmin?.id] });
    }
  });
  
  // Mutation pour modifier un message
  const editMessageMutation = useMutation({
    mutationFn: async ({ messageId, content, conversationId }: { messageId: string; content: string; conversationId: string }) => {
      return API.put(`/admin-chat/messages/${messageId}/edit`, { content, conversationId });
    },
    onSuccess: () => {
      setEditingMessageId(null);
      setEditText('');
      queryClient.invalidateQueries({ queryKey: ['adminChat', selectedAdmin?.id] });
    }
  });
  
  // Mutation pour supprimer un message
  const deleteMessageMutation = useMutation({
    mutationFn: async ({ messageId, conversationId }: { messageId: string; conversationId: string }) => {
      return API.delete(`/admin-chat/messages/${messageId}?conversationId=${conversationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminChat', selectedAdmin?.id] });
    }
  });
  
  // Gérer l'envoi d'un message
  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedAdmin) return;
    sendMessageMutation.mutate({
      adminId: selectedAdmin.id,
      message: messageText
    });
  };
  
  // Gérer la modification d'un message
  const handleEditMessage = () => {
    if (!editText.trim() || !editingMessageId || !selectedAdmin) return;
    
    // Construire l'ID de conversation (l'ID le plus petit en premier)
    const conversationId = user && user.id < selectedAdmin.id 
      ? `${user.id}-${selectedAdmin.id}` 
      : `${selectedAdmin.id}-${user.id}`;
    
    editMessageMutation.mutate({
      messageId: editingMessageId,
      content: editText,
      conversationId
    });
  };
  
  // Gérer la suppression d'un message
  const handleDeleteMessage = (messageId: string) => {
    if (!selectedAdmin || !window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;
    
    // Construire l'ID de conversation (l'ID le plus petit en premier)
    const conversationId = user && user.id < selectedAdmin.id 
      ? `${user.id}-${selectedAdmin.id}` 
      : `${selectedAdmin.id}-${user.id}`;
    
    deleteMessageMutation.mutate({ messageId, conversationId });
  };

  // Filtrer les admins pour ne pas afficher l'utilisateur courant
  const filteredAdmins = admins.filter((admin: Admin) => admin.id !== user?.id);
  
  // Formater la date d'un message
  const formatMessageTime = (date: string) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Formater la date de dernière connexion
  const formatLastSeen = (date: string | undefined) => {
    if (!date) return 'Jamais connecté';
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Liste des administrateurs */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Administrateurs</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[70vh]">
            {filteredAdmins.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Aucun autre administrateur disponible
              </div>
            ) : (
              <div>
                {filteredAdmins.map((admin: Admin) => {
                  // Vérifier s'il y a des messages non lus pour cet administrateur
                  const unreadCount = notifications.unreadAdminChats[admin.id] || 0;
                  
                  return (
                    <div 
                      key={`admin-${admin.id}`}
                      className={`relative p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedAdmin?.id === admin.id ? 'bg-gray-50' : ''
                      }`}
                      onClick={() => setSelectedAdmin(admin)}
                    >
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center relative ${
                          admin.isOnline ? 'border-2 border-green-500' : ''
                        }`}>
                          {admin.photo ? (
                            <img 
                              src={admin.photo} 
                              alt={admin.nom} 
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-600 font-medium">
                              {admin.nom.charAt(0).toUpperCase()}
                            </span>
                          )}
                          {admin.isOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full"></span>
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium text-gray-900">{admin.nom}</h3>
                            {unreadCount > 0 && (
                              <NotificationBadge count={unreadCount} />
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            {admin.isOnline ? 'En ligne' : `Vu: ${formatLastSeen(admin.lastSeen)}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* Conversation */}
      <Card className="md:col-span-2">
        <CardHeader className="border-b">
          <CardTitle>
            {selectedAdmin ? (
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2 ${
                  selectedAdmin.isOnline ? 'border-2 border-green-500' : ''
                }`}>
                  {selectedAdmin.photo ? (
                    <img 
                      src={selectedAdmin.photo} 
                      alt={selectedAdmin.nom} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 font-medium text-sm">
                      {selectedAdmin.nom.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span>{selectedAdmin.nom}</span>
                <span className={`ml-2 text-xs ${selectedAdmin.isOnline ? 'text-green-500' : 'text-gray-500'}`}>
                  {selectedAdmin.isOnline ? 'En ligne' : 'Hors ligne'}
                </span>
              </div>
            ) : (
              'Sélectionnez un administrateur pour discuter'
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {selectedAdmin ? (
            <>
              {/* Messages */}
              <ScrollArea className="h-[50vh] p-4">
                {conversation.messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Aucun message. Commencez la conversation !
                  </div>
                ) : (
                  <div className="space-y-4">
                    {conversation.messages.map((message) => {
                      const isCurrentUser = message.senderId === user?.id;
                      return (
                        <div 
                          key={message.id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          {editingMessageId === message.id ? (
                            <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
                              <input 
                                type="text" 
                                value={editText} 
                                onChange={(e) => setEditText(e.target.value)}
                                className="w-full p-2 border rounded mb-2"
                              />
                              <div className="flex justify-end space-x-2">
                                <button 
                                  onClick={handleEditMessage}
                                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                                >
                                  Enregistrer
                                </button>
                                <button 
                                  onClick={() => setEditingMessageId(null)}
                                  className="px-3 py-1 bg-gray-300 rounded text-sm"
                                >
                                  Annuler
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div 
                              className={`p-3 rounded-lg max-w-[80%] relative group ${
                                message.isAutoReply 
                                  ? 'bg-gray-100 text-gray-800 italic' 
                                  : isCurrentUser
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-800'
                              }`}
                            >
                              <p>{message.content}</p>
                              <div className="flex justify-between items-center mt-1 text-xs">
                                <span className={`${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                                  {formatMessageTime(message.timestamp)}
                                </span>
                                {message.isEdited && (
                                  <span className={`ml-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                                    (modifié)
                                  </span>
                                )}
                              </div>
                              
                              {/* Actions sur le message (éditer/supprimer) */}
                              {isCurrentUser && !message.isAutoReply && (
                                <div className="absolute top-0 right-0 hidden group-hover:flex space-x-1 -mt-8 bg-white shadow rounded p-1">
                                  <button 
                                    onClick={() => {
                                      setEditingMessageId(message.id);
                                      setEditText(message.content);
                                    }}
                                    className="p-1 hover:bg-gray-100 rounded"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteMessage(message.id)}
                                    className="p-1 hover:bg-gray-100 rounded text-red-500"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M3 6h18"></path>
                                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
              
              {/* Formulaire de message */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="flex-1 p-2 border rounded"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="px-4 py-2 bg-red-800 text-white rounded disabled:opacity-50"
                  >
                    Envoyer
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[60vh] text-gray-500">
              Sélectionnez un administrateur pour démarrer une conversation
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const AdminChatPage = () => {
  return (
    <VideoCallProvider>
      <AdminLayout>
        <h1 className="text-2xl font-bold mb-6">Chat administrateurs</h1>
        <AdminChatContent />
      </AdminLayout>
    </VideoCallProvider>
  );
};

export default AdminChatPage;
