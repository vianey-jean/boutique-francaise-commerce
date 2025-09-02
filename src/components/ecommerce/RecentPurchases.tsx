import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, MapPin } from 'lucide-react';

interface Purchase {
  id: string;
  customerName: string;
  customerAvatar?: string;
  productName: string;
  location: string;
  timeAgo: string;
  verified: boolean;
}

const RecentPurchases: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Données simulées d'achats récents
  const mockPurchases: Purchase[] = [
    {
      id: '1',
      customerName: 'Marie L.',
      productName: 'Sac à main cuir premium',
      location: 'Saint-Denis',
      timeAgo: 'il y a 2 minutes',
      verified: true
    },
    {
      id: '2',
      customerName: 'Thomas M.',
      productName: 'Montre connectée Elite',
      location: 'Saint-Pierre',
      timeAgo: 'il y a 5 minutes',
      verified: true
    },
    {
      id: '3',
      customerName: 'Sophie R.',
      productName: 'Parfum luxe 100ml',
      location: 'Le Port',
      timeAgo: 'il y a 8 minutes',
      verified: false
    },
    {
      id: '4',
      customerName: 'Alexandre B.',
      productName: 'Casque audio premium',
      location: 'Saint-Paul',
      timeAgo: 'il y a 12 minutes',
      verified: true
    },
    {
      id: '5',
      customerName: 'Camille D.',
      productName: 'Bijoux or 18 carats',
      location: 'Sainte-Marie',
      timeAgo: 'il y a 15 minutes',
      verified: true
    }
  ];

  useEffect(() => {
    setPurchases(mockPurchases);
    
    // Rotation automatique des notifications
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % mockPurchases.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  if (purchases.length === 0) return null;

  const currentPurchase = purchases[currentIndex];

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPurchase.id}
          initial={{ opacity: 0, x: -100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.8 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 backdrop-blur-sm"
        >
          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10 border-2 border-green-500">
              <AvatarImage src={currentPurchase.customerAvatar} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                {currentPurchase.customerName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-sm text-gray-900">
                  {currentPurchase.customerName}
                </p>
                {currentPurchase.verified && (
                  <Badge variant="default" className="text-xs bg-green-100 text-green-700 border-green-300">
                    ✓ Vérifié
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-gray-700 mb-2 line-clamp-1">
                a acheté <span className="font-medium">{currentPurchase.productName}</span>
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{currentPurchase.location}</span>
                </div>
                <span>{currentPurchase.timeAgo}</span>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          
          {/* Barre de progression */}
          <motion.div 
            className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
          >
            <motion.div 
              className="h-full bg-gradient-to-r from-green-500 to-blue-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 4, ease: "linear" }}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RecentPurchases;