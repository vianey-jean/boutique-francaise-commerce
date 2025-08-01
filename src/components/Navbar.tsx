
import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from "@/lib/utils";
import { Home, Calendar, Info, Mail, Users, CalendarDays, Crown, Menu, X, User } from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  protected?: boolean;
}

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { name: 'Accueil', path: '/', icon: Home },
    { name: 'Dashbord', path: '/dashboard', icon: Calendar, protected: true },
    { name: 'Calendrier', path: '/calendar', icon: CalendarDays, protected: true },
    { name: 'Clients', path: '/clients', icon: Users, protected: true },
    { name: 'Àpropos', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Mail }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-blue-600 to-violet-600 backdrop-blur-md transition-all duration-300 border-b border-white/20",
      isScrolled ? "shadow-xl" : "shadow-none"
    )}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center text-xl font-bold text-white floating-animation">
            <Crown className="w-6 h-6 mr-2 text-yellow-300" />
            Riziky-Agendas Premium
          </Link>
          
          {/* Navigation Desktop */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              (!item.protected || user) && (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "py-2 px-4 rounded-lg transition-all duration-200 hover:bg-white/20 hover:backdrop-blur-sm flex items-center space-x-2 text-white/90 hover:text-white premium-hover",
                      isActive ? "bg-white/20 text-white font-semibold" : ""
                    )
                  }
                >
                  <item.icon className="w-5 h-5 text-white" />
                  <span className="text-white font-bold">{item.name}</span>
                </NavLink>
              )
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Auth Section Desktop */}
<div className="hidden lg:flex items-center space-x-4">
  {user ? (
    <>
      <div className="flex items-center gap-2 py-2 px-4 rounded-lg text-white/90 font-medium">
        <User className="w-5 h-5" />
        <span className="text-green-300 font-bold">{user.prenom} {user.nom}</span>
      </div>
      <button 
        onClick={logout} 
        className="py-2 px-4 rounded-lg bg-red-500/80 text-white border border-red-400/30 hover:bg-red-500/60 transition-all duration-200 font-medium"
      >
        Déconnexion
      </button>
    </>
  ) : (
    <>
      <Link 
        to="/connexion" 
        className="py-2 px-4 rounded-lg hover:bg-white/20 hover:backdrop-blur-sm transition-all duration-200 text-white/90 hover:text-white font-medium"
      >
        Connexion
      </Link>
      <Link 
        to="/inscription" 
        className="py-2 px-4 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all duration-200 font-medium backdrop-blur-sm border border-white/30"
      >
        Inscription
      </Link>
    </>
  )}
</div>

        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-white/20 pt-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                (!item.protected || user) && (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "py-3 px-4 rounded-lg transition-all duration-200 hover:bg-white/20 flex items-center space-x-3 text-white/90 hover:text-white",
                        isActive ? "bg-white/20 text-white font-semibold" : ""
                      )
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                )
              ))}
              
              {/* Auth Section Mobile */}
              <div className="mt-4 pt-4 border-t border-white/20">
                {user ? (
                  <>
                    <Link 
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 mb-3 px-4 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200"
                    >
                      <User className="w-5 h-5 text-white" />
                      <span className="text-white font-medium">Profil - {user.prenom}</span>
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-3 px-4 rounded-lg bg-red-500/20 text-white border border-red-400/30 hover:bg-red-500/30 transition-all duration-200 font-medium"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link 
                      to="/connexion"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full py-3 px-4 rounded-lg hover:bg-white/20 text-center text-white/90 hover:text-white font-medium transition-all duration-200"
                    >
                      Connexion
                    </Link>
                    <Link 
                      to="/inscription"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full py-3 px-4 rounded-lg bg-white/20 text-center text-white hover:bg-white/30 transition-all duration-200 font-medium border border-white/30"
                    >
                      Inscription
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
