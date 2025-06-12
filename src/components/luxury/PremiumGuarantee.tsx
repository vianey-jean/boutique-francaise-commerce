
import React from 'react';
import { Shield, Award, RotateCcw, Headphones, Truck, Star, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const PremiumGuarantee: React.FC = () => {
  const guarantees = [
    {
      icon: Shield,
      title: "Garantie Satisfait ou Remboursé",
      description: "30 jours pour changer d'avis, remboursement intégral sans condition",
      badge: "100% Garanti"
    },
    {
      icon: Award,
      title: "Qualité Premium Certifiée",
      description: "Tous nos produits sont testés et approuvés par des experts",
      badge: "Certifié"
    },
    {
      icon: Truck,
      title: "Livraison Express Gratuite",
      description: "Livraison offerte et assurée en 24-48h partout à La Réunion",
      badge: "Gratuit"
    },
    {
      icon: Headphones,
      title: "Service Client VIP 24/7",
      description: "Une équipe dédiée à votre service, réponse garantie sous 2h",
      badge: "VIP"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 rounded-2xl shadow-2xl">
              <Award className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-emerald-800 to-teal-600 bg-clip-text text-transparent mb-6">
            Nos Garanties Premium
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Votre tranquillité d'esprit est notre priorité absolue. Découvrez nos engagements exclusifs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {guarantees.map((guarantee, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group"
            >
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-emerald-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start space-x-6">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-500 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <guarantee.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <h3 className="text-2xl font-bold text-slate-800">{guarantee.title}</h3>
                        <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {guarantee.badge}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed text-lg">
                        {guarantee.description}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certification centrale */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-8">
                <div className="bg-white/20 p-6 rounded-3xl backdrop-blur-sm">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
              </div>
              
              <h3 className="text-4xl font-bold mb-4">
                Certification Premium Garantie
              </h3>
              <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
                Nous nous engageons à vous offrir une expérience d'achat exceptionnelle avec la plus haute qualité de service et de produits.
              </p>
              
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">100%</div>
                  <div className="text-emerald-200">Satisfaction</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-emerald-200">Support</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold">30J</div>
                  <div className="text-emerald-200">Garantie</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumGuarantee;
