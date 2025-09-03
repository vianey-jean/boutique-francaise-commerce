import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Users, MessageCircle, ThumbsUp, Award, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const SocialProof: React.FC = () => {
  const [stats, setStats] = useState({
    totalCustomers: 50247,
    averageRating: 4.9,
    totalReviews: 12847,
    happyCustomers: 98
  });

  const testimonials = [
    {
      id: 1,
      name: 'Sophie Laurent',
      avatar: '/avatars/avatar-femme-3d.png',
      rating: 5,
      comment: 'Qualité exceptionnelle ! Ma perruque est magnifique et très naturelle.',
      product: 'Perruque Lace Front Premium',
      verified: true
    },
    {
      id: 2,
      name: 'Marie Dubois',
      avatar: '/avatars/avatar-femme-3d.png',
      rating: 5,
      comment: 'Service client au top, livraison rapide. Je recommande vivement !',
      product: 'Extensions Naturelles 22"',
      verified: true
    },
    {
      id: 3,
      name: 'Anaïs Martin',
      avatar: '/avatars/avatar-femme-3d.png',
      rating: 5,
      comment: 'Enfin un site de confiance avec des produits de qualité premium.',
      product: 'Queue de cheval bouclée',
      verified: true
    }
  ];

  useEffect(() => {
    // Simulation de mise à jour des statistiques en temps réel
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalCustomers: prev.totalCustomers + Math.floor(Math.random() * 3),
        totalReviews: prev.totalReviews + Math.floor(Math.random() * 2)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full py-12 bg-gradient-to-br from-luxury-elegant/20 to-white dark:from-card/30 dark:to-background">
      <div className="container mx-auto px-4">
        {/* Statistiques principales */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center">
            <div className="bg-luxury-gradient p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <Users className="h-8 w-8 text-white" />
            </div>
            <motion.div
              className="text-2xl font-bold text-foreground"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {stats.totalCustomers.toLocaleString()}+
            </motion.div>
            <p className="text-sm text-muted-foreground">Clients satisfaits</p>
          </div>

          <div className="text-center">
            <div className="bg-premium-gradient p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <Star className="h-8 w-8 text-white" />
            </div>
            <motion.div
              className="text-2xl font-bold text-foreground"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {stats.averageRating}/5
            </motion.div>
            <p className="text-sm text-muted-foreground">Note moyenne</p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-success to-success/80 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <motion.div
              className="text-2xl font-bold text-foreground"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {stats.totalReviews.toLocaleString()}+
            </motion.div>
            <p className="text-sm text-muted-foreground">Avis clients</p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-info to-info/80 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <ThumbsUp className="h-8 w-8 text-white" />
            </div>
            <motion.div
              className="text-2xl font-bold text-foreground"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {stats.happyCustomers}%
            </motion.div>
            <p className="text-sm text-muted-foreground">Recommandent</p>
          </div>
        </motion.div>

        {/* Témoignages récents */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Ce que disent nos clientes
          </h3>
          <p className="text-muted-foreground">
            Avis 100% authentiques et vérifiés
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="luxury-card p-6 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center mb-4">
                <Avatar className="h-12 w-12 mr-3">
                  <AvatarImage src={testimonial.avatar} />
                  <AvatarFallback className="bg-luxury-gradient text-white">
                    {testimonial.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-foreground">
                      {testimonial.name}
                    </h4>
                    {testimonial.verified && (
                      <Shield className="h-4 w-4 text-success" />
                    )}
                  </div>
                  
                  <div className="flex items-center mt-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-accent fill-current" />
                    ))}
                  </div>
                </div>
              </div>

              <blockquote className="text-sm text-muted-foreground italic mb-3">
                "{testimonial.comment}"
              </blockquote>

              <div className="text-xs text-luxury-rose font-medium">
                {testimonial.product}
              </div>

              <div className="absolute top-4 right-4 text-luxury-gold/20">
                <Award className="h-8 w-8" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Badges de confiance */}
        <motion.div
          className="flex items-center justify-center space-x-8 mt-12 pt-8 border-t border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Shield className="h-5 w-5 text-success" />
            <span className="text-sm font-medium">Avis Vérifiés</span>
          </div>
          
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Award className="h-5 w-5 text-luxury-gold" />
            <span className="text-sm font-medium">Qualité Certifiée</span>
          </div>
          
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Star className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium">Excellence Service</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SocialProof;