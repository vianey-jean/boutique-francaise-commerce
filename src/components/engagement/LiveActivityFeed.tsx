import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, TrendingUp, Users, ShoppingBag, Heart, Eye, Star } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'view' | 'purchase' | 'favorite' | 'review';
  message: string;
  timestamp: Date;
  count?: number;
}

const LiveActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const activityTypes = [
    {
      type: 'view' as const,
      messages: [
        'personnes regardent nos perruques premium',
        'visiteurs consultent les nouveautés',
        'clientes parcourent les promotions'
      ],
      icon: Eye,
      color: 'text-info'
    },
    {
      type: 'purchase' as const,
      messages: [
        'commandes passées dans la dernière heure',
        'perruques vendues aujourd\'hui',
        'clientes satisfaites ce mois-ci'
      ],
      icon: ShoppingBag,
      color: 'text-success'
    },
    {
      type: 'favorite' as const,
      messages: [
        'produits ajoutés aux favoris',
        'nouvelles clientes inscrites',
        'avis 5 étoiles reçus'
      ],
      icon: Heart,
      color: 'text-luxury-rose'
    },
    {
      type: 'review' as const,
      messages: [
        'avis positifs laissés',
        'recommandations partagées',
        'témoignages client reçus'
      ],
      icon: Star,
      color: 'text-accent'
    }
  ];

  useEffect(() => {
    const generateActivity = () => {
      const randomType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      const randomMessage = randomType.messages[Math.floor(Math.random() * randomType.messages.length)];
      const count = Math.floor(Math.random() * 50) + 10;

      const newActivity: ActivityItem = {
        id: Date.now().toString(),
        type: randomType.type,
        message: `${count} ${randomMessage}`,
        timestamp: new Date(),
        count
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
      setIsVisible(true);

      setTimeout(() => setIsVisible(false), 8000);
    };

    // Première activité après 2 secondes
    const initialTimer = setTimeout(generateActivity, 2000);
    
    // Nouvelles activités toutes les 15 secondes
    const interval = setInterval(generateActivity, 15000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const getActivityIcon = (type: string) => {
    const activityType = activityTypes.find(at => at.type === type);
    return activityType ? activityType.icon : Activity;
  };

  const getActivityColor = (type: string) => {
    const activityType = activityTypes.find(at => at.type === type);
    return activityType ? activityType.color : 'text-muted-foreground';
  };

  if (activities.length === 0) return null;

  return (
    <AnimatePresence>
      {isVisible && activities[0] && (
        <motion.div
          className="fixed bottom-6 right-6 z-40 max-w-sm"
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.9 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="bg-white dark:bg-card border border-border rounded-xl shadow-luxury-xl p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="relative">
                <div className="bg-luxury-gradient p-2 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse" />
              </div>
              
              <div>
                <h4 className="font-semibold text-sm text-foreground">
                  Activité en direct
                </h4>
                <p className="text-xs text-muted-foreground">
                  Mis à jour à l'instant
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {activities.slice(0, 3).map((activity, index) => {
                const Icon = getActivityIcon(activity.type);
                const color = getActivityColor(activity.type);
                
                return (
                  <motion.div
                    key={activity.id}
                    className={`flex items-center space-x-2 p-2 rounded-lg ${
                      index === 0 ? 'bg-luxury-gradient/10' : 'bg-muted/50'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Icon className={`h-4 w-4 ${color}`} />
                    <p className="text-xs text-foreground flex-1">
                      {activity.message}
                    </p>
                    {index === 0 && (
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Barre de progression pour indiquer la durée d'affichage */}
            <motion.div
              className="mt-3 h-1 bg-luxury-gradient rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 8 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LiveActivityFeed;