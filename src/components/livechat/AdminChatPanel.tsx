import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { messagerieApi } from '@/services/api/messagerieApi';
import { useAuth } from '@/contexts/AuthContext';

interface Conversation {
  sessionId: string;
  visitorName: string;
  messages: any[];
  unread: number;
}

interface AdminChatMessage {
  id: string;
  sessionId: string;
  visitorName: string;
  senderType: 'visitor' | 'admin';
  senderName: string;
  content: string;
  timestamp: string;
}

const AdminChatPanel: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<AdminChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [totalUnread, setTotalUnread] = useState(0);
  const [typingVisitors, setTypingVisitors] = useState<Record<string, boolean>>({});
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const clientIdRef = useRef(`admin-${Date.now()}`);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Register admin online
  useEffect(() => {
    const id = clientIdRef.current;
    messagerieApi.goOnline(id).catch(() => {});
    return () => {
      messagerieApi.goOffline(id).catch(() => {});
    };
  }, []);

  // SSE
  useEffect(() => {
    const url = messagerieApi.getEventsUrl();
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'new-message') {
          const msg = data.message;
          // Update conversations list
          setConversations(prev => {
            const existing = prev.find(c => c.sessionId === msg.sessionId);
            if (existing) {
              return prev.map(c => c.sessionId === msg.sessionId 
                ? { ...c, messages: [...c.messages, msg], unread: msg.senderType === 'visitor' ? c.unread + 1 : c.unread }
                : c
              );
            }
            return [...prev, { sessionId: msg.sessionId, visitorName: msg.visitorName, messages: [msg], unread: msg.senderType === 'visitor' ? 1 : 0 }];
          });
          // If viewing this conversation
          if (msg.sessionId === activeSession) {
            setMessages(prev => {
              if (prev.find(m => m.id === msg.id)) return prev;
              return [...prev, msg];
            });
          }
          // Update unread
          if (msg.senderType === 'visitor') {
            setTotalUnread(prev => prev + 1);
          }
        }
        if (data.type === 'typing' && data.senderType === 'visitor') {
          setTypingVisitors(prev => ({ ...prev, [data.sessionId]: data.isTyping }));
        }
      } catch {}
    };

    return () => es.close();
  }, [activeSession]);

  // Load conversations
  useEffect(() => {
    const load = async () => {
      try {
        const convos = await messagerieApi.getConversations();
        setConversations(convos);
        const unread = await messagerieApi.getUnreadCount();
        setTotalUnread(unread.count);
      } catch {}
    };
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typingVisitors]);

  const openConversation = async (sessionId: string) => {
    setActiveSession(sessionId);
    try {
      const msgs = await messagerieApi.getConversation(sessionId);
      setMessages(msgs);
      await messagerieApi.markRead(sessionId);
      setConversations(prev => prev.map(c => c.sessionId === sessionId ? { ...c, unread: 0 } : c));
      const unread = await messagerieApi.getUnreadCount();
      setTotalUnread(unread.count);
    } catch {}
  };

  const handleSend = async () => {
    if (!input.trim() || !activeSession || isSending) return;
    setIsSending(true);
    try {
      const adminName = user ? `${user.firstName} ${user.lastName}` : 'Admin';
      const conv = conversations.find(c => c.sessionId === activeSession);
      await messagerieApi.sendMessage({
        sessionId: activeSession,
        visitorName: conv?.visitorName || '',
        senderType: 'admin',
        senderName: adminName,
        content: input.trim()
      });
      setInput('');
    } catch {}
    setIsSending(false);
  };

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
    if (activeSession && value.length > 0) {
      messagerieApi.sendTyping(activeSession, 'admin', true).catch(() => {});
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        if (activeSession) messagerieApi.sendTyping(activeSession, 'admin', false).catch(() => {});
      }, 2000);
    }
  }, [activeSession]);

  return (
    <>
      {/* Chat icon button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="relative rounded-2xl h-10 w-10 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-indigo-500/10 transition-all duration-300"
        >
          <MessageCircle className="h-5 w-5 text-purple-500" />
          {totalUnread > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-pulse shadow-lg shadow-red-500/40">
              {totalUnread}
            </span>
          )}
        </Button>
      </motion.div>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-4 right-4 z-[9999] w-[400px] max-w-[calc(100vw-2rem)] h-[500px] rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col bg-gradient-to-b from-slate-900 to-slate-950"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                {activeSession && (
                  <Button variant="ghost" size="icon" onClick={() => setActiveSession(null)} className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                )}
                <div>
                  <div className="text-white font-bold text-sm">
                    {activeSession ? conversations.find(c => c.sessionId === activeSession)?.visitorName || 'Conversation' : 'Messagerie Live'}
                  </div>
                  <div className="text-purple-200 text-xs">{activeSession ? 'En direct' : `${conversations.length} conversation(s)`}</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {!activeSession ? (
              /* Conversation list */
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {conversations.length === 0 && (
                  <div className="text-center text-purple-300/40 text-sm mt-16">
                    <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Aucune conversation en cours</p>
                  </div>
                )}
                {conversations.map((conv) => (
                  <button
                    key={conv.sessionId}
                    onClick={() => openConversation(conv.sessionId)}
                    className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all duration-200 text-left flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {(conv.visitorName || '?')[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-semibold truncate">{conv.visitorName || 'Visiteur'}</div>
                      <div className="text-purple-300/40 text-xs truncate">
                        {conv.messages[conv.messages.length - 1]?.content || ''}
                      </div>
                    </div>
                    {conv.unread > 0 && (
                      <Badge className="bg-red-500 text-white border-0 text-xs animate-pulse">{conv.unread}</Badge>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              /* Active conversation */
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={scrollRef}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                        msg.senderType === 'admin'
                          ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-br-md'
                          : 'bg-white/10 text-purple-100 border border-white/5 rounded-bl-md'
                      }`}>
                        <div className="text-[10px] opacity-60 mb-1 font-medium">{msg.senderName}</div>
                        <div className="text-sm leading-relaxed">{msg.content}</div>
                        <div className="text-[9px] opacity-40 mt-1 text-right">
                          {new Date(msg.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {typingVisitors[activeSession] && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                      <div className="bg-white/10 rounded-2xl rounded-bl-md px-4 py-3 border border-white/5">
                        <div className="flex gap-1.5">
                          <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="border-t border-white/5 p-3 flex gap-2 shrink-0">
                  <Input
                    value={input}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Répondre..."
                    className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-purple-300/30 rounded-xl h-11"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isSending}
                    className="h-11 w-11 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 border border-white/10 p-0"
                  >
                    <Send className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminChatPanel;
