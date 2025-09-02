import React from 'react';
import { Shield, Lock, Award, Truck, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: Shield,
      title: 'Paiement sécurisé',
      description: 'SSL & 3D Secure',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Lock,
      title: 'Données protégées',
      description: 'Cryptage 256-bit',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Award,
      title: 'Qualité garantie',
      description: 'Produits certifiés',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Truck,
      title: 'Livraison rapide',
      description: '24-48h ouvrées',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: RefreshCw,
      title: 'Retour gratuit',
      description: '30 jours',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <div className="bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Vos garanties
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              className="text-center group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${badge.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                <badge.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{badge.title}</h3>
              <p className="text-sm text-gray-600">{badge.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;