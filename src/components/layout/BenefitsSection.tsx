
import React from 'react';
import { Truck, Shield, RotateCcw, Headphones, Clock, Award } from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Truck,
      title: "Livraison Gratuite",
      description: "Livraison gratuite sur toute l'île de La Réunion de Saint-Paul à Saint-Suzanne",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Shield,
      title: "Paiement Sécurisé",
      description: "Vos transactions sont protégées par un cryptage SSL de niveau bancaire",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: RotateCcw,
      title: "Retour Facile",
      description: "Retour gratuit sous 30 jours, sans condition",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Headphones,
      title: "Support 24/7",
      description: "Notre équipe est disponible pour vous aider à tout moment",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: Clock,
      title: "Livraison Rapide",
      description: "Expédition sous 24h ouvrées pour tous nos produits en stock",
      color: "from-teal-500 to-cyan-600"
    },
    {
      icon: Award,
      title: "Qualité Garantie",
      description: "Tous nos produits sont soigneusement sélectionnés et testés",
      color: "from-amber-500 to-yellow-600"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-400 rounded-full filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
            Pourquoi nous choisir ?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Une expérience d'achat exceptionnelle avec des services de qualité premium
          </p>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group relative bg-white dark:bg-neutral-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100 dark:border-neutral-700 overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              {/* Icon container */}
              <div className={`relative z-10 w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                <benefit.icon className="h-8 w-8 text-white" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-800 group-hover:to-gray-600 group-hover:bg-clip-text transition-all duration-300">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>

              {/* Decorative corner */}
              <div className={`absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br ${benefit.color} rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
              
              {/* Hover line effect */}
              <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${benefit.color} w-0 group-hover:w-full transition-all duration-500`}></div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Award className="h-5 w-5" />
            <span className="font-semibold">Expérience client exceptionnelle garantie</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
