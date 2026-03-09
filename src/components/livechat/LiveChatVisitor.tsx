import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Minimize2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

interface LiveChatVisitorProps {
  visitorNom: string;
  adminId: string;
  onClose: () => void;
}

const LiveChatVisitor: React.FC<LiveChatVisitorProps> = ({ visitorNom, adminId, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [adminTyping, setAdminTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Generate a unique visitor ID persisted in sessionStorage
  const visitorId = useRef(
    sessionStorage.getItem('livechat_visitor_id') || 
    `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );

  useEffect(() => {
    sessionStorage.setItem('livechat_visitor_id', visitorId.current);
  }, []);

  // Load existing messages
  const loadMessages = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/messagerie/messages/${visitorId.current}/${adminId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      console.error('Error loading messages:', e);
    }
  }, [adminId]);

  // SSE connection
  useEffect(() => {
    loadMessages();

    const es = new EventSource(`${API_BASE}/api/messagerie/events?visitorId=${visitorId.current}`);
    eventSourceRef.current = es;

    es.addEventListener('new_message', (e) => {
      const msg: ChatMessage = JSON.parse(e.data);
      if (msg.visitorId === visitorId.current && msg.adminId === adminId) {
        setMessages(prev => {
          if (prev.find(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        // Mark as read
        fetch(`${API_BASE}/api/messagerie/mark-read/${visitorId.current}/${adminId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reader: 'visitor' })
        }).catch(() => {});
      }
    });

    es.addEventListener('typing', (e) => {
      const data = JSON.parse(e.data);
      if (data.from === 'admin' && data.visitorId === visitorId.current) {
        setAdminTyping(data.isTyping);
      }
    });

    es.addEventListener('admin_status', (e) => {
      // Could update admin status display here
    });

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [adminId, loadMessages]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, adminTyping]);

  // Send message
  const handleSend = async () => {
    if (!input.trim() || isSending) return;
    
    setIsSending(true);
    try {
      const res = await fetch(`${API_BASE}/api/messagerie/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId: visitorId.current,
          visitorNom,
          adminId,
          contenu: input.trim(),
          from: 'visitor'
        })
      });
      if (res.ok) {
        const msg = await res.json();
        setMessages(prev => {
          if (prev.find(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        setInput('');
        // Stop typing indicator
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
    fetch(`${API_BASE}/api/messagerie/typing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId: visitorId.current,
        adminId,
        from: 'visitor',
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

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-[9999]"
      >
        <button
          onClick={() => setIsMinimized(false)}
          className="relative p-4 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full shadow-[0_8px_30px_rgba(139,92,246,0.5)] hover:scale-110 transition-transform"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          {messages.filter(m => m.from === 'admin' && !m.lu).length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center animate-pulse">
              {messages.filter(m => m.from === 'admin' && !m.lu).length}
            </span>
          )}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 100, scale: 0.8 }}
      className="fixed bottom-6 right-6 z-[9999] w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-6rem)] flex flex-col rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-white/[0.1]"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-purple-600" />
          </div>
          <div>
            <div className="text-white font-bold text-sm">Chat en direct</div>
            <div className="text-purple-200/70 text-xs">Support en ligne</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsMinimized(true)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Minimize2 className="h-4 w-4 text-white" />
          </button>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950">
        {messages.length === 0 && (
          <div className="text-center text-purple-300/40 text-sm mt-8">
            <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
            Envoyez votre premier message !
          </div>
        )}
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.from === 'visitor' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.from === 'visitor'
                  ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-br-md'
                  : 'bg-white/[0.08] text-purple-100 border border-white/[0.06] rounded-bl-md'
              }`}
            >
              {msg.contenu}
              <div className={`text-[10px] mt-1 ${msg.from === 'visitor' ? 'text-purple-200/50' : 'text-purple-300/30'}`}>
                {new Date(msg.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {adminTyping && (
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
      <div className="p-3 bg-slate-900/90 backdrop-blur border-t border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Écrivez votre message..."
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
    </motion.div>
  );
};

export default LiveChatVisitor;
