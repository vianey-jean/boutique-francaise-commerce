
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Plus } from 'lucide-react';
import SavedCardSelector from './SavedCardSelector';
import StripeCheckoutForm from './StripeCheckoutForm';
import { StripeProvider } from '@/contexts/StripeContext';
import { stripeAPI } from '@/services/stripeAPI';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentMethodSelectorProps {
  onPaymentSuccess: () => void;
  orderData: {
    items: any[];
    shippingAddress: any;
    deliveryPrice: number;
    totalAmount: number;
  };
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ 
  onPaymentSuccess, 
  orderData 
}) => {
  const [activeTab, setActiveTab] = useState('new');
  const [hasSavedCards, setHasSavedCards] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Si l'utilisateur n'est pas connecté, aller directement à l'onglet nouvelle carte
    if (!user) {
      console.log('Utilisateur non connecté, redirection vers nouvelle carte');
      setActiveTab('new');
      setHasSavedCards(false);
      return;
    }

    checkSavedCards();
  }, [user]);

  const checkSavedCards = async () => {
    if (!user) {
      console.log('Pas d\'utilisateur connecté pour vérifier les cartes');
      setHasSavedCards(false);
      return;
    }

    try {
      console.log('Vérification des cartes sauvegardées pour l\'utilisateur:', user.email);
      const response = await stripeAPI.getSavedCards();
      const cardsCount = response.data.cards.length;
      console.log(`${cardsCount} cartes trouvées`);
      
      setHasSavedCards(cardsCount > 0);
      
      // Si pas de cartes sauvegardées, aller directement à l'onglet nouvelle carte
      if (cardsCount === 0) {
        setActiveTab('new');
      } else {
        setActiveTab('saved');
      }
    } catch (error: any) {
      console.log('Erreur lors de la vérification des cartes:', error);
      // Ne pas traiter l'erreur 403 comme une erreur critique
      if (error.response?.status === 403) {
        console.log('Utilisateur non authentifié pour les cartes sauvegardées');
      }
      setHasSavedCards(false);
      setActiveTab('new');
    }
  };

  const handleCardSelected = () => {
    toast.success("Paiement accepté avec la carte sauvegardée");
    onPaymentSuccess();
  };

  return (
    <StripeProvider>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-2xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="saved" disabled={!user || !hasSavedCards}>
            <CreditCard className="h-4 w-4 mr-2" />
            {user ? 'Cartes enregistrées' : 'Connexion requise'}
          </TabsTrigger>
          <TabsTrigger value="new">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle carte
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="saved">
          {user && hasSavedCards ? (
            <SavedCardSelector 
              onSelectCard={handleCardSelected}
              onAddNewCard={() => setActiveTab('new')}
              orderData={orderData}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  {!user ? 'Vous devez être connecté pour utiliser des cartes sauvegardées' : 'Aucune carte sauvegardée'}
                </p>
                <Button onClick={() => setActiveTab('new')}>
                  Payer avec une nouvelle carte
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="new">
          <StripeCheckoutForm 
            orderData={orderData}
            onSuccess={() => {
              if (user) {
                checkSavedCards();
              }
              onPaymentSuccess();
            }}
            onCancel={() => user && hasSavedCards ? setActiveTab('saved') : undefined}
          />
        </TabsContent>
      </Tabs>
    </StripeProvider>
  );
};

export default PaymentMethodSelector;
