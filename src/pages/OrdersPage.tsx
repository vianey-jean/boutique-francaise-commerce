import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import PageDataLoader from '@/components/layout/PageDataLoader';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Package, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const loadOrdersData = async () => {
    // Simuler le chargement des commandes
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { orders: [] };
  };

  const handleDataSuccess = (data: any) => {
    setOrders(data.orders);
    setDataLoaded(true);
  };

  const handleMaxRetriesReached = () => {
    setDataLoaded(true);
  };

  return (
    <Layout>
      <PageDataLoader
        fetchFunction={loadOrdersData}
        onSuccess={handleDataSuccess}
        onMaxRetriesReached={handleMaxRetriesReached}
        loadingMessage="Chargement de vos commandes..."
        loadingSubmessage="Récupération de votre historique d'achats..."
        errorMessage="Erreur de chargement des commandes"
      >
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
          <div className="container mx-auto px-4 py-12">
            {!isAuthenticated ? (
              <div className="text-center py-16 px-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl shadow-sm border border-blue-200 dark:border-blue-800">
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 rounded-full mx-auto w-fit mb-4">
                    <Package className="h-12 w-12 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Connectez-vous pour voir vos commandes
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
                  Vous devez être connecté pour accéder à votre historique de commandes
                </p>
                <Button 
                  asChild 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg px-8 py-3 rounded-full"
                >
                  <Link to="/login">Se connecter</Link>
                </Button>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 px-6 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 rounded-full mx-auto w-fit mb-4">
                    <Package className="h-12 w-12 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">
                  Aucune commande trouvée
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
                  Vous n'avez pas encore passé de commande. Découvrez nos produits !
                </p>
                <Button 
                  asChild 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg px-8 py-3 rounded-full"
                >
                  <Link to="/">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Explorer nos produits
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-8">
                <h1 className="text-3xl font-bold mb-6">Mes Commandes</h1>
                {/* Ici sera affiché la liste des commandes */}
              </div>
            )}
          </div>
        </div>
      </PageDataLoader>
    </Layout>
  );
};

export default OrdersPage;
