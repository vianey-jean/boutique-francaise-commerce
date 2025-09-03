import React, { useState } from 'react';
import Layout from './Layout';
import PurchaseNotifications from '@/components/ecommerce/PurchaseNotifications';
import TrustSeals from '@/components/ecommerce/TrustSeals';
import SocialProof from '@/components/ecommerce/SocialProof';
import LiveActivityFeed from '@/components/engagement/LiveActivityFeed';
import EngagementBooster from '@/components/engagement/EngagementBooster';
import WishlistComparison from '@/components/ecommerce/WishlistComparison';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import { Button } from '@/components/ui/button';
import { Heart, GitCompare, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

interface EnhancedLayoutProps {
  children: React.ReactNode;
  hidePrompts?: boolean;
  showTrustElements?: boolean;
  showSocialProof?: boolean;
  showEngagementBooster?: boolean;
}

const EnhancedLayout: React.FC<EnhancedLayoutProps> = ({ 
  children, 
  hidePrompts = false,
  showTrustElements = true,
  showSocialProof = true,
  showEngagementBooster = true
}) => {
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [showBooster, setShowBooster] = useState(showEngagementBooster);

  return (
    <Layout hidePrompts={hidePrompts}>
      {/* Enhanced Header Bar */}
      <motion.div
        className="fixed top-16 right-4 z-40 flex items-center space-x-2"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {/* Notification Center */}
        <NotificationCenter />
        
        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsWishlistOpen(true)}
          className="relative bg-white/80 dark:bg-card/80 backdrop-blur-sm border border-border shadow-sm"
        >
          <Heart className="h-5 w-5" />
        </Button>
        
        {/* Comparison Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsWishlistOpen(true)}
          className="relative bg-white/80 dark:bg-card/80 backdrop-blur-sm border border-border shadow-sm"
        >
          <GitCompare className="h-5 w-5" />
        </Button>
      </motion.div>

      {/* Main Content */}
      <div className="relative">
        {children}
        
        {/* Trust Elements Section */}
        {showTrustElements && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <TrustSeals />
          </motion.div>
        )}
        
        {/* Social Proof Section */}
        {showSocialProof && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <SocialProof />
          </motion.div>
        )}
      </div>

      {/* Engagement Overlays */}
      <PurchaseNotifications />
      <LiveActivityFeed />
      
      {/* Modals */}
      <WishlistComparison
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
      
      {showBooster && (
        <EngagementBooster onClose={() => setShowBooster(false)} />
      )}
    </Layout>
  );
};

export default EnhancedLayout;