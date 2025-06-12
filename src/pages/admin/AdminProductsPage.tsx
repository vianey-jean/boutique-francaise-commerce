
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import PageDataLoader from '@/components/layout/PageDataLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);

  const loadAdminProductsData = async () => {
    // Simuler le chargement des données admin produits
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Ici on chargerait les produits depuis l'API
    return { products: [] };
  };

  const handleDataSuccess = (data: any) => {
    setProducts(data.products);
    setDataLoaded(true);
  };

  const handleMaxRetriesReached = () => {
    setDataLoaded(true);
  };

  return (
    <Layout>
      <PageDataLoader
        fetchFunction={loadAdminProductsData}
        onSuccess={handleDataSuccess}
        onMaxRetriesReached={handleMaxRetriesReached}
        loadingMessage="Chargement de l'administration des produits..."
        loadingSubmessage="Préparation de votre interface de gestion..."
        errorMessage="Erreur de chargement de l'administration"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Gestion des Produits</h1>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un produit
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-center py-8">
              Interface d'administration des produits en cours de développement
            </p>
          </div>
        </div>
      </PageDataLoader>
    </Layout>
  );
};

export default AdminProductsPage;
