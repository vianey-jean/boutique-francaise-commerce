
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Plus } from 'lucide-react';
import SavedCardsList from './SavedCardsList';
import CreditCardForm from './CreditCardForm';
import { cardsAPI } from '@/services/cards';
import { toast } from '@/components/ui/sonner';

interface PaymentMethodSelectorProps {
  onPaymentSuccess: () => void;
  orderData?: {
    shippingAddress: any;
    cartItems: any[];
    promoDetails?: any;
    deliveryPrice: number;
    taxAmount: number;
  };
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ onPaymentSuccess, orderData }) => {
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [activeTab, setActiveTab] = useState('saved');
  const [hasSavedCards, setHasSavedCards] = useState(false);

  useEffect(() => {
    checkSavedCards();
  }, []);

  const checkSavedCards = async () => {
    try {
      const cards = await cardsAPI.getUserCards();
      setHasSavedCards(cards.length > 0);
      
      // Sélectionner automatiquement la carte par défaut
      const defaultCard = cards.find(card => card.isDefault);
      if (defaultCard) {
        setSelectedCardId(defaultCard.id);
      }
      
      // Si pas de cartes sauvegardées, aller directement à l'onglet nouvelle carte
      if (cards.length === 0) {
        setActiveTab('new');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des cartes:', error);
    }
  };

  const handlePayWithSavedCard = async () => {
    if (!selectedCardId) {
      toast.error('Veuillez sélectionner une carte');
      return;
    }

    try {
      const card = await cardsAPI.getCard(selectedCardId);
      console.log('Redirection vers Stripe pour validation du paiement...');
      
      // Sauvegarder les données de commande dans sessionStorage
      if (orderData) {
        sessionStorage.setItem('pendingOrder', JSON.stringify(orderData));
      }
      
      // Créer le payment intent et rediriger vers Stripe
      const { clientSecret } = await cardsAPI.createPaymentIntent({ cardId: selectedCardId });
      
      // Rediriger vers Stripe pour confirmation
      const returnUrl = `${window.location.origin}/payment-callback`;
      window.location.href = `https://hooks.stripe.com/redirect/authenticate/${clientSecret}?return_url=${encodeURIComponent(returnUrl)}`;
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      toast.error('Erreur lors de la préparation du paiement');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Méthode de paiement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="saved" disabled={!hasSavedCards}>
              Cartes enregistrées
            </TabsTrigger>
            <TabsTrigger value="new">
              <Plus className="h-4 w-4 mr-1" />
              Nouvelle carte
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="saved" className="space-y-4">
            <SavedCardsList 
              onCardSelect={setSelectedCardId}
              selectedCardId={selectedCardId}
            />
            <Button 
              onClick={handlePayWithSavedCard}
              className="w-full bg-red-800 hover:bg-red-700"
              disabled={!selectedCardId}
            >
              Payer avec cette carte
            </Button>
          </TabsContent>
          
          <TabsContent value="new">
            <CreditCardForm 
              onSuccess={() => {
                checkSavedCards();
                onPaymentSuccess();
              }}
              orderData={orderData}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodSelector;
