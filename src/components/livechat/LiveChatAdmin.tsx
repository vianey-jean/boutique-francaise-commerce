import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Minimize2, Loader2, ChevronLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://server-gestion-ventes.onrender.com';

interface ChatMessage {
  id: string;
  visitorId: string;
  visitorNom: string;
  adminId: string;
  contenu: string;
  from: 'visitor' | 'admin';
  date: string;
  lu: boolean;
}

interface Conversation {
  visitorId: string;
  visitorNom: string;
  messages: ChatMessage[];
  lastMessage: ChatMessage;
  unreadCount: number;
}

const LiveChatAdmin: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [visitorTyping, setVisitorTyping] = useState<Record<string, boolean>>({});
  const [totalUnread, setTotalUnread] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Check if user is admin
  const isAdmin = user?.role === 'administrateur';

  // Load conversations
  const loadConversations = useCallback(async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/messagerie/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
        setTotalUnread(data.reduce((sum: number, c: Conversation) => sum + c.unreadCount, 0));
      }
    } catch (e) {
      console.error('Error loading conversations:', e);
    }
  }, [user]);

  // Load messages for selected conversation
  const loadMessages = useCallback(async (visitorId: string) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/api/messagerie/messages/${visitorId}/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        // Mark as read
        fetch(`${API_BASE}/api/messagerie/mark-read/${visitorId}/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reader: 'admin' })
        }).then(() => loadConversations()).catch(() => {});
      }
    } catch (e) {
      console.error('Error loading messages:', e);
    }
  }, [user, loadConversations]);

  // SSE connection
  useEffect(() => {
    if (!isAuthenticated || !isAdmin || !user) return;

    loadConversations();

    const es = new EventSource(`${API_BASE}/api/messagerie/events?adminId=${user.id}`);
    eventSourceRef.current = es;

    es.addEventListener('new_message', (e) => {
      const msg: ChatMessage = JSON.parse(e.data);
      if (msg.adminId === user.id) {
        // If this conversation is currently open, add message
        if (selectedConv === msg.visitorId && msg.from === 'visitor') {
          setMessages(prev => {
            if (prev.find(m => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
          // Mark as read immediately
          fetch(`${API_BASE}/api/messagerie/mark-read/${msg.visitorId}/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reader: 'admin' })
          }).catch(() => {});
        }
        loadConversations();
      }
    });

    es.addEventListener('new_conversation_message', (e) => {
      const msg: ChatMessage = JSON.parse(e.data);
      if (msg.adminId === user.id) {
        loadConversations();
      }
    });

    es.addEventListener('typing', (e) => {
      const data = JSON.parse(e.data);
      if (data.from === 'visitor') {
        setVisitorTyping(prev => ({ ...prev, [data.visitorId]: data.isTyping }));
      }
    });

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [isAuthenticated, isAdmin, user, loadConversations, selectedConv]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, visitorTyping]);

  // Open a conversation
  const openConversation = (visitorId: string) => {
    setSelectedConv(visitorId);
    loadMessages(visitorId);
  };

  // Send message
  const handleSend = async () => {
    if (!input.trim() || isSending || !selectedConv || !user) return;
    
    setIsSending(true);
    try {
      const conv = conversations.find(c => c.visitorId === selectedConv);
      const res = await fetch(`${API_BASE}/api/messagerie/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId: selectedConv,
          visitorNom: conv?.visitorNom || 'Visiteur',
          adminId: user.id,
          contenu: input.trim(),
          from: 'admin'
        })
      });
      if (res.ok) {
        const msg = await res.json();
        setMessages(prev => {
          if (prev.find(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        setInput('');
        sendTypingIndicator(false);
      }
    } catch (e) {
      console.error('Error sending:', e);
    } finally {
      setIsSending(false);
    }
  };

  // Typing indicator
  const sendTypingIndicator = (isTyping: boolean) => {
    if (!selectedConv || !user) return;
    fetch(`${API_BASE}/api/messagerie/typing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId: selectedConv,
        adminId: user.id,
        from: 'admin',
        isTyping
      })
    }).catch(() => {});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    sendTypingIndicator(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => sendTypingIndicator(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isAuthenticated || !isAdmin) return null;

  // Floating button
  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-[9999]"
      >
        <button
          onClick={() => { setIsOpen(true); loadConversations(); }}
          className="relative p-4 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full shadow-[0_8px_30px_rgba(139,92,246,0.5)] hover:scale-110 transition-transform"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          {totalUnread > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center px-1 animate-pulse">
              {totalUnread}
            </span>
          )}
        </button>
      </motion.div>
    );
  }

  const selectedConversation = conversations.find(c => c.visitorId === selectedConv);

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="fixed bottom-6 right-6 z-[9999] w-[400px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-6rem)] flex flex-col rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-white/[0.1]"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-5 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {selectedConv && (
            <button onClick={() => { setSelectedConv(null); setMessages([]); }} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
          )}
          <div>
            <div className="text-white font-bold text-sm">
              {selectedConversation ? selectedConversation.visitorNom : 'Messagerie Live'}
            </div>
            <div className="text-purple-200/70 text-xs">
              {selectedConv
                ? (visitorTyping[selectedConv] ? 'En train d\'écrire...' : 'En ligne')
                : `${conversations.length} conversation${conversations.length > 1 ? 's' : ''}`
              }
            </div>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <X className="h-4 w-4 text-white" />
        </button>
      </div>

      {/* Conversation list OR Messages */}
      {!selectedConv ? (
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950">
          {conversations.length === 0 ? (
            <div className="text-center text-purple-300/40 text-sm mt-16">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
              Aucune conversation en cours
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.visitorId}
                onClick={() => openConversation(conv.visitorId)}
                className="w-full px-5 py-4 flex items-center gap-3 hover:bg-white/[0.04] transition-colors border-b border-white/[0.04] text-left"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 border border-white/[0.08] flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {conv.visitorNom.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-sm truncate">{conv.visitorNom}</span>
                    {conv.lastMessage && (
                      <span className="text-purple-300/30 text-[10px] shrink-0 ml-2">
                        {new Date(conv.lastMessage.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-purple-300/40 text-xs truncate">
                      {conv.lastMessage?.contenu || ''}
                    </span>
                    {conv.unreadCount > 0 && (
                      <span className="min-w-[18px] h-[18px] bg-violet-500 rounded-full text-white text-[10px] flex items-center justify-center px-1 shrink-0 ml-2">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      ) : (
        <>
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.from === 'admin' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.from === 'admin'
                      ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-br-md'
                      : 'bg-white/[0.08] text-purple-100 border border-white/[0.06] rounded-bl-md'
                  }`}
                >
                  {msg.contenu}
                  <div className={`text-[10px] mt-1 ${msg.from === 'admin' ? 'text-purple-200/50' : 'text-purple-300/30'}`}>
                    {new Date(msg.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            <AnimatePresence>
              {selectedConv && visitorTyping[selectedConv] && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/[0.08] border border-white/[0.06] rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                    <span className="w-2 h-2 bg-purple-400/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-purple-400/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-purple-400/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-slate-900/90 backdrop-blur border-t border-white/[0.06] shrink-0">
            <div className="flex items-center gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Répondre..."
                className="flex-1 h-11 bg-white/[0.05] border-white/[0.08] text-white placeholder:text-purple-300/30 rounded-xl focus:bg-white/[0.08] focus:border-purple-400/30"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isSending}
                className="h-11 w-11 p-0 bg-gradient-to-br from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl shadow-lg border border-white/10"
              >
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default LiveChatAdmin;
