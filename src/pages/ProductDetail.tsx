
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Minus, 
  Plus,
  Truck, 
  RefreshCcw,
  Shield,
  Star
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeaturedProducts from '@/components/FeaturedProducts';

// Sample product data
const products = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 129.99,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&auto=format&fit=crop'
    ],
    category: 'Electronics',
    description: 'Experience premium sound quality with these wireless headphones. Featuring active noise cancellation, comfortable ear cups, and long battery life for all-day listening.',
    features: [
      'Active Noise Cancellation',
      'Bluetooth 5.0 Connectivity',
      'Up to 30 hours of battery life',
      'Premium sound quality',
      'Comfortable over-ear design'
    ],
    specs: {
      'Brand': 'ElégantAudio',
      'Model': 'EA-500',
      'Connectivity': 'Bluetooth 5.0',
      'Battery Life': '30 hours',
      'Charging Time': '2 hours',
      'Weight': '250g'
    },
    rating: 4.7,
    reviewCount: 124,
    stock: 15
  },
  {
    id: 2,
    name: 'Ergonomic Office Chair',
    price: 249.99,
    images: [
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&auto=format&fit=crop'
    ],
    category: 'Furniture',
    description: 'Enhance your workspace with this ergonomically designed office chair. Featuring adjustable height, lumbar support, and premium materials for comfort during long work hours.',
    features: [
      'Ergonomic design',
      'Adjustable height and armrests',
      'Breathable mesh back',
      'Premium cushioning',
      '360° swivel'
    ],
    specs: {
      'Brand': 'ComfortPlus',
      'Material': 'Mesh, Memory Foam',
      'Weight Capacity': '300 lbs',
      'Adjustable Height': 'Yes',
      'Armrests': 'Adjustable',
      'Warranty': '3 years'
    },
    rating: 4.5,
    reviewCount: 89,
    stock: 8
  }
];

const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < fullStars 
              ? "fill-store-purple text-store-purple" 
              : i === fullStars && hasHalfStar 
              ? "text-store-purple fill-store-purple/50" 
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Find the product based on the ID from the URL
  const product = products.find(p => p.id === Number(id));
  
  if (!product) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-medium mb-4">Product Not Found</h1>
          <p className="mb-6">We couldn't find the product you're looking for.</p>
          <Button asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const addToCart = () => {
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to your cart`,
    });
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist`,
    });
  };

  return (
    <div>
      <Header />
      
      <div className="bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-store-purple">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-store-purple">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">{product.name}</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg overflow-hidden">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name} 
                className="w-full h-auto object-cover aspect-square"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div 
                  key={index}
                  className={`cursor-pointer rounded-md overflow-hidden border-2 ${
                    selectedImage === index ? "border-store-purple" : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} view ${index + 1}`} 
                    className="w-full h-auto object-cover aspect-square"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold text-store-dark-blue mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-2">
                <RatingStars rating={product.rating} />
                <span className="text-sm text-gray-500">{product.reviewCount} reviews</span>
              </div>
              <p className="text-2xl font-semibold text-store-dark-blue">${product.price.toFixed(2)}</p>
            </div>
            
            <p className="text-gray-600">{product.description}</p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="mr-4">
                  <span className="text-gray-600 mr-2">Availability:</span>
                  {product.stock > 0 ? (
                    <span className="text-green-600 font-medium">In Stock ({product.stock} available)</span>
                  ) : (
                    <span className="text-red-500 font-medium">Out of Stock</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Category:</span>
                <Link 
                  to={`/category/${product.category.toLowerCase()}`} 
                  className="text-store-purple hover:underline"
                >
                  {product.category}
                </Link>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-200 space-y-4">
              <div className="flex items-center">
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button 
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 min-w-[40px] text-center">{quantity}</span>
                  <button 
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="ml-4 flex-1">
                  <Button 
                    className="w-full bg-store-purple hover:bg-store-accent-purple transition-colors"
                    onClick={addToCart}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                  </Button>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full border-store-purple text-store-purple hover:bg-store-purple hover:text-white"
                onClick={addToWishlist}
              >
                <Heart className="mr-2 h-4 w-4" /> Add to Wishlist
              </Button>
            </div>
            
            <div className="pt-6 border-t border-gray-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-store-purple mr-2" />
                  <span className="text-sm">Free shipping over $50</span>
                </div>
                <div className="flex items-center">
                  <RefreshCcw className="h-5 w-5 text-store-purple mr-2" />
                  <span className="text-sm">30-day returns</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-store-purple mr-2" />
                  <span className="text-sm">2-year warranty</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <Button variant="ghost" size="sm" className="text-gray-500">
                  <Share2 className="h-4 w-4 mr-1" /> Share
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="details">
            <TabsList className="w-full border-b justify-start">
              <TabsTrigger value="details" className="rounded-none data-[state=active]:border-b-2 border-store-purple">
                Product Details
              </TabsTrigger>
              <TabsTrigger value="features" className="rounded-none data-[state=active]:border-b-2 border-store-purple">
                Features
              </TabsTrigger>
              <TabsTrigger value="specs" className="rounded-none data-[state=active]:border-b-2 border-store-purple">
                Specifications
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="py-6">
              <p className="text-gray-600">{product.description}</p>
            </TabsContent>
            <TabsContent value="features" className="py-6">
              <ul className="list-disc pl-5 space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-gray-600">{feature}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="specs" className="py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="border-b pb-2">
                    <span className="font-medium text-gray-700">{key}:</span> {value}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-store-dark-blue mb-6">You May Also Like</h2>
          <FeaturedProducts />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
