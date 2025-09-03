import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, MapPin, Clock, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Purchase {
  id: string;
  customerName: string;
  customerAvatar?: string;
  productName: string;
  location: string;
  timeAgo: string;
  verified: boolean;
}

const PurchaseNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Purchase[]>([]);
  const [currentNotification, setCurrentNotification] = useState<Purchase | null>(null);

  const mockPurchases: Purchase[] = [
    {
      id: '1',
      customerName: 'Sophie M.',
      productName: 'Perruque Lace Front Premium',
      location: 'Paris, France',
      timeAgo: 'il y a 2 minutes',
      verified: true
    },
    {
      id: '2',
      customerName: 'Marie L.',
      productName: 'Extensions Naturelles 22"',
      location: 'Lyon, France',
      timeAgo: 'il y a 5 minutes',
      verified: true
    },
    {
      id: '3',
      customerName: 'Anaïs R.',
      productName: 'Queue de cheval bouclée',
      location: 'Marseille, France',
      timeAgo: 'il y a 8 minutes',
      verified: true
    },
    {
      id: '4',
      customerName: 'Émilie D.',
      productName: 'Perruque Bob court',
      location: 'Toulouse, France',
      timeAgo: 'il y a 12 minutes',
      verified: true
    },
    {
      id: '5',
      customerName: 'Laure B.',
      productName: 'Accessoires de coiffure',
      location: 'Nice, France',
      timeAgo: 'il y a 15 minutes',
      verified: true
    }
  ];

  useEffect(() => {
    const showNotification = () => {
      const randomPurchase = mockPurchases[Math.floor(Math.random() * mockPurchases.length)];
      setCurrentNotification(randomPurchase);
      
      setTimeout(() => {
        setCurrentNotification(null);
      }, 6000);
    };

    // Première notification après 3 secondes
    const initialTimer = setTimeout(showNotification, 3000);
    
    // Notifications récurrentes
    const interval = setInterval(showNotification, 20000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {currentNotification && (
        <motion.div
          initial={{ opacity: 0, x: -100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.9 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed bottom-6 left-6 z-50 max-w-sm"
        >
          <div className="bg-white dark:bg-card border border-border rounded-xl shadow-luxury-xl p-4 backdrop-blur-sm">
            <div className="flex items-start space-x-3">
              <Avatar className="h-10 w-10 ring-2 ring-luxury-gold/20">
                <AvatarImage src={currentNotification.customerAvatar} />
                <AvatarFallback className="bg-luxury-gradient text-white text-sm font-semibold">
                  {currentNotification.customerName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <ShoppingBag className="h-4 w-4 text-luxury-rose" />
                  {currentNotification.verified && (
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  )}
                </div>
                
                <p className="text-sm font-medium text-foreground">
                  <span className="font-semibold">{currentNotification.customerName}</span> vient d'acheter
                </p>
                
                <p className="text-sm text-luxury-rose font-medium mb-2">
                  {currentNotification.productName}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{currentNotification.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{currentNotification.timeAgo}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <motion.div
              className="mt-3 h-1 bg-luxury-gradient rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 6 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PurchaseNotifications;