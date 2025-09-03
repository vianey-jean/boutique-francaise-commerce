import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Flame, Users, AlertTriangle, Timer, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UrgencyIndicatorsProps {
  stock?: number;
  promotion?: {
    discount: number;
    endDate: string;
  };
  isPopular?: boolean;
  recentPurchases?: number;
}

const UrgencyIndicators: React.FC<UrgencyIndicatorsProps> = ({
  stock = 0,
  promotion,
  isPopular = false,
  recentPurchases = 0
}) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [viewers, setViewers] = useState(Math.floor(Math.random() * 15) + 5);

  useEffect(() => {
    if (promotion?.endDate) {
      const updateCountdown = () => {
        const now = new Date().getTime();
        const endTime = new Date(promotion.endDate).getTime();
        const difference = endTime - now;

        if (difference > 0) {
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          
          setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        } else {
          setTimeLeft('00:00:00');
        }
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, [promotion]);

  useEffect(() => {
    // Simulation du nombre de personnes qui regardent
    const interval = setInterval(() => {
      setViewers(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(1, Math.min(50, prev + change));
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getStockUrgency = () => {
    if (stock <= 3) return { level: 'critical', color: 'destructive', text: 'Dernières pièces' };
    if (stock <= 10) return { level: 'warning', color: 'warning', text: 'Stock limité' };
    return null;
  };

  const stockUrgency = getStockUrgency();

  return (
    <div className="space-y-3">
      {/* Compteur de promotion */}
      {promotion && timeLeft && (
        <motion.div
          className="bg-gradient-to-r from-luxury-rose to-luxury-gold p-3 rounded-lg text-white"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="h-5 w-5 animate-pulse" />
              <span className="font-semibold text-sm">Offre limitée</span>
            </div>
            <div className="flex items-center space-x-2">
              <Timer className="h-4 w-4" />
              <span className="font-mono text-sm">{timeLeft}</span>
            </div>
          </div>
          <div className="mt-2 text-xs opacity-90">
            -{promotion.discount}% se termine bientôt !
          </div>
        </motion.div>
      )}

      {/* Indicateur de stock faible */}
      {stockUrgency && (
        <motion.div
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="destructive" className="flex items-center space-x-1 animate-pulse">
            <AlertTriangle className="h-3 w-3" />
            <span>{stockUrgency.text}</span>
          </Badge>
          <span className="text-xs text-muted-foreground">
            Plus que {stock} en stock
          </span>
        </motion.div>
      )}

      {/* Indicateur de popularité */}
      {isPopular && (
        <motion.div
          className="flex items-center space-x-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Badge className="bg-luxury-gradient text-white flex items-center space-x-1">
            <Zap className="h-3 w-3" />
            <span>Tendance</span>
          </Badge>
          <span className="text-xs text-muted-foreground">
            Produit populaire
          </span>
        </motion.div>
      )}

      {/* Achats récents */}
      {recentPurchases > 0 && (
        <motion.div
          className="flex items-center space-x-2 text-xs text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Users className="h-3 w-3 text-success" />
          <span>
            {recentPurchases} personnes ont acheté ce produit dans les dernières 24h
          </span>
        </motion.div>
      )}

      {/* Nombre de personnes qui regardent */}
      <AnimatePresence>
        <motion.div
          key={viewers}
          className="flex items-center space-x-2 text-xs text-muted-foreground"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-success font-medium">{viewers}</span>
          </div>
          <span>
            {viewers === 1 ? 'personne regarde' : 'personnes regardent'} ce produit
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default UrgencyIndicators;