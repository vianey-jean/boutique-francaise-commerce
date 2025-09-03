import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, ShoppingCart, Eye, TrendingUp, Star } from 'lucide-react';
import { Product } from '@/types/product';
import { useStore } from '@/contexts/StoreContext';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';

interface PersonalizedRecommendationsProps {
  currentProductId?: string;
  category?: string;
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  currentProductId,
  category
}) => {
  const { products, favorites } = useStore();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [recommendationType, setRecommendationType] = useState<'trending' | 'similar' | 'favorites'>('trending');

  useEffect(() => {
    generateRecommendations();
  }, [products, favorites, currentProductId, category, recommendationType]);

  const generateRecommendations = () => {
    let filtered = products.filter(p => p.id !== currentProductId);

    switch (recommendationType) {
      case 'similar':
        if (category) {
          filtered = filtered.filter(p => p.category === category);
        }
        break;
      case 'favorites':
        // Recommandations basées sur les favoris de l'utilisateur
        if (favorites.length > 0) {
          const favoriteCategories = [...new Set(favorites.map(f => f.category))];
          filtered = filtered.filter(p => favoriteCategories.includes(p.category));
        }
        break;
      case 'trending':
      default:
        // Produits populaires avec promotions en premier
        filtered.sort((a, b) => {
          if (a.promotion && !b.promotion) return -1;
          if (!a.promotion && b.promotion) return 1;
          return 0;
        });
        break;
    }

    setRecommendations(filtered.slice(0, 8));
  };

  const getRecommendationTitle = () => {
    switch (recommendationType) {
      case 'similar':
        return 'Produits similaires';
      case 'favorites':
        return 'Recommandés pour vous';
      case 'trending':
      default:
        return 'Tendances du moment';
    }
  };

  const getRecommendationIcon = () => {
    switch (recommendationType) {
      case 'similar':
        return <Eye className="h-5 w-5" />;
      case 'favorites':
        return <Heart className="h-5 w-5" />;
      case 'trending':
      default:
        return <TrendingUp className="h-5 w-5" />;
    }
  };

  if (recommendations.length === 0) return null;

  return (
    <motion.div
      className="w-full bg-gradient-to-br from-luxury-elegant/20 to-white dark:from-card/50 dark:to-background rounded-xl p-6 border border-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-luxury-gradient p-2 rounded-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground flex items-center space-x-2">
              {getRecommendationIcon()}
              <span>{getRecommendationTitle()}</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Sélectionnés spécialement pour vous
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={recommendationType === 'trending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRecommendationType('trending')}
            className="text-xs"
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            Tendances
          </Button>
          
          <Button
            variant={recommendationType === 'similar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRecommendationType('similar')}
            className="text-xs"
          >
            <Eye className="h-3 w-3 mr-1" />
            Similaires
          </Button>
          
          {favorites.length > 0 && (
            <Button
              variant={recommendationType === 'favorites' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRecommendationType('favorites')}
              className="text-xs"
            >
              <Heart className="h-3 w-3 mr-1" />
              Pour vous
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={recommendationType}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {recommendations.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Indicateur de personnalisation */}
      <motion.div
        className="mt-4 flex items-center justify-center space-x-2 text-xs text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Star className="h-3 w-3 text-luxury-gold" />
        <span>Recommandations basées sur vos préférences et votre historique</span>
        <Star className="h-3 w-3 text-luxury-gold" />
      </motion.div>
    </motion.div>
  );
};

export default PersonalizedRecommendations;