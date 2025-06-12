
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import RegistrationChecker from './RegistrationChecker';
import SecureRoute from '@/components/SecureRoute';
import LoadingFallback from './LoadingFallback';
import PageDataLoader from '@/components/layout/PageDataLoader';

// Pages principales
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const AllProductsPage = React.lazy(() => import('@/pages/AllProductsPage'));
const CategoryPage = React.lazy(() => import('@/pages/CategoryPage'));
const ProductDetailPage = React.lazy(() => import('@/pages/ProductDetailPage'));
const CartPage = React.lazy(() => import('@/pages/CartPage'));
const FavoritesPage = React.lazy(() => import('@/pages/FavoritesPage'));
const CheckoutPage = React.lazy(() => import('@/pages/CheckoutPage'));
const OrderConfirmationPage = React.lazy(() => import('@/pages/OrderConfirmationPage'));
const OrderDetailsPage = React.lazy(() => import('@/pages/OrderDetailsPage'));
const OrdersPage = React.lazy(() => import('@/pages/OrdersPage'));
const FlashSalePage = React.lazy(() => import('@/pages/FlashSalePage'));
const BlogPage = React.lazy(() => import('@/pages/BlogPage'));
const DeliveryPage = React.lazy(() => import('@/pages/DeliveryPage'));
const CustomerServicePage = React.lazy(() => import('@/pages/CustomerServicePage'));

