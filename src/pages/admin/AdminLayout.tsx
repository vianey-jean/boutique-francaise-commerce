
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingBag,
  Package,
  MessageCircle,
  Users,
  Truck,
  Settings,
  LogOut,
  MessageSquare,
  Bell
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import NotificationBadge from '@/components/ui/notification-badge';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { notifications, markOrdersAsRead, markContactsAsRead } = useNotifications();
  const [isServiceAdmin, setIsServiceAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    // Vérifier si on est sur une nouvelle page et fermer le menu mobile
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  useEffect(() => {
    // Check if the current user is a service client admin
    if (user && user.email === "service.client@example.com") {
      setIsServiceAdmin(true);
    }
  }, [user]);

  // Naviguer vers la page et marquer comme lu si nécessaire
  const navigateWithRead = (path: string) => {
    // Marquer comme lu selon la page
    if (path === '/admin/commandes') {
      markOrdersAsRead();
    } else if (path === '/admin/messages') {
      markContactsAsRead();
    }
  };
  
  const navItems = [
    { 
      name: 'Chat Admin', 
      path: '/admin', 
      icon: ShoppingBag,
      notification: notifications.totalUnreadAdminMessages
    },
    { 
      name: 'Produits', 
      path: '/admin/produits', 
      icon: Package,
      notification: 0
    },
    { 
      name: 'Utilisateurs', 
      path: '/admin/utilisateurs', 
      icon: Users,
      notification: 0
    },
    { 
      name: 'Messages', 
      path: '/admin/messages', 
      icon: MessageCircle,
      notification: notifications.unreadContacts
    },
    { 
      name: 'Commandes', 
      path: '/admin/commandes', 
      icon: Truck,
      notification: notifications.unreadOrders
    },
    // Conditional item for service client admin
    ...(isServiceAdmin ? [{ 
      name: 'Service Client', 
      path: '/admin/service-client', 
      icon: MessageSquare,
      notification: notifications.totalUnreadClientMessages
    }] : []),
    { 
      name: 'Paramètres', 
      path: '/admin/parametres', 
      icon: Settings,
      notification: 0
    },
  ];
  
  const totalNotifications = notifications.total;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar for desktop */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-gray-900 text-white md:min-h-screen z-50 md:z-auto absolute md:relative`}>
        {/* Mobile Header */}
        {mobileMenuOpen && (
          <div className="md:hidden p-4 bg-gray-900 text-white flex justify-between items-center">
            <span className="font-bold text-lg">Admin Dashboard</span>
            <button 
              className="focus:outline-none"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Sidebar Content */}
        <div className="p-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">Riziky-Boutic</h1>
            <p className="text-gray-400 text-sm">Administration</p>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-red-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
                onClick={() => navigateWithRead(item.path)}
              >
                <div className="relative">
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.notification > 0 && (
                    <NotificationBadge count={item.notification} className="-top-3 -right-3" />
                  )}
                </div>
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto pt-8 border-t border-gray-700 mt-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors w-full">
                  <Bell className="h-5 w-5 mr-3" />
                  {totalNotifications > 0 && (
                    <NotificationBadge count={totalNotifications} className="-top-1 -right-1" />
                  )}
                  Notifications
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Commandes */}
                {notifications.unreadOrders > 0 && (
                  <DropdownMenuItem onClick={() => navigateWithRead('/admin/commandes')}>
                    <Link to="/admin/commandes" className="flex items-center w-full">
                      <Truck className="h-4 w-4 mr-2" />
                      <span>
                        {notifications.unreadOrders} {notifications.unreadOrders === 1 ? 'nouvelle commande' : 'nouvelles commandes'}
                      </span>
                      <Badge variant="destructive" className="ml-auto">
                        {notifications.unreadOrders}
                      </Badge>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                {/* Messages */}
                {notifications.unreadContacts > 0 && (
                  <DropdownMenuItem onClick={() => navigateWithRead('/admin/messages')}>
                    <Link to="/admin/messages" className="flex items-center w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      <span>
                        {notifications.unreadContacts} {notifications.unreadContacts === 1 ? 'nouveau message' : 'nouveaux messages'} de contact
                      </span>
                      <Badge variant="destructive" className="ml-auto">
                        {notifications.unreadContacts}
                      </Badge>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                {/* Chat Admin */}
                {notifications.totalUnreadAdminMessages > 0 && (
                  <DropdownMenuItem onClick={() => navigateWithRead('/admin')}>
                    <Link to="/admin" className="flex items-center w-full">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      <span>
                        Messages de {Object.keys(notifications.unreadAdminChats).length} {Object.keys(notifications.unreadAdminChats).length === 1 ? 'administrateur' : 'administrateurs'}
                      </span>
                      <Badge variant="destructive" className="ml-auto">
                        {notifications.totalUnreadAdminMessages}
                      </Badge>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                {/* Chat Client */}
                {isServiceAdmin && notifications.totalUnreadClientMessages > 0 && (
                  <DropdownMenuItem onClick={() => navigateWithRead('/admin/service-client')}>
                    <Link to="/admin/service-client" className="flex items-center w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <span>
                        Messages de {Object.keys(notifications.unreadClientChats).length} {Object.keys(notifications.unreadClientChats).length === 1 ? 'client' : 'clients'}
                      </span>
                      <Badge variant="destructive" className="ml-auto">
                        {notifications.totalUnreadClientMessages}
                      </Badge>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                {notifications.total === 0 && (
                  <div className="p-4 text-center text-sm text-gray-500">
                    Aucune notification non lue
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/" className="flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors mt-2">
              <LogOut className="h-5 w-5 mr-3" />
              Quitter
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile Header */}
      <div className="md:hidden p-4 bg-gray-900 text-white flex justify-between items-center">
        <span className="font-bold text-lg">Riziky-Boutic Admin</span>
        <div className="flex items-center">
          <div className="relative mr-4">
            <Bell className="h-6 w-6" />
            {totalNotifications > 0 && (
              <NotificationBadge count={totalNotifications} />
            )}
          </div>
          <button 
            className="focus:outline-none"
            onClick={() => setMobileMenuOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
