import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Eye, Star, Package, Zap, Clock, GitCompare } from 'lucide-react';
import { Product } from '@/types/product';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RealTimeStock from '@/components/ecommerce/RealTimeStock';
import UrgencyIndicators from '@/components/ecommerce/UrgencyIndicators';
import { LuxuryCard } from '@/components/ui/luxury-card';

interface ProductCardEnhancedProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onCompare?: (product: Product) => void;
  showUrgencyIndicators?: boolean;
  showRealTimeStock?: boolean;
  variant?: 'default' | 'compact' | 'featured';
}

const ProductCardEnhanced: React.FC<ProductCardEnhancedProps> = ({
  product,
  onQuickView,
  onCompare,
  showUrgencyIndicators = true,
  showRealTimeStock = true,
  variant = 'default'
}) => {
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const isOnSale = product.promotion && product.promotion > 0;
  const hasStock = product.stock > 0;
  const isLowStock = product.stock <= 5;
  const isPopular = Math.random() > 0.7; // Simulation
  const recentPurchases = Math.floor(Math.random() * 20);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView?.(product);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCompare?.(product);
  };

  return (
    <motion.div
      className="group relative"
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ duration: 0.3 }}
    >
      <LuxuryCard 
        variant={variant === 'featured' ? 'premium' : 'default'}
        className="h-full overflow-hidden"
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-luxury-elegant">
          {/* Product Image */}
          <div className="relative w-full h-full bg-gradient-to-br from-luxury-gold/10 to-luxury-rose/10 flex items-center justify-center">
            {imageLoading && (
              <div className="animate-spin w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full" />
            )}
            
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoading ? 0 : 1 }}
              transition={{ duration: 0.3 }}
              onAnimationComplete={() => setImageLoading(false)}
            >
              <Package className="h-16 w-16 text-luxury-rose/50" />
            </motion.div>
          </div>

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 space-y-2">
            {isOnSale && (
              <Badge className="bg-luxury-gradient text-white font-bold">
                -{product.promotion}%
              </Badge>
            )}
            {isPopular && (
              <Badge className="bg-premium-gradient text-white">
                <Zap className="h-3 w-3 mr-1" />
                Tendance
              </Badge>
            )}
            {isLowStock && (
              <Badge variant="destructive" className="animate-pulse">
                Stock limité
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <motion.div
            className="absolute top-3 right-3 space-y-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleFavorite}
              className={`w-10 h-10 p-0 bg-white/90 backdrop-blur-sm ${
                isFavorite(product.id) ? 'text-luxury-rose' : 'text-muted-foreground'
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleQuickView}
              className="w-10 h-10 p-0 bg-white/90 backdrop-blur-sm"
            >
              <Eye className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleCompare}
              className="w-10 h-10 p-0 bg-white/90 backdrop-blur-sm"
            >
              <GitCompare className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Hover Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Product Info */}
          <div>
            <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
              {product.name}
            </h3>
            
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < 4 ? 'text-accent fill-current' : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">(4.0)</span>
            </div>
          </div>

          {/* Real-time Stock */}
          {showRealTimeStock && (
            <RealTimeStock
              productId={product.id}
              initialStock={product.stock}
              threshold={5}
            />
          )}

          {/* Urgency Indicators */}
          {showUrgencyIndicators && (
            <UrgencyIndicators
              stock={product.stock}
              promotion={isOnSale ? {
                discount: product.promotion!,
                endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
              } : undefined}
              isPopular={isPopular}
              recentPurchases={recentPurchases}
            />
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isOnSale ? (
                <>
                  <span className="text-lg font-bold text-luxury-rose">
                    {(product.price * (1 - product.promotion! / 100)).toFixed(2)}€
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {product.price}€
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-foreground">
                  {product.price}€
                </span>
              )}
            </div>
            
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleAddToCart}
              disabled={!hasStock}
              className="flex-1 bg-luxury-gradient hover:shadow-luxury-lg"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {hasStock ? 'Ajouter' : 'Rupture'}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleQuickView}
              className="px-3"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Loading State Overlay */}
        {imageLoading && (
          <div className="absolute inset-0 bg-muted/50 backdrop-blur-sm flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </LuxuryCard>
    </motion.div>
  );
};

export default ProductCardEnhanced;