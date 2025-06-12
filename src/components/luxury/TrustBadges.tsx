
import React from 'react';
import { Shield, Lock, Award, Star, Verified, CreditCard, Truck, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: Shield,
      title: "Sécurité SSL 256-bit",
      description: "Vos données sont cryptées",
      color: "from-green-500 to-emerald-600",
      verified: true
    },
    {
      icon: Lock,
      title: "Paiements Sécurisés",
      description: "Protection bancaire",
      color: "from-blue-500 to-indigo-600",
      verified: true
    },
    {
      icon: Award,
      title: "Certifié Premium",
      description: "Qualité garantie",
      color: "from-purple-500 to-pink-600",
      verified: true
    },
    {
      icon: Verified,
      title: "Marque Vérifiée",
      description: "Authenticité confirmée",
      color: "from-orange-500 to-red-600",
      verified: true
    },
    {
      icon: CreditCard,
      title: "Transactions Protégées",
      description: "Remboursement garanti",
      color: "from-teal-500 to-cyan-600",
      verified: true
    },
    {
      icon: Truck,
      title: "Livraison Assurée",
      description: "Suivi en temps réel",
      color: "from-indigo-500 to-purple-600",
      verified: true
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 py-16 px-4">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-gold-400 to-gold-600 p-4 rounded-2xl shadow-2xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
            Votre Sécurité, Notre Priorité
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Profitez d'une expérience d'achat premium avec les plus hauts standards de sécurité et de protection des données
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group relative"
            >
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-200 dark:border-slate-700 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${badge.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <badge.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                      {badge.title}
                    </h3>
                    {badge.verified && (
                      <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                        <Verified className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                    )}
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {badge.description}
                  </p>
                  
                  <div className="mt-6 flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-sm text-slate-500 ml-2">Certifié</span>
                  </div>
                </div>
                
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${badge.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8 inline-flex items-center space-x-4">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-xl">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <h4 className="text-lg font-bold text-slate-800 dark:text-white">
                Protection Maximale Garantie
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                Conformité RGPD • Cryptage AES-256 • Surveillance 24/7
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TrustBadges;
