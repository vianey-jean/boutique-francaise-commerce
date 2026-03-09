import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMessages } from '@/hooks/use-messages';
import { useAuth } from '@/contexts/AuthContext';
import messagerieApi from '@/services/api/messagerieApi';

const FloatingChatWidget: React.FC = () => {
  const { unreadCount } = useMessages();
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Générer/récupérer un sessionId pour le visiteur
  useEffect(() => {
    if (!isAuthenticated) {
      const stored = localStorage.getItem('visitorsessionId');
      if (stored) {
        setSessionId(stored);
      } else {
        const newId = `visitor-${Date.now()}-${Math.random()}`;
        localStorage.setItem('visitorsessionId', newId);
        setSessionId(newId);
      }
    }
  }, [isAuthenticated]);

  // Charger les messages existants
  useEffect(() => {
    if (isOpen && sessionId) {
      messagerieApi.getConversation(sessionId)
        .then(setMessages)
        .catch(() => setMessages([]));
    }
  }, [isOpen, sessionId]);

  // Listener pour les nouveaux messages (SSE)
  useEffect(() => {
    if (!isOpen || !sessionId) return;

    const eventSource = new EventSource(
      `${messagerieApi.getEventsUrl()}?sessionId=${sessionId}`
    );

    eventSource.onmessage = (event) => {
      try {
        const newMsg = JSON.parse(event.data);
        setMessages((prev) => [...prev, newMsg]);
      } catch (e) {
        console.error('Erreur parsing SSE:', e);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, [isOpen, sessionId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      await messagerieApi.sendMessage({
        sessionId,
        visitorName: 'Visiteur',
        senderType: 'visitor',
        senderName: 'Visiteur',
        content: newMessage,
      });
      setNewMessage('');
      // Le message apparaîtra via SSE
    } catch (error) {
      console.error('Erreur envoi message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Ne montrer que si unreadCount > 0
  if (unreadCount === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-16 right-0 w-80 max-h-96 bg-gradient-to-br from-white/95 to-violet-50/95 dark:from-[#0a0020]/95 dark:to-violet-950/60 rounded-3xl border border-violet-200/40 dark:border-violet-800/40 shadow-2xl shadow-violet-500/20 flex flex-col backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-violet-200/20 dark:border-violet-800/20">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-sm text-violet-700 dark:text-violet-300">
                  Support Direct
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-violet-500/10 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
              {messages.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center mt-6">
                  Aucun message pour le moment
                </p>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.senderType === 'visitor' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`px-3 py-2 rounded-2xl max-w-[70%] text-sm ${
                        msg.senderType === 'visitor'
                          ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white'
                          : 'bg-white/60 dark:bg-white/10 text-foreground'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-violet-200/20 dark:border-violet-800/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Votre message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/60 dark:bg-white/5 border border-violet-200/30 dark:border-violet-800/30 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                />
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !newMessage.trim()}
                  size="sm"
                  className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:shadow-lg hover:shadow-violet-500/30 text-white rounded-xl"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button flottant */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-2xl shadow-violet-500/40 flex items-center justify-center hover:shadow-3xl hover:shadow-violet-500/60 transition-all"
      >
        <MessageCircle className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-lg">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default FloatingChatWidget;
