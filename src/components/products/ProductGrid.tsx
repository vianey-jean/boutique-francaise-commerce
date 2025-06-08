
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { LayoutGrid, LayoutList, Filter, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Link } from 'react-router-dom';
import { getSecureRoute } from '@/services/secureIds';

interface ProductGridProps {
  products: Product[];
  title?: string;
  description?: string;
  showFilters?: boolean;
  isLoading?: boolean;
  showViewAllButton?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  title, 
  description, 
  showFilters = false,
  isLoading = false,
  showViewAllButton = false
}) => {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  
  useEffect(() => {
    setCurrentPage(1);
    setVisibleProducts(products.slice(0, productsPerPage));
  }, [products]);
  
  const loadMoreProducts = () => {
    const nextPage = currentPage + 1;
    const nextProducts = products.slice(0, nextPage * productsPerPage);
    setVisibleProducts(nextProducts);
    setCurrentPage(nextPage);
  };

  const hasMoreProducts = visibleProducts.length < products.length;
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const childVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="product-section relative">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-transparent to-blue-50/30 dark:from-red-900/10 dark:to-blue-900/10 pointer-events-none"></div>
      
      {(title || description) && (
        <div className="relative z-10 flex flex-col items-center mb-12">
          {title && (
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Sparkles className="h-8 w-8 text-red-600" />
                <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  {title}
                </h2>
                <Sparkles className="h-8 w-8 text-red-600" />
              </div>
              <div className="w-32 h-1 bg-gradient-to-r from-red-500 to-purple-600 mx-auto rounded-full"></div>
            </div>
          )}

          {description && (
            <p className="text-neutral-600 dark:text-neutral-400 text-center max-w-2xl text-lg leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}
      
      {/* Controls Header */}
      <div className="relative z-10 flex justify-between items-center mb-8 p-6 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50">
        <div className="flex items-center gap-4">
          {/* Layout toggles */}
          <div className="flex bg-gradient-to-r from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-800 rounded-xl p-1.5 shadow-inner">
            <Button 
              type="button"
              variant="ghost" 
              size="sm"
              className={`rounded-lg transition-all duration-300 ${layout === 'grid' ? 'bg-white dark:bg-neutral-900 shadow-md text-red-600' : 'hover:bg-white/50'}`}
              onClick={() => setLayout('grid')}
              aria-label="Affichage en grille"
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button 
              type="button"
              variant="ghost" 
              size="sm"
              className={`rounded-lg transition-all duration-300 ${layout === 'list' ? 'bg-white dark:bg-neutral-900 shadow-md text-red-600' : 'hover:bg-white/50'}`}
              onClick={() => setLayout('list')}
              aria-label="Affichage en liste"
            >
              <LayoutList className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Product count */}
          <div className="flex items-center space-x-2 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 px-4 py-2 rounded-xl border border-red-200/50 dark:border-red-800/50">
            <TrendingUp className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-700 dark:text-red-400">
              {products.length} produit{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {showViewAllButton && (
            <Link to={getSecureRoute('/tous-les-produits')}>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Voir tous les produits
              </Button>
            </Link>
          )}
          
          {showFilters && (
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Filter className="h-4 w-4" />
                  Filtres
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filtres de recherche</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <p className="text-neutral-600 dark:text-neutral-400">Options de filtrage à implémenter</p>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
      
      {/* Loading State */}
      {isLoading ? (
        <div className={layout === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8" 
          : "flex flex-col gap-6"
        }>
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`${layout === 'list' ? 'border rounded-2xl p-6' : ''} animate-pulse`}>
              <div className="bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 w-full h-64 rounded-2xl mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 rounded w-3/4"></div>
                <div className="h-4 bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Product Grid/List */}
          {layout === 'grid' ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8" 
              role="list" 
              aria-label="Liste de produits"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {visibleProducts.map(product => (
                <motion.div key={product.id} role="listitem" variants={childVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="flex flex-col gap-6" 
              role="list" 
              aria-label="Liste de produits"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {visibleProducts.map(product => (
                <motion.div 
                  key={product.id} 
                  role="listitem" 
                  className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl hover:border-red-300 dark:hover:border-red-700 hover:shadow-xl transition-all duration-300 overflow-hidden"
                  variants={childVariants}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 p-6">
                      <div className="aspect-square bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-700 dark:to-neutral-800 rounded-xl overflow-hidden">
                        <img 
                          src={product.image ? `${import.meta.env.VITE_API_BASE_URL}${product.image}` : '/placeholder.svg'} 
                          alt={product.name}
                          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    </div>
                    <div className="md:w-2/3 p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-3 text-neutral-800 dark:text-white hover:text-red-600 transition-colors">{product.name}</h3>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-3 leading-relaxed">{product.description}</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          {product.promotion ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <p className="text-lg text-neutral-500 line-through">
                                  {typeof product.originalPrice === 'number'
                                    ? product.originalPrice.toFixed(2)
                                    : product.price.toFixed(2)}{' '}
                                  €
                                </p>
                                <p className="font-bold text-red-600 text-2xl">{product.price.toFixed(2)} €</p>
                              </div>
                              <div className="inline-flex items-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-lg text-sm font-medium">
                                💰 Économisez {((typeof product.originalPrice === 'number' ? product.originalPrice : product.price) - product.price).toFixed(2)} €
                              </div>
                            </div>
                          ) : (
                            <p className="font-bold text-2xl text-neutral-800 dark:text-white">{product.price.toFixed(2)} €</p>
                          )}
                        </div>
                        <div className="flex gap-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all duration-300"
                            onClick={() => {
                              const { toggleFavorite } = require('@/contexts/StoreContext').useStore();
                              toggleFavorite(product);
                            }}
                          >
                            <Heart className="h-4 w-4 mr-2" />
                            Favoris
                          </Button>
                          <Button 
                            size="sm"
                            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            onClick={() => {
                              const { addToCart } = require('@/contexts/StoreContext').useStore();
                              addToCart(product);
                            }}
                            disabled={!product.isSold || (product.stock !== undefined && product.stock <= 0)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Ajouter au panier
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          {/* Load More Button */}
          {hasMoreProducts && (
            <div className="flex justify-center mt-12">
              <Button 
                onClick={loadMoreProducts}
                variant="outline"
                className="px-12 py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg font-medium"
              >
                Afficher plus de produits
              </Button>
            </div>
          )}
        </>
      )}
      
      {/* Empty State */}
      {!isLoading && products.length === 0 && (
        <div className="text-center py-20 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-700">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-12 w-12 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-2">Aucun produit trouvé</h3>
            <p className="text-neutral-600 dark:text-neutral-400">Essayez de modifier vos critères de recherche</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
