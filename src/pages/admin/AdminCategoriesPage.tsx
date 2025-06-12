
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import PageDataLoader from '@/components/layout/PageDataLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FolderPlus } from 'lucide-react';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);

  const loadAdminCategoriesData = async () => {
    // Simuler le chargement des données admin catégories
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { categories: [] };
  };

  const handleDataSuccess = (data: any) => {
    setCategories(data.categories);
    setDataLoaded(true);
  };

  const handleMaxRetriesReached = () => {
    setDataLoaded(true);
  };

  return (
    <Layout>
      <PageDataLoader
        fetchFunction={loadAdminCategoriesData}
        onSuccess={handleDataSuccess}
        onMaxRetriesReached={handleMaxRetriesReached}
        loadingMessage="Chargement de l'administration des catégories..."
        loadingSubmessage="Préparation de la gestion des catégories..."
        errorMessage="Erreur de chargement de l'administration"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Gestion des Catégories</h1>
            <Button className="flex items-center gap-2">
              <FolderPlus className="h-4 w-4" />
              Ajouter une catégorie
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher une catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-center py-8">
              Interface d'administration des catégories en cours de développement
            </p>
          </div>
        </div>
      </PageDataLoader>
    </Layout>
  );
};

export default AdminCategoriesPage;
