
import React from 'react';
import { Star, Quote, Verified, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const LuxuryTestimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Sophie Dubois",
      title: "Directrice Marketing",
      location: "Paris, France",
      rating: 5,
      comment: "Une expérience d'achat exceptionnelle ! La qualité des produits et le service client sont irréprochables. Je recommande vivement cette boutique premium.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face",
      verified: true,
      vip: true
    },
    {
      name: "Marie-Claire Lefort",
      title: "Consultante Beauté",
      location: "Lyon, France",
      rating: 5,
      comment: "Les produits capillaires sont d'une qualité remarquable. L'emballage luxueux et la livraison rapide font toute la différence. Un service digne des plus grandes marques.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
      verified: true,
      vip: false
    },
    {
      name: "Isabelle Martin",
      title: "Propriétaire de Salon",
      location: "Marseille, France",
      rating: 5,
      comment: "En tant que professionnelle, je ne peux que saluer la qualité exceptionnelle de ces produits. Mes clientes sont ravies et les résultats parlent d'eux-mêmes.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
      verified: true,
      vip: true
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-purple-50 py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl shadow-2xl">
              <Crown className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-800 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-6">
            Témoignages de nos Clientes VIP
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez pourquoi nos clientes font confiance à notre expertise premium depuis des années
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-purple-100 relative overflow-hidden">
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* VIP Badge */}
                {testimonial.vip && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-gold-400 to-gold-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                    <Crown className="h-3 w-3" />
                    <span>VIP</span>
                  </div>
                )}

                <div className="relative z-10">
                  {/* Quote Icon */}
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                    <Quote className="h-6 w-6 text-white" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-slate-700 leading-relaxed mb-6 italic text-lg">
                    "{testimonial.comment}"
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-lg"
                      />
                      {testimonial.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                          <Verified className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{testimonial.name}</h4>
                      <p className="text-purple-600 font-medium">{testimonial.title}</p>
                      <p className="text-sm text-slate-500">{testimonial.location}</p>
                    </div>
                  </div>
                </div>

                {/* Decorative border */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-8 inline-flex items-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-800">4.9/5</div>
              <div className="text-sm text-purple-600">Note moyenne</div>
            </div>
            <div className="w-px h-12 bg-purple-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-800">2,847</div>
              <div className="text-sm text-purple-600">Avis clients</div>
            </div>
            <div className="w-px h-12 bg-purple-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-800">98%</div>
              <div className="text-sm text-purple-600">Satisfaction</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LuxuryTestimonials;