// Pages d'authentification
const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const RegisterPage = React.lazy(() => import('@/pages/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('@/pages/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('@/pages/ResetPasswordPage'));

// Pages d'erreur
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const RegisterBlockPage = React.lazy(() => import('@/pages/RegisterBlockPage'));

// Pages administrateur
const AdminDashboard = React.lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminProducts = React.lazy(() => import('@/pages/admin/AdminProducts'));
const AdminCategories = React.lazy(() => import('@/pages/admin/AdminCategories'));
const AdminOrders = React.lazy(() => import('@/pages/admin/AdminOrders'));
const AdminUsers = React.lazy(() => import('@/pages/admin/AdminUsers'));
const AdminSettings = React.lazy(() => import('@/pages/admin/AdminSettings'));
const AdminPromoCodes = React.lazy(() => import('@/pages/admin/AdminPromoCodes'));
const AdminFlashSales = React.lazy(() => import('@/pages/admin/AdminFlashSales'));

const AppRoutes = () => {
  const loadPageData = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { loaded: true };
  };

  const handleDataSuccess = () => {};
  const handleMaxRetriesReached = () => {};

  return (
    <Router>
      <Routes>
        {/* Route d'accueil */}
        <Route 
          path="/" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <HomePage />
            </Suspense>
          } 
        />

        {/* Pages principales */}
        <Route 
          path="/produits" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PageDataLoader
                fetchFunction={loadPageData}
                onSuccess={handleDataSuccess}
                onMaxRetriesReached={handleMaxRetriesReached}
                loadingMessage="Chargement des produits..."
                loadingSubmessage="Préparation de votre catalogue premium..."
                errorMessage="Erreur de chargement des produits"
              >
                <AllProductsPage />
              </PageDataLoader>
            </Suspense>
          } 
        />

        <Route 
          path="/categorie/:categoryName" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PageDataLoader
                fetchFunction={loadPageData}
                onSuccess={handleDataSuccess}
                onMaxRetriesReached={handleMaxRetriesReached}
                loadingMessage="Chargement de la catégorie..."
                loadingSubmessage="Préparation de votre sélection premium..."
                errorMessage="Erreur de chargement de la catégorie"
              >
                <CategoryPage />
              </PageDataLoader>
            </Suspense>
          } 
        />

        <Route 
          path="/produit/:productId" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PageDataLoader
                fetchFunction={loadPageData}
                onSuccess={handleDataSuccess}
                onMaxRetriesReached={handleMaxRetriesReached}
                loadingMessage="Chargement du produit..."
                loadingSubmessage="Préparation des détails premium..."
                errorMessage="Erreur de chargement du produit"
              >
                <ProductDetailPage />
              </PageDataLoader>
            </Suspense>
          } 
        />

        <Route 
          path="/panier" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <CartPage />
            </Suspense>
          } 
        />

        <Route 
          path="/favoris" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <FavoritesPage />
            </Suspense>
          } 
        />

        <Route 
          path="/paiement" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PageDataLoader
                fetchFunction={loadPageData}
                onSuccess={handleDataSuccess}
                onMaxRetriesReached={handleMaxRetriesReached}
                loadingMessage="Chargement du paiement..."
                loadingSubmessage="Sécurisation de votre transaction..."
                errorMessage="Erreur de chargement du paiement"
              >
                <CheckoutPage />
              </PageDataLoader>
            </Suspense>
          } 
        />

        <Route 
          path="/commande/:orderId" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <SecureRoute>
                <PageDataLoader
                  fetchFunction={loadPageData}
                  onSuccess={handleDataSuccess}
                  onMaxRetriesReached={handleMaxRetriesReached}
                  loadingMessage="Chargement de la commande..."
                  loadingSubmessage="Récupération des détails..."
                  errorMessage="Erreur de chargement de la commande"
                >
                  <OrderDetailsPage />
                </PageDataLoader>
              </SecureRoute>
            </Suspense>
          } 
        />

        <Route 
          path="/mes-commandes" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <OrdersPage />
            </Suspense>
          } 
        />

        <Route 
          path="/vente-flash/:id" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <FlashSalePage />
            </Suspense>
          } 
        />

        <Route 
          path="/blog" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <BlogPage />
            </Suspense>
          } 
        />

        <Route 
          path="/livraison" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <DeliveryPage />
            </Suspense>
          } 
        />

        <Route 
          path="/service-client" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <CustomerServicePage />
            </Suspense>
          } 
        />

        {/* Pages d'authentification */}
        <Route 
          path="/login" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PageDataLoader
                fetchFunction={loadPageData}
                onSuccess={handleDataSuccess}
                onMaxRetriesReached={handleMaxRetriesReached}
                loadingMessage="Chargement de la connexion..."
                loadingSubmessage="Préparation de votre espace..."
                errorMessage="Erreur de chargement"
              >
                <LoginPage />
              </PageDataLoader>
            </Suspense>
          } 
        />

        <Route 
          path="/register" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <RegistrationChecker>
                <PageDataLoader
                  fetchFunction={loadPageData}
                  onSuccess={handleDataSuccess}
                  onMaxRetriesReached={handleMaxRetriesReached}
                  loadingMessage="Chargement de l'inscription..."
                  loadingSubmessage="Préparation de votre compte..."
                  errorMessage="Erreur de chargement"
                >
                  <RegisterPage />
                </PageDataLoader>
              </RegistrationChecker>
            </Suspense>
          } 
        />

        <Route 
          path="/forgot-password" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PageDataLoader
                fetchFunction={loadPageData}
                onSuccess={handleDataSuccess}
                onMaxRetriesReached={handleMaxRetriesReached}
                loadingMessage="Chargement..."
                loadingSubmessage="Préparation de la récupération..."
                errorMessage="Erreur de chargement"
              >
                <ForgotPasswordPage />
              </PageDataLoader>
            </Suspense>
          } 
        />

        <Route 
          path="/reset-password" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PageDataLoader
                fetchFunction={loadPageData}
                onSuccess={handleDataSuccess}
                onMaxRetriesReached={handleMaxRetriesReached}
                loadingMessage="Chargement..."
                loadingSubmessage="Préparation de la réinitialisation..."
                errorMessage="Erreur de chargement"
              >
                <ResetPasswordPage />
              </PageDataLoader>
            </Suspense>
          } 
        />

        {/* Routes administrateur */}
        <Route 
          path="/admin/dashboard" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PageDataLoader
                fetchFunction={loadPageData}
                onSuccess={handleDataSuccess}
                onMaxRetriesReached={handleMaxRetriesReached}
                loadingMessage="Chargement du tableau de bord..."
                loadingSubmessage="Préparation des statistiques..."
                errorMessage="Erreur de chargement du dashboard"
              >
                <AdminDashboard />
              </PageDataLoader>
            </Suspense>
          } 
        />

        <Route 
          path="/admin/products" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PageDataLoader
                fetchFunction={loadPageData}
                onSuccess={handleDataSuccess}
                onMaxRetriesReached={handleMaxRetriesReached}
                loadingMessage="Chargement des produits admin..."
                loadingSubmessage="Préparation de la gestion..."
                errorMessage="Erreur de chargement des produits"
              >
                <AdminProducts />
              </PageDataLoader>
            </Suspense>
          } 
        />

        <Route 
          path="/admin/categories" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PageDataLoader
                fetchFunction={loadPageData}
                onSuccess={handleDataSuccess}
                onMaxRetriesReached={handleMaxRetriesReached}
                loadingMessage="Chargement des catégories admin..."
                loadingSubmessage="Préparation de la gestion..."
                errorMessage="Erreur de chargement des catégories"
              >
                <AdminCategories />
              </PageDataLoader>
            </Suspense>
          } 
        />

        <Route 
          path="/admin/orders" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PageDataLoader
                fetchFunction={loadPageData}
                onSuccess={handleDataSuccess}
                onMaxRetriesReached={handleMaxRetriesReached}
                loadingMessage="Chargement des commandes admin..."
                loadingSubmessage="Préparation de la gestion..."
                errorMessage="Erreur de chargement des commandes"
              >
                <AdminOrders />
              </PageDataLoader>
            </Suspense>
          } 
        />

        <Route 
          path="/admin/users" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PageDataLoader
                fetchFunction={loadPageData}
                onSuccess={handleDataSuccess}
                onMaxRetriesReached={handleMaxRetriesReached}
                loadingMessage="Chargement des utilisateurs admin..."
                loadingSubmessage="Préparation de la gestion..."
                errorMessage="Erreur de chargement des utilisateurs"
              >
                <AdminUsers />
              </PageDataLoader>
            </Suspense>
          } 
        />

        <Route 
          path="/admin/settings" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PageDataLoader
                fetchFunction={loadPageData}
                onSuccess={handleDataSuccess}
                onMaxRetriesReached={handleMaxRetriesReached}
                loadingMessage="Chargement des paramètres admin..."
                loadingSubmessage="Préparation de la configuration..."
                errorMessage="Erreur de chargement des paramètres"
              >
                <AdminSettings />
              </PageDataLoader>
            </Suspense>
          } 
        />

        <Route 
          path="/admin/promo-codes" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PageDataLoader
                fetchFunction={loadPageData}
                onSuccess={handleDataSuccess}
                onMaxRetriesReached={handleMaxRetriesReached}
                loadingMessage="Chargement des codes promo admin..."
                loadingSubmessage="Préparation de la gestion..."
                errorMessage="Erreur de chargement des codes promo"
              >
                <AdminPromoCodes />
              </PageDataLoader>
            </Suspense>
          } 
        />

        <Route 
          path="/admin/flash-sales" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PageDataLoader
                fetchFunction={loadPageData}
                onSuccess={handleDataSuccess}
                onMaxRetriesReached={handleMaxRetriesReached}
                loadingMessage="Chargement des ventes flash admin..."
                loadingSubmessage="Préparation de la gestion..."
                errorMessage="Erreur de chargement des ventes flash"
              >
                <AdminFlashSales />
              </PageDataLoader>
            </Suspense>
          } 
        />

        {/* Confirmation de commande sécurisée */}
        <Route 
          path="/:secureId" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <SecureRoute>
                <PageDataLoader
                  fetchFunction={loadPageData}
                  onSuccess={handleDataSuccess}
                  onMaxRetriesReached={handleMaxRetriesReached}
                  loadingMessage="Chargement sécurisé..."
                  loadingSubmessage="Vérification des accès..."
                  errorMessage="Erreur de chargement sécurisé"
                >
                  <OrderConfirmationPage />
                </PageDataLoader>
              </SecureRoute>
            </Suspense>
          } 
        />

        {/* Pages d'erreur */}
        <Route 
          path="/register-blocked" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <RegisterBlockPage />
            </Suspense>
          } 
        />

        <Route 
          path="/not-found" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <NotFound />
            </Suspense>
          } 
        />

        <Route 
          path="*" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <NotFound />
            </Suspense>
          } 
        />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default AppRoutes;
