import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { messagerieApi } from '@/services/api/messagerieApi';

interface LiveChatMessage {
  id: string;
  sessionId: string;
  visitorName: string;
  senderType: 'visitor' | 'admin';
  senderName: string;
  content: string;
  timestamp: string;
  lu: boolean;
}

interface LiveChatWidgetProps {
  visitorName: string;
  onClose: () => void;
}

const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({ visitorName, onClose }) => {
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => `live-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Connect to SSE
  useEffect(() => {
    const url = messagerieApi.getEventsUrl();
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'new-message' && data.message.sessionId === sessionId) {
          setMessages(prev => {
            if (prev.find(m => m.id === data.message.id)) return prev;
            return [...prev, data.message];
          });
        }
        if (data.type === 'typing' && data.sessionId === sessionId && data.senderType === 'admin') {
          setIsTyping(data.isTyping);
        }
      } catch {}
    };

    return () => {
      es.close();
    };
  }, [sessionId]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Send typing indicator
  const handleInputChange = useCallback((value: string) => {
    setInput(value);
    if (value.length > 0) {
      messagerieApi.sendTyping(sessionId, 'visitor', true).catch(() => {});
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        messagerieApi.sendTyping(sessionId, 'visitor', false).catch(() => {});
      }, 2000);
    }
  }, [sessionId]);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;
    setIsSending(true);
    try {
      await messagerieApi.sendMessage({
        sessionId,
        visitorName,
        senderType: 'visitor',
        senderName: visitorName,
        content: input.trim()
      });
      setInput('');
    } catch {}
    setIsSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-4 right-4 z-[9999] w-[360px] max-w-[calc(100vw-2rem)] rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-purple-600 animate-pulse" />
          </div>
          <div>
            <div className="text-white font-bold text-sm">Chat en direct</div>
            <div className="text-purple-200 text-xs">Un administrateur est en ligne</div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 h-[350px] overflow-y-auto p-4 space-y-3" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="text-center text-purple-300/40 text-sm mt-12">
            <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Démarrez la conversation !</p>
            <p className="text-xs mt-1">Un administrateur vous répondra en temps réel.</p>
          </div>
        )}
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.senderType === 'visitor' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
              msg.senderType === 'visitor'
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

        {/* Typing indicator */}
        {isTyping && (
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

      {/* Input */}
      <div className="bg-slate-900 border-t border-white/5 p-3 flex gap-2">
        <Input
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Écrivez votre message..."
          className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-purple-300/30 rounded-xl focus:border-purple-400/30 h-11"
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim() || isSending}
          className="h-11 w-11 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 border border-white/10 shadow-lg shadow-purple-500/20 p-0"
        >
          <Send className="h-4 w-4 text-white" />
        </Button>
      </div>
    </motion.div>
  );
};

export default LiveChatWidget;
