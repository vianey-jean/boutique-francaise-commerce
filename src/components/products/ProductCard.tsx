
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Clock, Star, Eye, Zap } from 'lucide-react';
import { Product, useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { getSecureId } from '@/services/secureIds';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { reviewsAPI } from '@/services/api';
import StarRating from '@/components/reviews/StarRating';
import { toast } from '@/components/ui/sonner';
import QuickViewModal from '@/components/products/QuickViewModal';

interface ProductCardProps {
  product: Product;
  size?: 'small' | 'medium' | 'large';
  featured?: boolean;
}

const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PLACEHOLDER_IMAGE = '/placeholder.svg';

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  size = 'medium',
  featured = false
}) => {
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const { isAuthenticated } = useAuth();
  const isProductFavorite = isFavorite(product.id);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  useEffect(() => {
    const fetchProductReviews = async () => {
      try {
        const response = await reviewsAPI.getProductReviews(product.id);
        const reviews = response.data;
        
        if (reviews && reviews.length > 0) {
          // Calculate average rating from product and delivery ratings
          const totalRating = reviews.reduce((sum, review) => {
            return sum + ((review.productRating + review.deliveryRating) / 2);
          }, 0);
          
          setAverageRating(totalRating / reviews.length);
          setReviewCount(reviews.length);
        }
      } catch (error) {
        console.error("Error fetching reviews for product:", product.id, error);
      }
    };
    
    fetchProductReviews();
  }, [product.id]);
  
  const secureId = getSecureId(product.id, 'product');
  
  const displayImages = product.images && product.images.length > 0 
    ? product.images 
    : product.image ? [product.image] : [];
    
  const getPromotionTimeLeft = (endDate: string) => {
    if (!endDate) return "";
    
    const end = new Date(endDate);
    const now = new Date();
    const diffInMs = end.getTime() - now.getTime();
    
    if (diffInMs <= 0) return "Expirée";
    
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffInDays > 0) {
      return `${diffInDays}j ${diffInHours}h`;
    } else {
      const diffInMins = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${diffInHours}h ${diffInMins}m`;
    }
  };
  
  const isPromotionActive = product.promotion && 
    product.promotionEnd && 
    new Date(product.promotionEnd) > new Date();

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return PLACEHOLDER_IMAGE;
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    return `${AUTH_BASE_URL}${imagePath}`;
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour ajouter un produit au panier", {
        style: { backgroundColor: '#EF4444', color: 'white', fontWeight: 'bold' },
        duration: 4000,
        position: 'top-center',
      });
      return;
    }
    
    if (!product.isSold || (product.stock !== undefined && product.stock <= 0)) {
      toast.error("Ce produit est en rupture de stock");
      return;
    }
    
    addToCart(product);
    toast.success("Produit ajouté au panier");
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  useEffect(() => {
    if (isHovered && displayImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isHovered, displayImages.length]);

  const heightClasses = {
    small: 'h-[320px]',
    medium: 'h-[420px]',
    large: 'h-[480px]'
  };

  return (
    <>
      <motion.div 
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentImageIndex(0);
        }}
        className={featured ? 'z-10 scale-105' : ''}
      >
        <Card className={`group overflow-hidden ${heightClasses[size]} flex flex-col border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl bg-gradient-to-br from-white via-white to-neutral-50 dark:from-neutral-800 dark:via-neutral-800 dark:to-neutral-900 ${featured ? 'ring-2 ring-red-200 dark:ring-red-900 shadow-xl' : ''}`}>
          
          {/* Image Container */}
          <div className="relative h-[65%] bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 overflow-hidden rounded-t-2xl">
            <Link to={`/${secureId}`} className="block h-full">
              {displayImages.length > 0 ? (
                <motion.img 
                  src={getImageUrl(displayImages[currentImageIndex])} 
                  alt={`Photo de ${product.name}`} 
                  className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    console.log("Erreur de chargement d'image, utilisation du placeholder");
                    const target = e.target as HTMLImageElement;
                    target.src = PLACEHOLDER_IMAGE;
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key={currentImageIndex}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-800">
                  <ShoppingCart className="h-16 w-16 text-neutral-400" />
                </div>
              )}
              
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            {/* Badges */}
            <div className="absolute top-0 left-0 right-0 flex items-start justify-between p-4">
              <div className="flex flex-col space-y-2">
                {isPromotionActive && (
                  <Badge className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-3 py-1 text-sm font-bold shadow-lg animate-pulse">
                    <Zap className="h-3 w-3 mr-1" />
                    -{product.promotion}%
                  </Badge>
                )}
                
                {product.dateAjout && new Date().getTime() - new Date(product.dateAjout).getTime() < 7 * 24 * 60 * 60 * 1000 && (
                  <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg">
                    Nouveau
                  </Badge>
                )}
                
                {featured && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg">
                    ⭐ Recommandé
                  </Badge>
                )}
              </div>
              
              {product.promotion && product.promotionEnd && (
                <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-full text-xs font-medium shadow-lg">
                  <Clock className="h-3 w-3 mr-1 inline" />
                  {getPromotionTimeLeft(product.promotionEnd)}
                </div>
              )}
            </div>
            
            {/* Action buttons overlay */}
            <div className={`absolute bottom-4 left-4 right-4 flex justify-center space-x-3 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFavoriteToggle}
                className="p-3 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
                title={isProductFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                <Heart className={`h-5 w-5 transition-colors ${isProductFavorite ? 'fill-red-500 text-red-500' : 'text-neutral-600 hover:text-red-500'}`} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleQuickView}
                className="p-3 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
                title="Vue rapide"
              >
                <Eye className="h-5 w-5 text-neutral-600 hover:text-blue-500 transition-colors" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleQuickAdd}
                disabled={!product.isSold || (product.stock !== undefined && product.stock <= 0)}
                className="p-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Ajouter au panier"
              >
                <ShoppingCart className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
          
          {/* Content Section */}
          <CardContent className="p-6 flex flex-col flex-grow bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900">
            <Link to={`/${secureId}`} className="block">
              <h3 className="font-bold text-lg mb-2 hover:text-red-600 transition-colors line-clamp-2 text-left group-hover:text-red-600">
                {product.name}
              </h3>
            </Link>
            
            {/* Rating */}
            <div className="flex items-center mb-3">
              <StarRating rating={averageRating} size={16} />
              <span className="text-sm text-neutral-500 ml-2">({reviewCount})</span>
              {averageRating >= 4.5 && (
                <Badge className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5">
                  Top note
                </Badge>
              )}
            </div>
            
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 line-clamp-2 text-left leading-relaxed">{product.description}</p>
            
            <div className="flex-grow"></div>
            
            {/* Price and Action Section */}
            <div className="space-y-4">
              <div className="text-left">
                {isPromotionActive ? (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-bold text-red-600">
                        {product.price.toFixed(2)} €
                      </span>
                      <span className="text-lg text-neutral-500 line-through">
                        {typeof product.originalPrice === 'number'
                          ? product.originalPrice.toFixed(2)
                          : product.price.toFixed(2)} €
                      </span>
                    </div>
                    <div className="inline-flex items-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-lg text-xs font-medium">
                      💰 Économisez {((typeof product.originalPrice === 'number' ? product.originalPrice : product.price) - product.price).toFixed(2)} €
                    </div>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-neutral-800 dark:text-white">{product.price.toFixed(2)} €</p>
                )}
                
                {/* Stock indicator */}
                {product.stock !== undefined && (
                  <div className="mt-2">
                    {product.stock === 0 || !product.isSold ? (
                      <p className="text-red-500 text-sm font-medium">❌ En rupture de stock</p>
                    ) : product.stock <= 5 ? (
                      <p className="text-orange-500 text-sm font-medium">⚡ Plus que {product.stock} en stock</p>
                    ) : (
                      <p className="text-green-500 text-sm font-medium">✅ En stock ({product.stock} disponibles)</p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Add to cart button */}
              <Button
                className="w-full h-12 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                onClick={handleQuickAdd}
                disabled={!product.isSold || (product.stock !== undefined && product.stock <= 0)}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                <span>Ajouter au panier</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
};

export default ProductCard;
