
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import PageDataLoader from '@/components/layout/PageDataLoader';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Settings, Shield } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const loadProfileData = async () => {
    // Simuler le chargement du profil utilisateur
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { profile: user };
  };

  const handleDataSuccess = (data: any) => {
    setUserProfile(data.profile);
    setDataLoaded(true);
  };

  const handleMaxRetriesReached = () => {
    setDataLoaded(true);
  };

  return (
    <Layout>
      <PageDataLoader
        fetchFunction={loadProfileData}
        onSuccess={handleDataSuccess}
        onMaxRetriesReached={handleMaxRetriesReached}
        loadingMessage="Chargement de votre profil..."
        loadingSubmessage="Récupération de vos informations personnelles..."
        errorMessage="Erreur de chargement du profil"
      >
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-full mr-4">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                    Mon Profil
                  </h1>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Gérez vos informations personnelles et préférences
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Informations personnelles
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Nom complet</label>
                        <Input defaultValue={user?.nom || ''} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <Input defaultValue={user?.email || ''} type="email" />
                      </div>
                      <Button className="w-full">
                        Enregistrer les modifications
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Sécurité
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" className="w-full">
                        Changer le mot de passe
                      </Button>
                      <Button variant="outline" className="w-full">
                        Authentification à deux facteurs
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageDataLoader>
    </Layout>
  );
};

export default ProfilePage;
