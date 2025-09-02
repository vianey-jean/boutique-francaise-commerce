import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ShoppingCart, Clock, Percent } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface AbandonedCartReminderProps {
  cartItems: any[];
  onReturnToCart: () => void;
  onClose: () => void;
}

const AbandonedCartReminder: React.FC<AbandonedCartReminderProps> = ({
  cartItems,
  onReturnToCart,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [discountCode] = useState('RETOUR10');

  useEffect(() => {
    if (cartItems.length > 0) {
      // Afficher après 30 secondes d'inactivité
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [cartItems]);

  useEffect(() => {
    if (isVisible && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isVisible, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReturn = () => {
    onReturnToCart();
    toast.success(`Code promo ${discountCode} appliqué automatiquement !`);
    setIsVisible(false);
  };

  if (!isVisible || cartItems.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-4 right-4 z-50 max-w-sm"
        initial={{ opacity: 0, x: 100, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 100, scale: 0.8 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="shadow-2xl border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-yellow-50">
          <CardContent className="p-4 relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0"
              onClick={() => {
                setIsVisible(false);
                onClose();
              }}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="space-y-3">
              {/* En-tête */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-orange-800">Panier abandonné</h3>
                  <p className="text-sm text-orange-600">
                    {cartItems.length} article{cartItems.length > 1 ? 's' : ''} vous attendent
                  </p>
                </div>
              </div>

              {/* Offre spéciale */}
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Percent className="h-4 w-4 text-white" />
                  <span className="font-bold text-white">Offre exclusive</span>
                </div>
                <p className="text-sm text-white">
                  <strong>10% de réduction</strong> avec le code
                </p>
                <p className="font-mono font-bold text-white bg-white/20 rounded px-2 py-1 mt-1 inline-block">
                  {discountCode}
                </p>
              </div>

              {/* Compte à rebours */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center justify-center gap-2 text-red-600">
                  <Clock className="h-4 w-4" />
                  <span className="font-semibold">Expire dans</span>
                  <span className="font-mono font-bold text-lg">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button
                  onClick={handleReturn}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  Finaliser ma commande
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsVisible(false)}
                  className="w-full text-sm"
                >
                  Plus tard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default AbandonedCartReminder;