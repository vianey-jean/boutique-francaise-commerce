import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, GitCompare, Eye, ShoppingCart, X, Star, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { useStore } from '@/contexts/StoreContext';

interface WishlistComparisonProps {
  isOpen: boolean;
  onClose: () => void;
}

const WishlistComparison: React.FC<WishlistComparisonProps> = ({ isOpen, onClose }) => {
  const { favorites, addToCart, toggleFavorite } = useStore();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  const toggleProductSelection = (product: Product) => {
    setSelectedProducts(prev => {
      const isSelected = prev.some(p => p.id === product.id);
      if (isSelected) {
        return prev.filter(p => p.id !== product.id);
      } else if (prev.length < 3) {
        return [...prev, product];
      }
      return prev;
    });
  };

  const startComparison = () => {
    if (selectedProducts.length >= 2) {
      setIsComparing(true);
    }
  };

  const getComparisonData = () => {
    if (selectedProducts.length === 0) return [];
    
    const attributes = ['price', 'category', 'promotion'];
    return attributes.map(attr => ({
      attribute: attr,
      values: selectedProducts.map(product => {
        switch (attr) {
          case 'price':
            return `${product.price}€`;
          case 'category':
            return product.category;
          case 'promotion':
            return product.promotion ? `${product.promotion}%` : 'Non';
          default:
            return '-';
        }
      })
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white dark:bg-card rounded-xl shadow-luxury-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-luxury-gradient p-2 rounded-lg">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {isComparing ? 'Comparaison des produits' : 'Ma liste de souhaits'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {isComparing 
                      ? `Comparaison de ${selectedProducts.length} produits`
                      : `${favorites.length} produits favoris`
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {!isComparing && selectedProducts.length >= 2 && (
                  <Button onClick={startComparison} size="sm" className="bg-luxury-gradient">
                    <GitCompare className="h-4 w-4 mr-2" />
                    Comparer ({selectedProducts.length})
                  </Button>
                )}
                
                {isComparing && (
                  <Button onClick={() => setIsComparing(false)} variant="outline" size="sm">
                    Retour à la liste
                  </Button>
                )}
                
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {!isComparing ? (
              // Vue liste de souhaits
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.map((product) => (
                  <motion.div
                    key={product.id}
                    className={`luxury-card p-4 cursor-pointer transition-all duration-300 relative ${
                      selectedProducts.some(p => p.id === product.id)
                        ? 'ring-2 ring-luxury-gold bg-luxury-gold/5'
                        : ''
                    }`}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => toggleProductSelection(product)}
                  >
                    <div className="aspect-square bg-luxury-elegant rounded-lg mb-3 flex items-center justify-center">
                      <Heart className="h-8 w-8 text-luxury-rose" />
                    </div>
                    
                    <h3 className="font-semibold text-sm text-foreground mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-luxury-rose">
                        {product.price}€
                      </span>
                      {product.promotion && (
                        <Badge className="bg-luxury-gradient text-white">
                          -{product.promotion}%
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="flex-1"
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Ajouter
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product);
                        }}
                      >
                        <Heart className="h-3 w-3 text-luxury-rose fill-current" />
                      </Button>
                    </div>

                    {selectedProducts.some(p => p.id === product.id) && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-luxury-gold rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {selectedProducts.findIndex(p => p.id === product.id) + 1}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              // Vue comparaison
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 text-muted-foreground">Attribut</th>
                      {selectedProducts.map((product) => (
                        <th key={product.id} className="text-center p-4 min-w-[200px]">
                          <div className="space-y-2">
                            <div className="aspect-square bg-luxury-elegant rounded-lg flex items-center justify-center mb-2">
                              <Heart className="h-6 w-6 text-luxury-rose" />
                            </div>
                            <h3 className="font-semibold text-sm line-clamp-2">
                              {product.name}
                            </h3>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {getComparisonData().map((row, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="p-4 font-medium text-foreground capitalize">
                          {row.attribute === 'price' && <DollarSign className="h-4 w-4 inline mr-2" />}
                          {row.attribute}
                        </td>
                        {row.values.map((value, valueIndex) => (
                          <td key={valueIndex} className="p-4 text-center">
                            {row.attribute === 'price' ? (
                              <span className="text-lg font-bold text-luxury-rose">{value}</span>
                            ) : (
                              <span className="text-foreground">{value}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <td className="p-4 font-medium text-foreground">Actions</td>
                      {selectedProducts.map((product) => (
                        <td key={product.id} className="p-4 text-center">
                          <div className="space-y-2">
                            <Button
                              onClick={() => addToCart(product)}
                              className="w-full bg-luxury-gradient"
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Ajouter au panier
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => toggleFavorite(product)}
                              className="w-full"
                            >
                              <Heart className="h-4 w-4 mr-2 text-luxury-rose fill-current" />
                              Retirer des favoris
                            </Button>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {favorites.length === 0 && (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Votre liste de souhaits est vide
                </h3>
                <p className="text-muted-foreground">
                  Ajoutez des produits à vos favoris pour les retrouver ici
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WishlistComparison;