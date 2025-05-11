
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ShoppingCart, Search } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Sample product data
const allProducts = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop',
    category: 'Electronics'
  },
  {
    id: 2,
    name: 'Ergonomic Office Chair',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800&auto=format&fit=crop',
    category: 'Furniture'
  },
  {
    id: 3,
    name: 'Smart Fitness Watch',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop',
    category: 'Electronics'
  },
  {
    id: 4,
    name: 'Premium Cotton T-Shirt',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop',
    category: 'Fashion'
  },
  {
    id: 5,
    name: 'Bluetooth Speaker',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?w=800&auto=format&fit=crop',
    category: 'Electronics'
  },
  {
    id: 6,
    name: 'Minimalist Coffee Table',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&auto=format&fit=crop',
    category: 'Furniture'
  },
  {
    id: 7,
    name: 'Smart Home Hub',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc984?w=800&auto=format&fit=crop',
    category: 'Electronics'
  },
  {
    id: 8,
    name: 'Designer Wristwatch',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800&auto=format&fit=crop',
    category: 'Fashion'
  }
];

const categories = ['All', 'Electronics', 'Furniture', 'Fashion'];

const Shop = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [sortBy, setSortBy] = useState('featured');

  const addToCart = (product) => {
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  // Filter products
  const filteredProducts = allProducts.filter((product) => {
    // Category filter
    if (selectedCategory !== 'All' && product.category !== selectedCategory) {
      return false;
    }
    
    // Price filter
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    
    // Search query filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0; // featured, no specific order
    }
  });

  return (
    <div>
      <Header />
      
      <div className="bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold text-store-dark-blue">Shop</h1>
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-store-purple">Home</Link>
            <span className="mx-2">/</span>
            <span>Shop</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <div className="w-full lg:w-1/4 space-y-6">
            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-lg mb-3">Search</h3>
              <div className="relative">
                <Input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            {/* Categories */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-lg mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <Checkbox 
                      id={`category-${category}`}
                      checked={selectedCategory === category}
                      onCheckedChange={() => setSelectedCategory(category)}
                      className="border-gray-300"
                    />
                    <label 
                      htmlFor={`category-${category}`}
                      className="ml-2 text-gray-700 cursor-pointer"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price Range */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-lg mb-3">Price Range</h3>
              <Slider
                defaultValue={priceRange}
                min={0}
                max={300}
                step={10}
                onValueChange={setPriceRange}
                className="mb-4"
              />
              <div className="flex items-center justify-between">
                <span className="text-gray-700">${priceRange[0]}</span>
                <span className="text-gray-700">${priceRange[1]}</span>
              </div>
            </div>
          </div>
          
          {/* Products grid */}
          <div className="w-full lg:w-3/4">
            {/* Sort and filter bar */}
            <div className="flex flex-wrap gap-4 items-center justify-between mb-6 bg-white p-3 rounded-lg shadow-sm">
              <p className="text-gray-600">{sortedProducts.length} products found</p>
              <div className="w-full sm:w-auto">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Products */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden bg-white product-card border-none">
                    <div className="relative overflow-hidden aspect-square">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="bg-store-purple text-white text-xs px-2 py-1 rounded-full">
                          {product.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-medium text-gray-900 hover:text-store-purple transition-colors mb-1">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-gray-700 font-semibold mb-3">${product.price.toFixed(2)}</p>
                      <Button 
                        onClick={() => addToCart(product)}
                        className="w-full bg-store-dark-blue hover:bg-store-purple transition-colors"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Shop;
