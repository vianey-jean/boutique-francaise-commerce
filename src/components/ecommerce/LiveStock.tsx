import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Package } from 'lucide-react';
import { motion } from 'framer-motion';

interface LiveStockProps {
  productId: string;
  initialStock?: number;
  className?: string;
}

const LiveStock: React.FC<LiveStockProps> = ({ 
  productId, 
  initialStock = Math.floor(Math.random() * 20) + 5,
  className = '' 
}) => {
  const [stock, setStock] = useState(initialStock);
  const [isLowStock, setIsLowStock] = useState(false);

  useEffect(() => {
    setIsLowStock(stock <= 5);
    
    // Simuler des changements de stock en temps réel
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% de chance de changement
        const change = Math.random() > 0.5 ? -1 : 1;
        setStock(prev => Math.max(0, Math.min(50, prev + change)));
      }
    }, 10000); // Toutes les 10 secondes

    return () => clearInterval(interval);
  }, [stock]);

  const getStockStatus = () => {
    if (stock === 0) return { text: 'Rupture de stock', variant: 'destructive' as const, icon: AlertCircle };
    if (stock <= 3) return { text: 'Stock très limité', variant: 'destructive' as const, icon: AlertCircle };
    if (stock <= 5) return { text: 'Stock faible', variant: 'secondary' as const, icon: Package };
    if (stock <= 10) return { text: 'Quantité limitée', variant: 'outline' as const, icon: Package };
    return { text: 'En stock', variant: 'default' as const, icon: Package };
  };

  const status = getStockStatus();

  return (
    <motion.div 
      className={`flex items-center gap-2 ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      key={stock} // Re-animate when stock changes
    >
      <Badge variant={status.variant} className="flex items-center gap-1 px-3 py-1">
        <status.icon className="h-3 w-3" />
        <span>{status.text}</span>
        {stock > 0 && (
          <span className="ml-1 font-mono">({stock})</span>
        )}
      </Badge>
      
      {isLowStock && stock > 0 && (
        <motion.span 
          className="text-xs text-orange-600 font-medium"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Dépêchez-vous !
        </motion.span>
      )}
    </motion.div>
  );
};

export default LiveStock;