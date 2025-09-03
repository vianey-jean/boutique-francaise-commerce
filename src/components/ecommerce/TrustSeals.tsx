import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Truck, RotateCcw, CreditCard, Users, Star, CheckCircle } from 'lucide-react';

const TrustSeals: React.FC = () => {
  const seals = [
    {
      icon: Shield,
      title: 'Paiement 100% Sécurisé',
      description: 'SSL & Cryptage 256-bit',
      color: 'text-success',
      bg: 'bg-success/10'
    },
    {
      icon: Truck,
      title: 'Livraison Express',
      description: 'Sous 24-48h',
      color: 'text-info',
      bg: 'bg-info/10'
    },
    {
      icon: RotateCcw,
      title: 'Retour Gratuit',
      description: '30 jours',
      color: 'text-warning',
      bg: 'bg-warning/10'
    },
    {
      icon: Award,
      title: 'Qualité Certifiée',
      description: 'ISO 9001',
      color: 'text-luxury-gold',
      bg: 'bg-luxury-gold/10'
    },
    {
      icon: Users,
      title: '50,000+ Clients',
      description: 'Satisfaits',
      color: 'text-luxury-rose',
      bg: 'bg-luxury-rose/10'
    },
    {
      icon: Star,
      title: 'Note 4.9/5',
      description: 'Avis vérifiés',
      color: 'text-accent',
      bg: 'bg-accent/10'
    }
  ];

  return (
    <div className="w-full py-8 bg-gradient-to-r from-luxury-elegant/30 to-white dark:from-card dark:to-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Pourquoi nous faire confiance ?
          </h3>
          <p className="text-muted-foreground">
            Vos garanties pour un shopping en toute sérénité
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {seals.map((seal, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className={`luxury-card p-4 text-center h-full ${seal.bg} border-2 border-transparent group-hover:border-luxury-gold/30 transition-all duration-300`}>
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${seal.bg} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <seal.icon className={`h-6 w-6 ${seal.color}`} />
                </div>
                
                <h4 className="font-semibold text-sm text-foreground mb-1">
                  {seal.title}
                </h4>
                
                <p className="text-xs text-muted-foreground">
                  {seal.description}
                </p>
                
                <div className="absolute inset-0 bg-luxury-gradient opacity-0 group-hover:opacity-5 rounded-lg transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Badges de certification supplémentaires */}
        <motion.div
          className="flex items-center justify-center space-x-6 mt-8 pt-8 border-t border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex items-center space-x-2 text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-success" />
            <span className="text-sm">RGPD Compliant</span>
          </div>
          
          <div className="flex items-center space-x-2 text-muted-foreground">
            <CreditCard className="h-4 w-4 text-success" />
            <span className="text-sm">PCI DSS Certified</span>
          </div>
          
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Shield className="h-4 w-4 text-success" />
            <span className="text-sm">McAfee Secure</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TrustSeals;