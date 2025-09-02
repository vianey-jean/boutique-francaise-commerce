import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { X, Star, ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  features: string[];
  inStock: boolean;
}

interface ProductComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddToCart: (productId: string) => void;
  onAddToFavorites: (productId: string) => void;
}

const ProductComparisonModal: React.FC<ProductComparisonModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddToCart,
  onAddToFavorites
}) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(products.slice(0, 3));

  const removeProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" aria-describedby="product-comparison-description">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Comparaison de produits
          </DialogTitle>
          <div id="product-comparison-description" className="sr-only">
            Modal de comparaison permettant de comparer plusieurs produits côte à côte
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {selectedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 z-10 h-8 w-8 p-0"
                  onClick={() => removeProduct(product.id)}
                >
                  <X className="h-4 w-4" />
                </Button>

                <CardContent className="p-6">
                  {/* Image du produit */}
                  <div className="aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Nom du produit */}
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Prix */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-blue-600">
                        {product.price.toFixed(2)} €
                      </span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          {product.originalPrice.toFixed(2)} €
                        </span>
                      )}
                    </div>
                    {product.originalPrice && (
                      <Badge variant="destructive" className="mt-1">
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </Badge>
                    )}
                  </div>

                  {/* Évaluation */}
                  <div className="flex items-center gap-2 mb-4">
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
                      ({product.reviewCount} avis)
                    </span>
                  </div>

                  {/* Disponibilité */}
                  <Badge 
                    variant={product.inStock ? "default" : "destructive"}
                    className="mb-4"
                  >
                    {product.inStock ? "En stock" : "Rupture de stock"}
                  </Badge>

                  {/* Caractéristiques */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Caractéristiques:</h4>
                    <ul className="space-y-1">
                      {product.features.slice(0, 4).map((feature, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button
                      onClick={() => onAddToCart(product.id)}
                      disabled={!product.inStock}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Ajouter au panier
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => onAddToFavorites(product.id)}
                      className="w-full"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Favoris
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {selectedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun produit à comparer</p>
            <Button onClick={onClose} className="mt-4">
              Fermer
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductComparisonModal;