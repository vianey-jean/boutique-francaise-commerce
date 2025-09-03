import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RealTimeStockProps {
  productId: string;
  initialStock: number;
  threshold?: number;
}

const RealTimeStock: React.FC<RealTimeStockProps> = ({ 
  productId, 
  initialStock, 
  threshold = 5 
}) => {
  const [stock, setStock] = useState(initialStock);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');

  useEffect(() => {
    // Simulation du stock en temps réel
    const interval = setInterval(() => {
      const change = Math.floor(Math.random() * 3) - 1; // -1, 0, ou 1
      setStock(prev => {
        const newStock = Math.max(0, prev + change);
        if (newStock > prev) setTrend('up');
        else if (newStock < prev) setTrend('down');
        else setTrend('stable');
        return newStock;
      });
    }, 15000); // Mise à jour toutes les 15 secondes

    return () => clearInterval(interval);
  }, []);

  const getStockStatus = () => {
    if (stock === 0) return { status: 'rupture', color: 'destructive', icon: AlertTriangle };
    if (stock <= threshold) return { status: 'faible', color: 'warning', icon: Clock };
    return { status: 'disponible', color: 'success', icon: CheckCircle };
  };

  const { status, color, icon: Icon } = getStockStatus();

  return (
    <motion.div 
      className="flex items-center space-x-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Package className="h-4 w-4 text-muted-foreground" />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={stock}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center space-x-2"
        >
          <Badge variant={color === 'success' ? 'default' : 'destructive'} className="flex items-center space-x-1">
            <Icon className="h-3 w-3" />
            <span>
              {stock > 0 ? `${stock} en stock` : 'Rupture de stock'}
            </span>
          </Badge>
          
          {trend !== 'stable' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`text-xs ${trend === 'up' ? 'text-success' : 'text-error'}`}
            >
              {trend === 'up' ? '↗' : '↘'}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default RealTimeStock;