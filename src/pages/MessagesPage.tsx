import React, { useState, useEffect } from 'react';
import { MessageService, ContactMessage } from '@/services/MessageService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail, MailOpen, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';

const MessagesPage = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await MessageService.getAllMessages();
      setMessages(data);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
      toast.error('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMessageClick = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);

    if (!message.lu) {
      const success = await MessageService.markAsRead(message.id);
      if (success) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === message.id ? { ...msg, lu: true } : msg
          )
        );
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = messages.filter(msg => !msg.lu).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 pt-20 px-4">
        <div className="container mx-auto py-8">
          <div className="text-center">Chargement des messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 pt-20 px-4">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Messages de Contact
          </h1>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm">
              {messages.length} message(s) total
            </Badge>
            {unreadCount > 0 && (
              <Badge className="bg-green-500 text-white">
                {unreadCount} non lu(s)
              </Badge>
            )}
          </div>
        </div>

        {messages.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun message</h3>
              <p className="text-muted-foreground">
                Vous n'avez reçu aucun message de contact pour le moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {messages.map((message) => (
              <Card 
                key={message.id} 
                className={`cursor-pointer hover:shadow-md transition-all ${
                  !message.lu ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' : ''
                }`}
                onClick={() => handleMessageClick(message)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {message.lu ? (
                        <MailOpen className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <Mail className="w-5 h-5 text-green-600" />
                      )}
                      <div>
                        <CardTitle className="text-lg">{message.sujet}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {message.nom}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {message.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(message.dateEnvoi)}
                          </div>
                        </div>
                      </div>
                    </div>
                    {!message.lu && (
                      <Badge className="bg-green-500 text-white">Nouveau</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">
                    {message.message}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            {selectedMessage && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    {selectedMessage.sujet}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">De:</label>
                      <p className="font-medium">{selectedMessage.nom}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email:</label>
                      <p className="font-medium">{selectedMessage.email}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Date:</label>
                      <p className="font-medium">{formatDate(selectedMessage.dateEnvoi)}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Message:</label>
                    <div className="p-4 bg-background border rounded-lg">
                      <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => setIsDialogOpen(false)}>
                      Fermer
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MessagesPage;