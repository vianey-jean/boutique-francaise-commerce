
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientChatAPI, Message, User } from '@/services/api';
import { toast } from '@/components/ui/sonner';
import { useNotifications } from '@/contexts/NotificationContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Send, User as UserIcon, Edit, Trash2, Smile } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface ServiceConversation {
  id: string;
  clientId: string;
  clientName: string;
  lastMessage: string;
  lastActivity: string;
  unreadCount: number;
  messages: Message[];
}

const AdminClientChatPage = () => {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const queryClient = useQueryClient();
  const { markClientChatAsRead } = useNotifications();

  // Récupérer toutes les conversations client
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['clientConversations'],
    queryFn: async () => {
      try {
        const response = await clientChatAPI.getServiceConversations();
        return response.data || [];
      } catch (error) {
        console.error("Erreur lors de la récupération des conversations:", error);
        toast.error("Impossible de récupérer les conversations");
        return [];
      }
    },
    refetchInterval: 5000 // Rafraîchir toutes les 5 secondes
  });

  // Envoyer un message à un client
  const sendMessageMutation = useMutation({
    mutationFn: async ({ clientId, content }: { clientId: string; content: string }) => {
      return clientChatAPI.sendServiceReply(clientId, content);
    },
    onSuccess: () => {
      setMessageText('');
      queryClient.invalidateQueries({ queryKey: ['clientConversations'] });
    },
    onError: (error) => {
      toast.error("Erreur lors de l'envoi du message");
      console.error(error);
    }
  });

  // Modifier un message
  const editMessageMutation = useMutation({
    mutationFn: async ({ messageId, content, conversationId }: { messageId: string; content: string; conversationId: string }) => {
      return clientChatAPI.editMessage(messageId, content, conversationId);
    },
    onSuccess: () => {
      setEditingMessageId(null);
      setEditText('');
      queryClient.invalidateQueries({ queryKey: ['clientConversations'] });
    },
    onError: (error) => {
      toast.error("Erreur lors de la modification du message");
      console.error(error);
    }
  });

  // Supprimer un message
  const deleteMessageMutation = useMutation({
    mutationFn: async ({ messageId, conversationId }: { messageId: string; conversationId: string }) => {
      return clientChatAPI.deleteMessage(messageId, conversationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientConversations'] });
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression du message");
      console.error(error);
    }
  });

  // Effet pour faire défiler vers le bas quand une conversation est sélectionnée
  useEffect(() => {
    if (selectedClient) {
      const messagesDiv = document.getElementById('messages-container');
      if (messagesDiv) {
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }
      
      // Marquer comme lu
      markClientChatAsRead(selectedClient);
    }
  }, [selectedClient, conversations]);

  // Sélectionner le premier client si aucun n'est sélectionné
  useEffect(() => {
    if (!isLoading && conversations.length > 0 && !selectedClient) {
      setSelectedClient(conversations[0].clientId);
    }
  }, [conversations, isLoading, selectedClient]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedClient) return;
    sendMessageMutation.mutate({ clientId: selectedClient, content: messageText });
  };

  const handleEditMessage = (messageId: string, conversationId: string) => {
    if (!editText.trim()) return;
    editMessageMutation.mutate({ messageId, content: editText, conversationId });
  };

  const startEditMessage = (message: Message) => {
    setEditingMessageId(message.id);
    setEditText(message.content);
  };

  const handleDeleteMessage = (messageId: string, conversationId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      deleteMessageMutation.mutate({ messageId, conversationId });
    }
  };

  const formatTime = (dateString: string) => {
    return formatDistance(new Date(dateString), new Date(), {
      addSuffix: true,
      locale: fr
    });
  };

  const selectedConversation = conversations.find(conv => conv.clientId === selectedClient);
  
  const handleEmojiSelect = (emoji: any) => {
    setMessageText((prev) => prev + emoji.native);
  };
  
  const handleEditEmojiSelect = (emoji: any) => {
    setEditText((prev) => prev + emoji.native);
  };

  return (
    <div className="h-full">
      <h1 className="text-2xl font-bold mb-6">Service Client</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Liste des conversations */}
        <Card className="md:col-span-1 overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gray-100 p-4">
              <h2 className="font-semibold text-gray-700">Conversations</h2>
            </div>
            <ScrollArea className="h-[calc(100vh-280px)]">
              {isLoading ? (
                <div className="p-4 text-center">Chargement...</div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">Aucune conversation</div>
              ) : (
                <div>
                  {conversations.map((conv) => (
                    <div 
                      key={conv.clientId}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${selectedClient === conv.clientId ? 'bg-gray-100' : ''}`}
                      onClick={() => setSelectedClient(conv.clientId)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-blue-100 text-blue-800 w-10 h-10 rounded-full flex items-center justify-center">
                            <UserIcon className="h-5 w-5" />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">{conv.clientName || `Client ${conv.clientId.substring(0, 6)}`}</p>
                            <p className="text-xs text-gray-500">{formatTime(conv.lastActivity)}</p>
                          </div>
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="bg-red-800 text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {conv.lastMessage}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
        
        {/* Conversation */}
        <Card className="md:col-span-3 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="bg-gray-100 p-4 border-b flex items-center">
                <div className="bg-blue-100 text-blue-800 w-10 h-10 rounded-full flex items-center justify-center">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h2 className="font-semibold">
                    {selectedConversation.clientName || `Client ${selectedConversation.clientId.substring(0, 6)}`}
                  </h2>
                  <p className="text-xs text-gray-500">
                    Dernière activité : {formatTime(selectedConversation.lastActivity)}
                  </p>
                </div>
              </div>
              
              <ScrollArea id="messages-container" className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.senderId !== selectedClient ? 'justify-end' : 'justify-start'}`}
                    >
                      {editingMessageId === message.id ? (
                        <div className="w-full max-w-[80%] bg-gray-50 p-3 rounded-lg">
                          <div className="flex flex-col">
                            <Textarea 
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="flex-1 mb-2"
                            />
                            <div className="flex justify-end space-x-2">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="outline" size="icon">
                                    <Smile className="h-4 w-4" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0" side="top">
                                  <Picker 
                                    data={data} 
                                    onEmojiSelect={handleEditEmojiSelect}
                                    theme="light"
                                  />
                                </PopoverContent>
                              </Popover>
                              <Button 
                                onClick={() => handleEditMessage(message.id, `client-${selectedClient}-service`)} 
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={editMessageMutation.isPending}
                              >
                                Enregistrer
                              </Button>
                              <Button 
                                variant="ghost" 
                                onClick={() => setEditingMessageId(null)} 
                              >
                                Annuler
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className={`max-w-[80%] rounded-lg px-4 py-2 relative group ${
                            message.isSystemMessage ? 'bg-gray-200 text-gray-700' :
                            message.senderId !== selectedClient 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          {message.senderId !== selectedClient && !message.isSystemMessage && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 h-6 w-6 text-white"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => startEditMessage(message)}>
                                  <Edit className="mr-2 h-4 w-4" /> Modifier
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteMessage(message.id, `client-${selectedClient}-service`)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                          <p>{message.content}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className={`text-xs ${message.senderId !== selectedClient ? 'text-blue-100' : 'text-gray-500'}`}>
                              {formatTime(message.timestamp)}
                            </p>
                            {message.isEdited && (
                              <p className="text-xs ml-2 opacity-80">(modifié)</p>
                            )}
                            {message.isAutoReply && (
                              <p className="text-xs ml-2 opacity-80">(réponse automatique)</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Écrivez votre message..."
                      className="resize-none pr-10"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-2 bottom-2"
                        >
                          <Smile className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" side="top">
                        <Picker 
                          data={data} 
                          onEmojiSelect={handleEmojiSelect}
                          theme="light"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Button 
                    onClick={handleSendMessage} 
                    className="bg-red-800 hover:bg-red-700 self-end h-10"
                    disabled={sendMessageMutation.isPending || !messageText.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-500">Aucune conversation sélectionnée</p>
                <p className="text-sm text-gray-400">Sélectionnez une conversation pour commencer</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminClientChatPage;
