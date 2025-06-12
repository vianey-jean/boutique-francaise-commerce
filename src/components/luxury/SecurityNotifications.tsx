
import React, { useState, useEffect } from 'react';
import { Shield, Lock, AlertTriangle, CheckCircle, X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SecurityNotification {
  id: string;
  type: 'security' | 'privacy' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
}

const SecurityNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<SecurityNotification[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulation de notifications de sécurité
    const securityChecks = [
      {
        id: '1',
        type: 'security'as const,
        title: 'Connexion Sécurisée Établie',
        message: 'Votre session est protégée par un cryptage SSL 256-bit.',
        timestamp: new Date(),
        priority: 'high' as const
      },
      {
        id: '2',
        type: 'privacy' as const,
        title: 'Confidentialité Respectée',
        message: 'Vos données personnelles sont protégées conformément au RGPD.',
        timestamp: new Date(Date.now() - 30000),
        priority: 'medium' as const
      },
      {
        id: '3',
        type: 'success' as const,
        title: 'Paiement Sécurisé Activé',
        message: 'Toutes les transactions sont protégées et vérifiées.',
        timestamp: new Date(Date.now() - 60000),
        priority: 'high' as const
      }
    ];

    setNotifications(securityChecks);
    setIsVisible(true);

    // Auto-hide après 10 secondes
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'security':
        return <Shield className="h-5 w-5" />;
      case 'privacy':
        return <Lock className="h-5 w-5" />;
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') {
      switch (type) {
        case 'security':
          return 'from-blue-500 to-indigo-600';
        case 'privacy':
          return 'from-purple-500 to-violet-600';
        case 'success':
          return 'from-green-500 to-emerald-600';
        default:
          return 'from-gray-500 to-gray-600';
      }
    }
    return 'from-gray-400 to-gray-500';
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              className="relative"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className={`h-1 bg-gradient-to-r ${getNotificationColor(notification.type, notification.priority)}`}></div>
                
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`bg-gradient-to-r ${getNotificationColor(notification.type, notification.priority)} p-2 rounded-xl text-white flex-shrink-0`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">
                          {notification.title}
                        </h4>
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors ml-2"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {notification.message}
                      </p>
                      
                      <div className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                        {notification.timestamp.toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Indicateur de priorité */}
                {notification.priority === 'high' && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default SecurityNotifications;
