import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, ChevronLeft, Users, Smile, Heart, Pencil, Trash2, Check, XCircle, Crown, Shield, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://server-gestion-ventes.onrender.com';
const EMOJI_LIST = ['😀','😂','😍','🥰','😎','🤔','👍','👏','❤️','🔥','🎉','😢','😮','🙏','💪','✨','😊','🤗','😘','👌'];

interface AdminMessage {
  id: string;
  type: 'admin_chat';
  senderId: string;
  senderNom: string;
  senderRole: string;
  senderPhoto: string | null;
  receiverId: string;
  receiverNom: string;
  receiverRole: string;
  receiverPhoto: string | null;
  contenu: string;
  date: string;
  lu: boolean;
  edited?: boolean;
  deleted?: boolean;
}

interface AdminPartner {
  id: string;
  nom: string;
  role: string;
  profilePhoto: string | null;
}

interface Conversation {
  partnerId: string;
  partnerNom: string;
  partnerRole: string;
  partnerPhoto: string | null;
  lastMessage: AdminMessage;
  unreadCount: number;
}

const AdminToAdminChat: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [selectedPartnerName, setSelectedPartnerName] = useState('');
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState<Record<string, boolean>>({});
  const [totalUnread, setTotalUnread] = useState(0);
  const [showEmojis, setShowEmojis] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [contextMenuId, setContextMenuId] = useState<string | null>(null);
  const [showAdminList, setShowAdminList] = useState(false);
  const [adminList, setAdminList] = useState<AdminPartner[]>([]);
  const [view, setView] = useState<'conversations' | 'chat' | 'newChat'>('conversations');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedPartnerRef = useRef<string | null>(null);

  const isAdmin = user?.role === 'administrateur' || user?.role === 'administrateur principale';
  const token = () => localStorage.getItem('token') || '';

  useEffect(() => { selectedPartnerRef.current = selectedPartner; }, [selectedPartner]);

  const loadConversations = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin-chat/conversations`, {
        headers: { Authorization: `Bearer ${token()}` }
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
        setTotalUnread(data.reduce((s: number, c: Conversation) => s + c.unreadCount, 0));
      }
    } catch (e) { console.error('Error loading admin conversations:', e); }
  }, [user]);

  const loadMessages = useCallback(async (partnerId: string) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin-chat/messages/${partnerId}`, {
        headers: { Authorization: `Bearer ${token()}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        fetch(`${API_BASE}/api/admin-chat/mark-read/${partnerId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` }
        }).then(() => loadConversations()).catch(() => {});
      }
    } catch (e) { console.error('Error loading admin messages:', e); }
  }, [user, loadConversations]);

  const loadAdminList = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin-chat/admins`, {
        headers: { Authorization: `Bearer ${token()}` }
      });
      if (res.ok) setAdminList(await res.json());
    } catch (e) { console.error('Error loading admin list:', e); }
  };

  // SSE + polling
  useEffect(() => {
    if (!isAuthenticated || !isAdmin || !user) return;
    loadConversations();

    const es = new EventSource(`${API_BASE}/api/admin-chat/events?token=${token()}`);

    es.addEventListener('admin_new_message', (e) => {
      try {
        const msg: AdminMessage = JSON.parse(e.data);
        const partnerId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
        if (selectedPartnerRef.current === partnerId) {
          setMessages(prev => prev.find(m => m.id === msg.id) ? prev : [...prev, msg]);
          if (msg.senderId !== user.id) {
            fetch(`${API_BASE}/api/admin-chat/mark-read/${partnerId}`, {
              method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` }
            }).catch(() => {});
          }
        }
        loadConversations();
      } catch {}
    });

    es.addEventListener('admin_message_edited', (e) => {
      try {
        const msg: AdminMessage = JSON.parse(e.data);
        setMessages(prev => prev.map(m => m.id === msg.id ? msg : m));
      } catch {}
    });

    es.addEventListener('admin_message_deleted', (e) => {
      try {
        const msg: AdminMessage = JSON.parse(e.data);
        setMessages(prev => prev.map(m => m.id === msg.id ? msg : m));
      } catch {}
    });

    es.addEventListener('admin_typing', (e) => {
      try {
        const data = JSON.parse(e.data);
        setPartnerTyping(prev => ({ ...prev, [data.senderId]: data.isTyping }));
      } catch {}
    });

    const pollInterval = setInterval(() => {
      const cur = selectedPartnerRef.current;
      if (cur) {
        fetch(`${API_BASE}/api/admin-chat/messages/${cur}`, {
          headers: { Authorization: `Bearer ${token()}` }
        }).then(r => r.ok ? r.json() : []).then(data => setMessages(data)).catch(() => {});
      }
      loadConversations();
    }, 3000);

    return () => { es.close(); clearInterval(pollInterval); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isAdmin, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, partnerTyping]);

  const openConversation = (partnerId: string, partnerNom: string) => {
    setSelectedPartner(partnerId);
    setSelectedPartnerName(partnerNom);
    setView('chat');
    loadMessages(partnerId);
  };

  const handleSend = async () => {
    if (!input.trim() || isSending || !selectedPartner || !user) return;
    setIsSending(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin-chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ receiverId: selectedPartner, contenu: input.trim() })
      });
      if (res.ok) {
        const msg = await res.json();
        setMessages(prev => prev.find(m => m.id === msg.id) ? prev : [...prev, msg]);
        setInput('');
        setShowEmojis(false);
        sendTypingIndicator(false);
        loadConversations();
      }
    } catch (e) { console.error('Error sending:', e); }
    finally { setIsSending(false); }
  };

  const handleEdit = async (msgId: string) => {
    if (!editText.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin-chat/edit/${msgId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ contenu: editText.trim() })
      });
      if (res.ok) {
        const updated = await res.json();
        setMessages(prev => prev.map(m => m.id === updated.id ? updated : m));
      }
    } catch {}
    setEditingId(null);
    setEditText('');
  };

  const handleDelete = async (msgId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin-chat/delete/${msgId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` }
      });
      if (res.ok) {
        const updated = await res.json();
        setMessages(prev => prev.map(m => m.id === updated.id ? updated : m));
      }
    } catch {}
    setContextMenuId(null);
  };

  const sendTypingIndicator = (isTyping: boolean) => {
    if (!selectedPartner || !user) return;
    fetch(`${API_BASE}/api/admin-chat/typing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ receiverId: selectedPartner, isTyping })
    }).catch(() => {});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    sendTypingIndicator(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => sendTypingIndicator(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  if (!isAuthenticated || !isAdmin) return null;

  const getRoleIcon = (role: string) => {
    return role === 'administrateur principale'
      ? <Crown className="h-3 w-3 text-amber-400" />
      : <Shield className="h-3 w-3 text-blue-400" />;
  };

  const getInitial = (nom: string) => nom?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 rounded-3xl overflow-hidden border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 px-5 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {view !== 'conversations' && (
            <button onClick={() => { setView('conversations'); setSelectedPartner(null); setMessages([]); }} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
          )}
          <div>
            <div className="text-white font-bold text-sm flex items-center gap-2">
              {view === 'chat' ? (
                <>{selectedPartnerName}</>
              ) : view === 'newChat' ? (
                <>Nouvelle conversation</>
              ) : (
                <><Users className="h-4 w-4" /> Messagerie Admin</>
              )}
            </div>
            <div className="text-blue-200/70 text-xs">
              {view === 'chat' && selectedPartner
                ? (partnerTyping[selectedPartner] ? 'En train d\'écrire...' : 'Administrateur')
                : view === 'conversations'
                  ? `${conversations.length} conversation${conversations.length !== 1 ? 's' : ''}`
                  : 'Choisir un administrateur'
              }
            </div>
          </div>
        </div>
        {totalUnread > 0 && view === 'conversations' && (
          <span className="min-w-[20px] h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center px-1.5 animate-pulse">
            {totalUnread}
          </span>
        )}
      </div>

      {/* Content */}
      {view === 'conversations' ? (
        <div className="flex-1 overflow-y-auto">
          {/* New conversation button */}
          <button
            onClick={() => { setView('newChat'); loadAdminList(); }}
            className="w-full px-5 py-4 flex items-center gap-3 hover:bg-white/[0.04] transition-colors border-b border-white/[0.06] text-left"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 border border-emerald-400/20 flex items-center justify-center">
              <Plus className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="text-emerald-300 font-semibold text-sm">Nouvelle conversation</span>
          </button>

          {conversations.length === 0 ? (
            <div className="text-center text-blue-300/40 text-sm mt-12 px-6">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Aucune conversation</p>
              <p className="text-xs mt-1">Commencez à discuter avec un autre administrateur</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.partnerId}
                onClick={() => openConversation(conv.partnerId, conv.partnerNom)}
                className="w-full px-5 py-4 flex items-center gap-3 hover:bg-white/[0.04] transition-colors border-b border-white/[0.04] text-left"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/30 to-blue-500/30 border border-white/[0.08] flex items-center justify-center text-white font-bold text-sm shrink-0 relative">
                  {conv.partnerPhoto ? (
                    <img src={`${API_BASE}${conv.partnerPhoto}`} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : getInitial(conv.partnerNom)}
                  <div className="absolute -bottom-0.5 -right-0.5">{getRoleIcon(conv.partnerRole || '')}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-sm truncate">{conv.partnerNom}</span>
                    {conv.lastMessage && (
                      <span className="text-blue-300/30 text-[10px] shrink-0 ml-2">
                        {new Date(conv.lastMessage.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-blue-300/40 text-xs truncate">
                      {conv.lastMessage ? (
                        conv.lastMessage.deleted
                          ? '🚫 Message supprimé'
                          : conv.lastMessage.senderId === user?.id
                            ? `Vous : ${conv.lastMessage.contenu}`
                            : conv.lastMessage.contenu
                      ) : ''}
                    </span>
                    {conv.unreadCount > 0 && (
                      <span className="min-w-[18px] h-[18px] bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center px-1 shrink-0 ml-2 animate-pulse">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      ) : view === 'newChat' ? (
        <div className="flex-1 overflow-y-auto p-4">
          {adminList.length === 0 ? (
            <div className="text-center text-blue-300/40 text-sm mt-12">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
              Aucun autre administrateur trouvé
            </div>
          ) : (
            <div className="space-y-2">
              {adminList.map((admin) => (
                <button
                  key={admin.id}
                  onClick={() => openConversation(admin.id, admin.nom)}
                  className="w-full p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-all flex items-center gap-3 text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/30 to-blue-500/30 border border-white/[0.08] flex items-center justify-center text-white font-bold text-sm shrink-0 relative">
                    {admin.profilePhoto ? (
                      <img src={`${API_BASE}${admin.profilePhoto}`} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : getInitial(admin.nom)}
                    <div className="absolute -bottom-0.5 -right-0.5">{getRoleIcon(admin.role)}</div>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{admin.nom}</p>
                    <p className="text-blue-300/50 text-xs flex items-center gap-1">
                      {getRoleIcon(admin.role)} {admin.role === 'administrateur principale' ? 'Admin Principal' : 'Administrateur'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" onClick={() => { setContextMenuId(null); setShowEmojis(false); }}>
            {messages.map((msg) => {
              const isMine = msg.senderId === user?.id;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'} group relative`}
                >
                  <div className="relative max-w-[80%]">
                    {!isMine && (
                      <div className="text-[10px] text-cyan-400 font-semibold mb-1 ml-1 flex items-center gap-1">
                        {getRoleIcon(msg.senderRole)} {msg.senderNom}
                      </div>
                    )}

                    {msg.deleted ? (
                      <div className={`px-4 py-2.5 rounded-2xl text-sm italic ${
                        isMine ? 'bg-white/[0.04] text-blue-300/40 rounded-br-md' : 'bg-white/[0.04] text-blue-300/40 rounded-bl-md'
                      }`}>
                        🚫 Ce message a été supprimé
                        <div className="text-[10px] mt-1 text-blue-300/20">
                          {new Date(msg.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ) : editingId === msg.id ? (
                      <div className="flex items-center gap-1">
                        <Input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleEdit(msg.id); if (e.key === 'Escape') { setEditingId(null); setEditText(''); } }}
                          className="h-9 text-sm bg-white/[0.08] border-blue-400/30 text-white rounded-lg"
                          autoFocus
                        />
                        <button onClick={() => handleEdit(msg.id)} className="p-1.5 text-emerald-400 hover:bg-white/10 rounded-lg"><Check className="h-4 w-4" /></button>
                        <button onClick={() => { setEditingId(null); setEditText(''); }} className="p-1.5 text-red-400 hover:bg-white/10 rounded-lg"><XCircle className="h-4 w-4" /></button>
                      </div>
                    ) : (
                      <>
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed cursor-pointer ${
                            isMine
                              ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-br-md'
                              : 'bg-white/[0.08] text-blue-100 border border-white/[0.06] rounded-bl-md'
                          }`}
                          onClick={(e) => { e.stopPropagation(); setContextMenuId(contextMenuId === msg.id ? null : msg.id); }}
                        >
                          {msg.contenu}
                          <div className={`text-[10px] mt-1 flex items-center gap-1 ${isMine ? 'text-blue-200/50' : 'text-blue-300/30'}`}>
                            {new Date(msg.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            {msg.edited && <span className="italic">(modifié)</span>}
                            {isMine && msg.lu && <span>✓✓</span>}
                          </div>
                        </div>

                        <AnimatePresence>
                          {contextMenuId === msg.id && isMine && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              className="absolute z-50 right-0 top-full mt-1 bg-slate-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[140px]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button onClick={() => { setEditingId(msg.id); setEditText(msg.contenu); setContextMenuId(null); }} className="w-full px-3 py-2 text-left text-xs text-blue-200 hover:bg-white/[0.06] flex items-center gap-2">
                                <Pencil className="h-3.5 w-3.5 text-blue-400" /> Modifier
                              </button>
                              <button onClick={() => handleDelete(msg.id)} className="w-full px-3 py-2 text-left text-xs text-red-400 hover:bg-white/[0.06] flex items-center gap-2">
                                <Trash2 className="h-3.5 w-3.5" /> Supprimer
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}

            <AnimatePresence>
              {selectedPartner && partnerTyping[selectedPartner] && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-start">
                  <div className="bg-white/[0.08] border border-white/[0.06] rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5">
                    <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Emoji picker */}
          <AnimatePresence>
            {showEmojis && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-slate-800/95 backdrop-blur border-t border-white/[0.06] px-3 py-2 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-wrap gap-1">
                  {EMOJI_LIST.map((emoji) => (
                    <button key={emoji} onClick={() => { setInput(prev => prev + emoji); setShowEmojis(false); }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-lg transition-colors">
                      {emoji}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input */}
          <div className="p-3 bg-slate-900/90 backdrop-blur border-t border-white/[0.06] shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); setShowEmojis(!showEmojis); }}
                className="h-11 w-11 shrink-0 flex items-center justify-center rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] transition-colors"
              >
                <Smile className="h-5 w-5 text-blue-300/60" />
              </button>
              <Input
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Écrire un message..."
                className="flex-1 h-11 bg-white/[0.05] border-white/[0.08] text-white placeholder:text-blue-300/30 rounded-xl focus:bg-white/[0.08] focus:border-blue-400/30"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isSending}
                className="h-11 w-11 p-0 bg-gradient-to-br from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 rounded-xl shadow-lg border border-white/10"
              >
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminToAdminChat;
