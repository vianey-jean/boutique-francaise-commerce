import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, ShoppingBag, Heart, Truck, Gift, AlertCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'stock' | 'review' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  icon?: React.ReactNode;
}

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'order',
      title: 'Commande expédiée',
      message: 'Votre commande #12345 a été expédiée et sera livrée sous 2-3 jours.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      icon: <Truck className="h-4 w-4 text-info" />
    },
    {
      id: '2',
      type: 'promotion',
      title: 'Offre spéciale',
      message: 'Nouvelle promotion : -20% sur toutes les perruques premium !',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      icon: <Gift className="h-4 w-4 text-luxury-gold" />
    },
    {
      id: '3',
      type: 'stock',
      title: 'Produit de retour',
      message: 'Le produit "Perruque Lace Front" que vous avez aimé est de nouveau en stock.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      icon: <Heart className="h-4 w-4 text-luxury-rose" />
    },
    {
      id: '4',
      type: 'review',
      title: 'Laissez un avis',
      message: 'Comment avez-vous trouvé votre dernière commande ? Partagez votre expérience.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
      icon: <Star className="h-4 w-4 text-accent" />
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order': return 'bg-info/10 text-info';
      case 'promotion': return 'bg-luxury-gold/10 text-luxury-gold';
      case 'stock': return 'bg-luxury-rose/10 text-luxury-rose';
      case 'review': return 'bg-accent/10 text-accent';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `il y a ${minutes}min`;
    if (hours < 24) return `il y a ${hours}h`;
    return `il y a ${days}j`;
  };

  return (
    <div className="relative">
      {/* Bouton de notification */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-luxury-rose"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Panel de notifications */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="absolute right-0 top-12 w-80 bg-white dark:bg-card rounded-xl shadow-luxury-xl border border-border z-50 max-h-96 overflow-hidden"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs"
                      >
                        Tout marquer lu
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Liste des notifications */}
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Aucune notification</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                          !notification.read ? 'bg-luxury-gold/5' : ''
                        }`}
                        whileHover={{ x: 2 }}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                            {notification.icon}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className={`text-sm font-medium ${
                                !notification.read ? 'text-foreground' : 'text-muted-foreground'
                              }`}>
                                {notification.title}
                              </h4>
                              
                              <div className="flex items-center space-x-1">
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-luxury-rose rounded-full" />
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground">
                                {formatTime(notification.timestamp)}
                              </span>
                              
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                  className="text-xs h-6"
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Marquer lu
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => setIsOpen(false)}
                  >
                    Voir toutes les notifications
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;