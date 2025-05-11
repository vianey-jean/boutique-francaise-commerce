
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Menu, Search, User, X } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="font-serif text-xl font-bold text-store-dark-blue">
              ElégantShop<span className="text-store-purple">.</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-store-purple font-medium">Home</Link>
            <Link to="/shop" className="text-gray-700 hover:text-store-purple font-medium">Shop</Link>
            <Link to="/categories" className="text-gray-700 hover:text-store-purple font-medium">Categories</Link>
            <Link to="/about" className="text-gray-700 hover:text-store-purple font-medium">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-store-purple font-medium">Contact</Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {searchOpen ? (
              <div className="flex items-center border rounded-md px-2 bg-white">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button variant="ghost" size="icon" onClick={() => setSearchOpen(false)}>
                  <X size={18} />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
                <Search size={20} />
              </Button>
            )}
            <Button variant="ghost" size="icon" asChild>
              <Link to="/account">
                <User size={20} />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/cart">
                <ShoppingCart size={20} />
                <span className="absolute -top-1 -right-1 bg-store-purple text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <Link to="/" className="block text-gray-700 hover:text-store-purple font-medium py-2">Home</Link>
            <Link to="/shop" className="block text-gray-700 hover:text-store-purple font-medium py-2">Shop</Link>
            <Link to="/categories" className="block text-gray-700 hover:text-store-purple font-medium py-2">Categories</Link>
            <Link to="/about" className="block text-gray-700 hover:text-store-purple font-medium py-2">About</Link>
            <Link to="/contact" className="block text-gray-700 hover:text-store-purple font-medium py-2">Contact</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
