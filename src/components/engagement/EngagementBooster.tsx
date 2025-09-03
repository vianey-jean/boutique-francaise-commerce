import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Zap, Timer, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EngagementBoosterProps {
  onClose?: () => void;
}

const EngagementBooster: React.FC<EngagementBoosterProps> = ({ onClose }) => {
  const [currentOffer, setCurrentOffer] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isVisible, setIsVisible] = useState(false);

  const offers = [
    {
      title: 'Offre Flash ⚡',
      discount: 15,
      description: 'Première commande uniquement',
      code: 'FLASH15',
      color: 'from-luxury-rose to-luxury-gold',
      icon: Zap
    },
    {
      title: 'Cadeau Surprise 🎁',
      discount: 20,
      description: 'Livraison gratuite incluse',
      code: 'SURPRISE20',
      color: 'from-luxury-gold to-luxury-premium',
      icon: Gift
    },
    {
      title: 'Bonus VIP ✨',
      discount: 25,
      description: 'Accès exclusif collections',
      code: 'VIP25',
      color: 'from-luxury-premium to-luxury-rose',
      icon: Sparkles
    }
  ];

  useEffect(() => {
    // Afficher après 30 secondes
    const showTimer = setTimeout(() => setIsVisible(true), 30000);
    
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (isVisible && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsVisible(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isVisible, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOfferAccept = () => {
    // Ici, logique pour appliquer l'offre
    navigator.clipboard.writeText(offers[currentOffer].code);
    setIsVisible(false);
    onClose?.();
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  const offer = offers[currentOffer];
  const Icon = offer.icon;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative bg-white dark:bg-card rounded-2xl shadow-luxury-xl max-w-md w-full overflow-hidden"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 left-4 w-12 h-12 bg-luxury-gold rounded-full" />
            <div className="absolute bottom-4 right-4 w-8 h-8 bg-luxury-rose rounded-full" />
            <div className="absolute top-1/2 right-8 w-6 h-6 bg-luxury-premium rounded-full" />
          </div>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute top-4 right-4 z-10"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Header */}
          <div className={`p-6 pb-0 bg-gradient-to-r ${offer.color} text-white relative`}>
            <div className="text-center">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Icon className="h-8 w-8" />
              </motion.div>
              
              <h2 className="text-2xl font-bold mb-2">{offer.title}</h2>
              <p className="text-white/90 text-sm">{offer.description}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 pt-4">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-luxury-rose mb-2">
                -{offer.discount}%
              </div>
              <p className="text-muted-foreground text-sm">
                Sur votre commande avec le code
              </p>
              
              <div className="mt-4 p-3 bg-muted rounded-lg border-2 border-dashed border-luxury-gold">
                <div className="text-lg font-mono font-bold text-foreground">
                  {offer.code}
                </div>
                <div className="text-xs text-muted-foreground">
                  Code copié automatiquement
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Timer className="h-4 w-4 text-luxury-rose" />
              <span className="text-sm text-muted-foreground">Offre valable encore</span>
              <Badge variant="destructive" className="font-mono">
                {formatTime(timeLeft)}
              </Badge>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleOfferAccept}
                className={`w-full bg-gradient-to-r ${offer.color} text-white font-semibold py-3`}
              >
                Profiter de l'offre maintenant
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentOffer((prev) => (prev + 1) % offers.length)}
                  className="flex-1"
                >
                  Autre offre
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Plus tard
                </Button>
              </div>
            </div>

            {/* Trust Elements */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xs font-semibold text-foreground">50K+</div>
                  <div className="text-xs text-muted-foreground">Clients</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">4.9★</div>
                  <div className="text-xs text-muted-foreground">Note</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">Sécurisé</div>
                  <div className="text-xs text-muted-foreground">SSL</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EngagementBooster;