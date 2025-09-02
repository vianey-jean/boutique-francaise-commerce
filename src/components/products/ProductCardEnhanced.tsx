import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Eye, Star, Zap, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import LiveStock from '@/components/ecommerce/LiveStock';

interface ProductCardEnhancedProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    rating: number;
    reviewCount: number;
    isNew?: boolean;
    isBestseller?: boolean;
    isFlashSale?: boolean;
    flashSaleEndTime?: Date;
    inStock: boolean;
  };
  onAddToCart: (productId: string) => void;
  onAddToFavorites: (productId: string) => void;
  onQuickView: (productId: string) => void;
  className?: string;
}

const ProductCardEnhanced: React.FC<ProductCardEnhancedProps> = ({
  product,
  onAddToCart,
  onAddToFavorites,
  onQuickView,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited);
    onAddToFavorites(product.id);
  };

  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      className={`group relative ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.isNew && (
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
              <Zap className="h-3 w-3 mr-1" />
              Nouveau
            </Badge>
          )}
          {product.isBestseller && (
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
              <Star className="h-3 w-3 mr-1" />
              Best-seller
            </Badge>
          )}
          {product.isFlashSale && (
            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 animate-pulse">
              <Timer className="h-3 w-3 mr-1" />
              Flash Sale
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="destructive" className="font-bold">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Bouton favoris */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-3 right-3 z-10 h-10 w-10 p-0 rounded-full backdrop-blur-sm transition-all duration-300 ${
            isFavorited 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
          }`}
          onClick={handleFavoriteClick}
        >
          <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
        </Button>

        {/* Image du produit */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Overlay avec boutons d'action */}
          <motion.div
            className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onQuickView(product.id)}
              className="backdrop-blur-sm bg-white/90 hover:bg-white"
            >
              <Eye className="h-4 w-4 mr-1" />
              Aperçu
            </Button>
            <Button
              size="sm"
              onClick={() => onAddToCart(product.id)}
              disabled={!product.inStock}
              className="backdrop-blur-sm bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </motion.div>
        </div>

        <CardContent className="p-4">
          {/* Nom du produit */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Évaluation */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({product.reviewCount})
            </span>
          </div>

          {/* Stock */}
          <LiveStock productId={product.id} className="mb-3" />

          {/* Prix */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold text-blue-600">
              {product.price.toFixed(2)} €
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-500 line-through">
                {product.originalPrice.toFixed(2)} €
              </span>
            )}
          </div>

          {/* Bouton d'action principal */}
          <Button
            onClick={() => onAddToCart(product.id)}
            disabled={!product.inStock}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 h-11 font-semibold"
          >
            {product.inStock ? (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Ajouter au panier
              </>
            ) : (
              'Rupture de stock'
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCardEnhanced;