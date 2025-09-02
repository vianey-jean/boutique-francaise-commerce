import React from 'react';
import Layout from './Layout';
import TrustBadges from '@/components/ecommerce/TrustBadges';
import RecentPurchases from '@/components/ecommerce/RecentPurchases';

interface EnhancedLayoutProps {
  children: React.ReactNode;
  showTrustBadges?: boolean;
  showRecentPurchases?: boolean;
}

const EnhancedLayout: React.FC<EnhancedLayoutProps> = ({ 
  children, 
  showTrustBadges = true,
  showRecentPurchases = true 
}) => {
  return (
    <Layout>
      {children}
      {showTrustBadges && <TrustBadges />}
      {showRecentPurchases && <RecentPurchases />}
    </Layout>
  );
};

export default EnhancedLayout;