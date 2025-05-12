
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import PersonalInfoForm from '../components/profile/PersonalInfoForm';
import PasswordForm from '../components/profile/PasswordForm';
import PreferencesForm from '../components/profile/PreferencesForm';
import { useStore } from '../contexts/StoreContext';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { orders, favorites } = useStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Déconnexion réussie');
  };

  const handleDeleteAccount = async () => {
    try {
      // Implement account deletion logic here
      toast.success('Compte supprimé avec succès');
      navigate('/');
    } catch (error) {
      toast.error('Erreur lors de la suppression du compte');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mon profil</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Bienvenue, {user.prenom}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div>
                  <p className="text-gray-500">Email</p>
                  <p>{user.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Membre depuis</p>
                  <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="pt-4">
                  <Button onClick={handleLogout} variant="outline" className="w-full">
                    Se déconnecter
                  </Button>
                </div>
                <div>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        Supprimer mon compte
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Êtes-vous sûr de vouloir supprimer votre compte ?</DialogTitle>
                      </DialogHeader>
                      <p>Cette action est irréversible et supprimera toutes vos données.</p>
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Annuler
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                          Supprimer définitivement
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Activité du compte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Commandes</span>
                  <span className="font-medium">{orders?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Favoris</span>
                  <span className="font-medium">{favorites?.items?.length || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
              <TabsTrigger value="password">Mot de passe</TabsTrigger>
              <TabsTrigger value="preferences">Préférences</TabsTrigger>
            </TabsList>
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent>
                  <PersonalInfoForm />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Changer de mot de passe</CardTitle>
                </CardHeader>
                <CardContent>
                  <PasswordForm />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences</CardTitle>
                </CardHeader>
                <CardContent>
                  <PreferencesForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
