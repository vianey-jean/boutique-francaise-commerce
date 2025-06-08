
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/loading-spinner';
import CartSummary from '@/components/cart/CartSummary';
import CartItemCard from '@/components/cart/CartItemCard';
import EmptyCartMessage from '@/components/cart/EmptyCartMessage';
import { ShoppingCart, Sparkles, Shield, TrendingUp } from 'lucide-react';

const CartPage = () => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    loadingCart, 
    setSelectedCartItems 
  } = useStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (cart && cart.length > 0) {
      const initialSelection = cart.reduce((acc, item) => {
        acc[item.product.id] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setSelectedItems(initialSelection);
    }
  }, [cart]);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleSelectItem = (productId: string, checked: boolean) => {
    setSelectedItems(prev => ({
      ...prev,
      [productId]: checked
    }));
  };

  const handleCheckout = () => {
    const selectedProducts = cart.filter(item => selectedItems[item.product.id]);
    setSelectedCartItems(selectedProducts);
    navigate('/paiement');
  };

  if (loadingCart) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Votre Panier
            </h1>
            <div className="flex justify-center py-16">
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-gradient-to-r from-blue-500 to-indigo-500 border-t-transparent mx-auto"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 animate-pulse"></div>
                </div>
                <LoadingSpinner text="Chargement de votre panier..." />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/5 dark:via-indigo-500/5 dark:to-purple-500/5">
          <div className="absolute inset-0 bg-grid-neutral-100/50 dark:bg-grid-neutral-800/50" />
          <div className="container mx-auto px-4 py-12 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-2xl shadow-lg">
                  <ShoppingCart className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Votre Panier
              </h1>
              
              {cart && cart.length > 0 && (
                <div className="flex items-center justify-center space-x-8 text-sm text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-blue-500" />
                    <span>Livraison offerte dès 50€</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span>Paiement sécurisé</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-purple-500" />
                    <span>Retour gratuit 30j</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {!isAuthenticated || !cart || cart.length === 0 ? (
            <EmptyCartMessage isAuthenticated={isAuthenticated} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      Articles dans votre panier
                    </h2>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 px-4 py-2 rounded-full">
                      <span className="text-blue-700 dark:text-blue-400 font-medium">
                        {cart.length} article{cart.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <div 
                        key={item.product.id}
                        className="bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 rounded-xl p-4 border border-neutral-200 dark:border-neutral-600"
                      >
                        <CartItemCard
                          item={item}
                          isSelected={selectedItems[item.product.id] || false}
                          onSelectItem={handleSelectItem}
                          onQuantityChange={handleQuantityChange}
                          onRemove={removeFromCart}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700 flex justify-end">
                    <Button 
                      variant="outline" 
                      className="text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:border-blue-300 dark:hover:from-blue-950/20 dark:hover:to-indigo-950/20 dark:hover:text-blue-400"
                      onClick={() => {
                        const allSelected = cart.every(item => selectedItems[item.product.id]);
                        const newSelection = cart.reduce((acc, item) => {
                          acc[item.product.id] = !allSelected;
                          return acc;
                        }, {} as Record<string, boolean>);
                        setSelectedItems(newSelection);
                      }}
                    >
                      {cart.every(item => selectedItems[item.product.id]) 
                        ? "Désélectionner tout" 
                        : "Sélectionner tout"}
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5">
                      <div className="bg-blue-500 rounded-full p-1">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="text-blue-800 dark:text-blue-300 font-medium mb-1">
                        Livraison offerte à partir de 50€ d'achat.
                      </p>
                      <p className="text-blue-700 dark:text-blue-400 text-sm">
                        Les frais de livraison sont calculés à l'étape suivante.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <CartSummary 
                    onCheckout={handleCheckout}
                    selectedItems={selectedItems}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
