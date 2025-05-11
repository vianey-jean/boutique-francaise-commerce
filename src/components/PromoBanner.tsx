
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PromoBanner = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-store-dark-blue/90"></div>
        <img
          src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&auto=format&fit=crop"
          alt="Promo Background"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-lg mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Special Offer
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Get 20% off on all electronics this week only. Use promo code:
          </p>
          <div className="inline-block bg-white/10 backdrop-blur-sm px-8 py-3 rounded-lg border border-white/20 mb-6">
            <span className="text-2xl font-bold tracking-wider text-store-purple">ELEGANCE20</span>
          </div>
          <div>
            <Button 
              className="bg-store-purple hover:bg-store-accent-purple text-white px-8 py-6"
              asChild
            >
              <Link to="/shop">Shop Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
