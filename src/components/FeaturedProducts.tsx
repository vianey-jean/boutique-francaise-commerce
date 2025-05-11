
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

// Sample product data
const products = [
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
  }
];

const FeaturedProducts = () => {
  const { toast } = useToast();

  const addToCart = (product) => {
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-store-dark-blue mb-2">
            Featured Products
          </h2>
          <p className="text-gray-500">Discover our handpicked selection of premium products</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
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
        
        <div className="text-center mt-10">
          <Button 
            variant="outline" 
            className="border-store-purple text-store-purple hover:bg-store-purple hover:text-white"
            asChild
          >
            <Link to="/shop">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
