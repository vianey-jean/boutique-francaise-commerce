
import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from "@/lib/utils";
import { Home, Calendar, Info, Mail, Users, CalendarDays, Crown, Menu, X, User, Diamond, Star, Sparkles } from 'lucide-react';

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
       <Link
              to="/"
              className={cn(
                "group flex items-center transition-all duration-700 ease-out transform hover:scale-105",
                "relative overflow-hidden rounded-xl px-2 py-1 shrink-0"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex items-center">
                <div className="relative mr-2 lg:mr-3 transform group-hover:rotate-12 transition-all duration-700 ease-out">
                  <div className={cn(
                    "w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center relative overflow-hidden",
                    "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500",
                    "shadow-lg shadow-orange-500/30 group-hover:shadow-xl group-hover:shadow-orange-500/50"
                  )}>
                    <Crown className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white drop-shadow-lg transform group-hover:scale-110 transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center transform rotate-12 group-hover:rotate-45 transition-all duration-700">
                    <Star className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white animate-pulse" />
                  </div>
                  <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center transform -rotate-12 group-hover:-rotate-45 transition-all duration-700">
                    <Diamond className="w-1 h-1 sm:w-1.5 sm:h-1.5 text-white" />
                  </div>
                </div>

                <div className="relative min-w-0 flex-shrink">
                  <div className="font-black tracking-tight leading-none text-sm sm:text-lg lg:text-xl xl:text-2xl text-white">
                    <span className="block bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent animate-pulse">
                      Riziky
                    </span>
                    <span className="block text-xs sm:text-xs lg:text-sm xl:text-base font-semibold tracking-wider text-white/90 truncate">
                      Agendas Premium
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/30 via-orange-400/30 to-red-400/30 blur-lg opacity-0 group-hover:opacity-50 transition-all duration-500 -z-10"></div>
                </div>

                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 animate-pulse text-yellow-300" />
                </div>
              </div>
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
