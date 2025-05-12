
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { StoreProvider } from './contexts/StoreContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Toaster } from './components/ui/sonner';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Pages
import Index from './pages/Index';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import ProductDetail from './pages/ProductDetail';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderPage from './pages/OrderPage';
import FavoritesPage from './pages/FavoritesPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFound from './pages/NotFound';
import DeliveryPage from './pages/DeliveryPage';
import ReturnsPage from './pages/ReturnsPage';
import CookiesPage from './pages/CookiesPage';
import BlogPage from './pages/BlogPage';
import HistoryPage from './pages/HistoryPage';
import CustomerServicePage from './pages/CustomerServicePage';
import CarriersPage from './pages/CarriersPage';
import ChatPage from './pages/ChatPage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminChatPage from './pages/admin/AdminChatPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminMessagesPage from './pages/admin/AdminMessagesPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminClientChatPage from './pages/admin/AdminClientChatPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StoreProvider>
          <NotificationProvider>
            <Routes>
              {/* Client Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/inscription" element={<RegisterPage />} />
              <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} />
              <Route path="/produit/:id" element={<ProductDetail />} />
              <Route path="/categorie/:category" element={<CategoryPage />} />
              <Route path="/panier" element={<CartPage />} />
              <Route path="/paiement" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="/commandes" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
              <Route path="/commande/:id" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
              <Route path="/favoris" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
              <Route path="/profil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/conditions-generales" element={<TermsPage />} />
              <Route path="/politique-confidentialite" element={<PrivacyPage />} />
              <Route path="/livraison" element={<DeliveryPage />} />
              <Route path="/retours" element={<ReturnsPage />} />
              <Route path="/cookies" element={<CookiesPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/histoire" element={<HistoryPage />} />
              <Route path="/service-client" element={<CustomerServicePage />} />
              <Route path="/transporteurs" element={<CarriersPage />} />
              <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminChatPage /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/produits" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminProductsPage /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/utilisateurs" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminUsersPage /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/messages" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminMessagesPage /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/commandes" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminOrdersPage /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/service-client" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminClientChatPage /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/parametres" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminSettingsPage /></AdminLayout></ProtectedRoute>} />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </NotificationProvider>
        </StoreProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
