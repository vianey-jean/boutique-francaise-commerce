
import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from '@/components/ui/sonner';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';

// Importer le type Product depuis les services API
export type { Product } from '@/services/api';
import { Product } from '@/services/api';

interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreContextType {
  // Cart properties from useCart hook
  cart: CartItem[];
  selectedCartItems: CartItem[];
  loading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, products: Product[]) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  setSelectedCartItems: (items: CartItem[]) => void;
  fetchCart: () => Promise<void>;
  
  // Favorites properties from useFavorites hook
  favorites: Product[];
  loadingFavorites: boolean;
  toggleFavorite: (product: Product) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  favoriteCount: number;
  
  // Orders properties from useOrders hook
  orders: any[];
  loadingOrders: boolean;
  fetchOrders: () => Promise<void>;
  createOrder: (shippingAddress: any, paymentMethod: string, selectedCartItems: CartItem[], promoDetails?: { code: string; productId: string; pourcentage: number }) => Promise<any>;
  
  // Legacy properties for backward compatibility
  cartItems: CartItem[];
  selectCartItem: (product: Product) => void;
  deselectCartItem: (productId: string) => void;
  selectAllCartItems: () => void;
  deselectAllCartItems: () => void;
  clearSelectedItems: () => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  
  // Additional properties that components expect
  products: Product[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const cartHook = useCart();
  const favoritesHook = useFavorites();
  const ordersHook = useOrders();
  const [selectedCartItems, setSelectedCartItems] = useState<CartItem[]>([]);

  // Legacy cart items for backward compatibility
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Sync cart items with the hook's cart
    setCartItems(cartHook.cart);
  }, [cartHook.cart]);

  useEffect(() => {
    // Charger les données du localStorage au montage pour la compatibilité
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems && !isAuthenticated) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Sauvegarder les données dans localStorage à chaque modification pour la compatibilité
    if (!isAuthenticated) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  // Legacy functions for backward compatibility
  const selectCartItem = (product: Product) => {
    setSelectedCartItems([...selectedCartItems, { product, quantity: 1 }]);
  };

  const deselectCartItem = (productId: string) => {
    const updatedSelectedItems = selectedCartItems.filter(item => item.product.id !== productId);
    setSelectedCartItems(updatedSelectedItems);
  };

  const selectAllCartItems = () => {
    setSelectedCartItems([...cartHook.cart]);
  };

  const deselectAllCartItems = () => {
    setSelectedCartItems([]);
  };

  const createOrder = async (shippingAddress: any, paymentMethod: string, selectedCartItems: CartItem[], promoDetails?: { code: string; productId: string; pourcentage: number }) => {
    try {
      const result = await ordersHook.createOrder(shippingAddress, paymentMethod, selectedCartItems, promoDetails);
      return result;
    } catch (error: any) {
      console.error("Erreur lors de la création de la commande:", error);
      toast.error(error.message || "Une erreur est survenue lors de la création de la commande");
      return null;
    }
  };

  const clearSelectedItems = () => {
    // Supprimer les produits sélectionnés du panier local
    const updatedCart = cartHook.cart.filter(item => 
      !selectedCartItems.some(selected => selected.product.id === item.product.id)
    );
    setSelectedCartItems([]);
    
    // Pour la compatibilité, mettre à jour les cartItems legacy
    setCartItems(updatedCart);
    
    if (!isAuthenticated) {
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    }
    
    toast.success('Produits supprimés du panier');
  };

  const increaseQuantity = (productId: string) => {
    if (isAuthenticated) {
      // Use the hook for authenticated users
      const product = cartHook.cart.find(item => item.product.id === productId)?.product;
      if (product) {
        cartHook.updateQuantity(productId, (cartHook.cart.find(item => item.product.id === productId)?.quantity || 0) + 1, [product]);
      }
    } else {
      // Legacy implementation for non-authenticated users
      const updatedCart = cartItems.map(item =>
        item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCartItems(updatedCart);
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    }
  };

  const decreaseQuantity = (productId: string) => {
    if (isAuthenticated) {
      // Use the hook for authenticated users
      const currentQuantity = cartHook.cart.find(item => item.product.id === productId)?.quantity || 0;
      if (currentQuantity > 1) {
        const product = cartHook.cart.find(item => item.product.id === productId)?.product;
        if (product) {
          cartHook.updateQuantity(productId, currentQuantity - 1, [product]);
        }
      }
    } else {
      // Legacy implementation for non-authenticated users
      const updatedCart = cartItems.map(item =>
        item.product.id === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      );
      setCartItems(updatedCart);
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    }
  };

  const value = {
    // useCart hook properties
    cart: cartHook.cart,
    selectedCartItems: cartHook.selectedCartItems,
    loading: cartHook.loading,
    addToCart: cartHook.addToCart,
    removeFromCart: cartHook.removeFromCart,
    updateQuantity: cartHook.updateQuantity,
    clearCart: cartHook.clearCart,
    getCartTotal: cartHook.getCartTotal,
    setSelectedCartItems: cartHook.setSelectedCartItems,
    fetchCart: cartHook.fetchCart,
    
    // useFavorites hook properties
    favorites: favoritesHook.favorites,
    loadingFavorites: favoritesHook.loading,
    toggleFavorite: favoritesHook.toggleFavorite,
    isFavorite: favoritesHook.isFavorite,
    favoriteCount: favoritesHook.favoriteCount,
    
    // useOrders hook properties
    orders: ordersHook.orders,
    loadingOrders: ordersHook.loading,
    fetchOrders: ordersHook.fetchOrders,
    createOrder,
    
    // Legacy properties for backward compatibility
    cartItems: isAuthenticated ? cartHook.cart : cartItems,
    selectCartItem,
    deselectCartItem,
    selectAllCartItems,
    deselectAllCartItems,
    clearSelectedItems,
    increaseQuantity,
    decreaseQuantity,
    
    // Additional properties that components expect
    products: favoritesHook.favorites, // Using favorites as products for now
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export { useStore };
