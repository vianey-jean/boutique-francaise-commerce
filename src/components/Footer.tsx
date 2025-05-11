
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-store-dark-blue text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        {/* Newsletter */}
        <div className="mb-10 pb-10 border-b border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-serif font-semibold">Subscribe to our newsletter</h3>
              <p className="text-gray-300 mt-2">Get the latest updates on new products and upcoming sales</p>
            </div>
            <div className="w-full md:w-1/3">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button className="bg-store-purple hover:bg-store-accent-purple">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Shop Information */}
          <div>
            <h1 className="font-serif text-xl font-bold mb-4">
              ElégantShop<span className="text-store-purple">.</span>
            </h1>
            <p className="text-gray-300 mb-4">
              Elevate your lifestyle with our carefully curated selection of premium products.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-store-purple">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-store-purple">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-store-purple">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-store-purple">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Shopping */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Shopping</h4>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-gray-300 hover:text-store-purple">All Products</Link></li>
              <li><Link to="/categories" className="text-gray-300 hover:text-store-purple">Categories</Link></li>
              <li><Link to="/new-arrivals" className="text-gray-300 hover:text-store-purple">New Arrivals</Link></li>
              <li><Link to="/sale" className="text-gray-300 hover:text-store-purple">Sale Items</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Information</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-store-purple">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-store-purple">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-store-purple">FAQ</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-store-purple">Blog</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link to="/shipping" className="text-gray-300 hover:text-store-purple">Shipping</Link></li>
              <li><Link to="/returns" className="text-gray-300 hover:text-store-purple">Returns & Exchanges</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-store-purple">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-store-purple">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} ElégantShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
