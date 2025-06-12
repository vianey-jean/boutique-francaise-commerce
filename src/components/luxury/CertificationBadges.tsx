
import React from 'react';
import { Award, Shield, Verified, Star, Crown, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const CertificationBadges: React.FC = () => {
  const certifications = [
    {
      icon: Shield,
      title: "SSL Sécurisé",
      subtitle: "Certificat A+",
      color: "from-green-500 to-emerald-600",
      verified: true
    },
    {
      icon: Award,
      title: "ISO 27001",
      subtitle: "Sécurité Info",
      color: "from-blue-500 to-indigo-600",
      verified: true
    },
    {
      icon: Verified,
      title: "RGPD Conforme",
      subtitle: "Protection Données",
      color: "from-purple-500 to-violet-600",
      verified: true
    },
    {
      icon: Crown,
      title: "Boutique Premium",
      subtitle: "Certifiée Luxe",
      color: "from-yellow-500 to-orange-500",
      verified: true
    },
    {
      icon: Star,
      title: "Service Excellence",
      subtitle: "5 Étoiles",
      color: "from-pink-500 to-rose-600",
      verified: true
    },
    {
      icon: CheckCircle2,
      title: "Paiements PCI DSS",
      subtitle: "Niveau 1",
      color: "from-teal-500 to-cyan-600",
      verified: true
    }
  ];

  return (
    <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 border-y border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
            Certifications & Sécurité
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Nos standards de qualité et de sécurité reconnus
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${cert.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className="relative z-10 text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-br ${cert.color} rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300`}>
                    <cert.icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">
                    {cert.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                    {cert.subtitle}
                  </p>
                  
                  {cert.verified && (
                    <div className="flex items-center justify-center space-x-1">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        Vérifié
                      </span>
                    </div>
                  )}
                </div>
                
                <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r ${cert.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-8"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 px-6 py-3 rounded-full">
            <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-semibold text-green-800 dark:text-green-300">
              100% Sécurisé & Certifié
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CertificationBadges;
