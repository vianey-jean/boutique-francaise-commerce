
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative bg-gray-100 overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="max-w-lg">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-store-dark-blue mb-4">
              Discover Our Premium Collection
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Elevate your style with our exquisite selection of high-quality products designed for the modern lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-store-purple hover:bg-store-accent-purple text-white font-medium px-8 py-6 rounded-md flex items-center">
                Shop Now <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="border-store-purple text-store-purple hover:bg-store-purple hover:text-white px-8 py-6 rounded-md">
                Explore Collections
              </Button>
            </div>
          </div>
          <div className="hidden md:block relative">
            <div className="relative z-10 bg-white p-4 rounded-lg shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&auto=format&fit=crop" 
                alt="Featured Product" 
                className="w-full h-96 object-cover rounded" 
              />
              <div className="absolute -bottom-4 -right-4 bg-store-purple text-white p-4 rounded-lg">
                <p className="font-serif font-bold text-xl">New Collection</p>
                <p className="text-sm text-store-light-purple">Limited Edition</p>
              </div>
            </div>
            <div className="absolute top-10 -right-20 w-40 h-40 bg-store-light-purple rounded-full opacity-50"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-store-purple rounded-full opacity-30"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
