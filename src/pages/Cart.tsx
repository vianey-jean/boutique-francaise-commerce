
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Trash2, 
  Minus, 
  Plus, 
  RefreshCcw, 
  ChevronRight, 
  ShoppingBag
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Sample cart data
const initialCartItems = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 129.99,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Smart Fitness Watch',
    price: 89.99,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop',
  }
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  const removeItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };
  
  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'ELEGANCE20') {
      setPromoApplied(true);
    }
  };
  
  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  );
  
  const discount = promoApplied ? subtotal * 0.2 : 0;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal - discount + shipping;

  return (
    <div>
      <Header />
      
      <div className="bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold text-store-dark-blue">Shopping Cart</h1>
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-store-purple">Home</Link>
            <span className="mx-2">/</span>
            <span>Cart</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b text-sm font-medium text-gray-500">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Subtotal</div>
                </div>
                
                {/* Cart Items */}
                {cartItems.map(item => (
                  <div 
                    key={item.id} 
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b items-center"
                  >
                    {/* Product */}
                    <div className="col-span-6 flex items-center space-x-4">
                      <Link to={`/product/${item.id}`} className="shrink-0 w-20 h-20 bg-gray-100 rounded">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </Link>
                      <div>
                        <Link 
                          to={`/product/${item.id}`}
                          className="font-medium text-gray-900 hover:text-store-purple"
                        >
                          {item.name}
                        </Link>
                        <div className="md:hidden mt-1 text-gray-600">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="hidden md:block col-span-2 text-center text-gray-700">
                      ${item.price.toFixed(2)}
                    </div>
                    
                    {/* Quantity */}
                    <div className="col-span-2">
                      <div className="flex items-center justify-center">
                        <div className="flex items-center border rounded-md overflow-hidden">
                          <button 
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4 py-2 min-w-[40px] text-center">{item.quantity}</span>
                          <button 
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Subtotal */}
                    <div className="col-span-2 text-center text-gray-700 flex flex-wrap justify-between md:justify-center items-center">
                      <span className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Actions */}
                <div className="p-4 flex flex-wrap gap-4 justify-between">
                  <div className="flex items-center">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/shop">
                        <RefreshCcw size={16} className="mr-2" /> 
                        Continue Shopping
                      </Link>
                    </Button>
                  </div>
                  <div>
                    <Button variant="outline" size="sm" onClick={() => setCartItems([])}>
                      <Trash2 size={16} className="mr-2" /> 
                      Clear Cart
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="font-serif text-xl font-semibold mb-4">Order Summary</h2>
                
                {/* Promo Code */}
                <div className="mb-4 pb-4 border-b">
                  <p className="text-sm mb-2">If you have a promo code, enter it here.</p>
                  <div className="flex gap-2">
                    <Input 
                      type="text" 
                      placeholder="Promo code" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={applyPromoCode}
                    >
                      Apply
                    </Button>
                  </div>
                  {promoApplied && (
                    <p className="text-green-600 text-sm mt-2">Promo code applied!</p>
                  )}
                </div>
                
                {/* Summary */}
                <div className="space-y-2 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {promoApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (20%)</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="pt-2 mt-2 border-t flex justify-between font-medium text-base">
                    <span>Total</span>
                    <span className="text-store-dark-blue">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-store-purple hover:bg-store-accent-purple transition-colors"
                  asChild
                >
                  <Link to="/checkout">
                    Proceed to Checkout <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <ShoppingBag className="h-8 w-8 text-gray-500" />
            </div>
            <h2 className="text-2xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Button className="bg-store-purple hover:bg-store-accent-purple" size="lg" asChild>
              <Link to="/shop">
                Start Shopping
              </Link>
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Cart;
