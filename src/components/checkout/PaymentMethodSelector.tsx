
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Plus } from 'lucide-react';
import SavedCardsList from './SavedCardsList';
import CreditCardForm from './CreditCardForm';
import PaymentPopup from './PaymentPopup';
import { cardsAPI } from '@/services/cards';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/contexts/StoreContext';

interface PaymentMethodSelectorProps {
  onPaymentSuccess: () => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ onPaymentSuccess }) => {
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [activeTab, setActiveTab] = useState('saved');
  const [hasSavedCards, setHasSavedCards] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const { user } = useAuth();
  const { getCartTotal } = useStore();

  useEffect(() => {
    if (user) {
      checkSavedCards();
    }
  }, [user]);

  const checkSavedCards = async () => {
    if (!user) {
      console.log('Utilisateur non connecté');
      setHasSavedCards(false);
      setActiveTab('new');
      return;
    }

    try {
      setIsLoading(true);
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
      setHasSavedCards(false);
      setActiveTab('new');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayWithSavedCard = async () => {
    if (!selectedCardId) {
      toast.error('Veuillez sélectionner une carte');
      return;
    }

    if (!user) {
      toast.error('Utilisateur non connecté');
      return;
    }

    // Ouvrir la popup de paiement pour les cartes sauvegardées
    setShowPaymentPopup(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentPopup(false);
    onPaymentSuccess();
  };

  const handlePaymentClose = () => {
    setShowPaymentPopup(false);
  };

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            Veuillez vous connecter pour continuer le paiement
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
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
              <TabsTrigger value="saved" disabled={!hasSavedCards || isLoading}>
                Cartes enregistrées
              </TabsTrigger>
              <TabsTrigger value="new">
                <Plus className="h-4 w-4 mr-1" />
                Nouvelle carte
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="saved" className="space-y-4">
              {isLoading ? (
                <div className="text-center py-4">Chargement des cartes...</div>
              ) : (
                <>
                  <SavedCardsList 
                    onCardSelect={setSelectedCardId}
                    selectedCardId={selectedCardId}
                  />
                  <Button 
                    onClick={handlePayWithSavedCard}
                    className="w-full bg-red-800 hover:bg-red-700"
                    disabled={!selectedCardId || isLoading}
                  >
                    {isLoading ? 'Traitement...' : 'Payer avec cette carte'}
                  </Button>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="new">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Ajoutez une nouvelle carte pour effectuer le paiement
                </p>
                <Button
                  onClick={() => setShowPaymentPopup(true)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payer avec une nouvelle carte
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <PaymentPopup
        isOpen={showPaymentPopup}
        onClose={handlePaymentClose}
        amount={getCartTotal()}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
};

export default PaymentMethodSelector;
