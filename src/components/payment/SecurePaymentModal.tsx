import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Plus, Shield, Lock } from 'lucide-react';
import CreditCardForm from '@/components/checkout/CreditCardForm';
import SavedCardsList from '@/components/checkout/SavedCardsList';
import Stripe3DSValidationModal from './Stripe3DSValidationModal';
import { cardsAPI } from '@/services/cards';
import { toast } from '@/components/ui/sonner';
import { motion } from 'framer-motion';

interface SecurePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  currency?: string;
  orderData?: any;
  onPaymentSuccess: (paymentRef: string) => void;
}

const SecurePaymentModal: React.FC<SecurePaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  currency = 'EUR',
  orderData,
  onPaymentSuccess
}) => {
  const [activeTab, setActiveTab] = useState('saved');
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [cardData, setCardData] = useState<any>(null);
  const [show3DS, setShow3DS] = useState(false);
  const [hasSavedCards, setHasSavedCards] = useState(true);

  const handleCardFormSuccess = (newCardData: any) => {
    setCardData(newCardData);
    setShow3DS(true);
  };

  const handleSavedCardPayment = async () => {
    if (!selectedCardId) {
      toast.error('Veuillez sélectionner une carte');
      return;
    }

    try {
      const card = await cardsAPI.getCard(selectedCardId);
      setCardData(card);
      setShow3DS(true);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la récupération de la carte');
    }
  };

  const handle3DSSuccess = (paymentIntentId: string) => {
    setShow3DS(false);
    toast.success('Paiement validé avec succès !');
    onPaymentSuccess(paymentIntentId);
  };

  const handle3DSFailure = () => {
    setShow3DS(false);
    setCardData(null);
    setSelectedCardId('');
  };

  return (
    <>
      <Dialog open={isOpen && !show3DS} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Lock className="h-4 w-4 text-white" />
              </div>
              Paiement sécurisé
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Résumé de commande */}
            <motion.div 
              className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Résumé de votre commande
              </h3>
              <div className="flex justify-between items-center text-2xl font-bold">
                <span>Total à payer:</span>
                <span className="text-blue-600">{(amount / 100).toFixed(2)} {currency}</span>
              </div>
            </motion.div>

            {/* Méthodes de paiement */}
            <Card>
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="saved" disabled={!hasSavedCards}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Cartes enregistrées
                    </TabsTrigger>
                    <TabsTrigger value="new">
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle carte
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="saved" className="space-y-4 mt-6">
                    <SavedCardsList 
                      onCardSelect={setSelectedCardId}
                      selectedCardId={selectedCardId}
                    />
                    <Button 
                      onClick={handleSavedCardPayment}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white h-12 text-lg"
                      disabled={!selectedCardId}
                    >
                      <Shield className="h-5 w-5 mr-2" />
                      Payer avec cette carte
                    </Button>
                  </TabsContent>

                  <TabsContent value="new" className="mt-6">
                    <CreditCardForm 
                      onSuccess={() => {
                        // Simuler les données de carte pour la démo
                        const mockCardData = {
                          cardNumber: '4111111111111111',
                          cardName: 'Utilisateur Test',
                          expiryDate: '12/25',
                          cvv: '123'
                        };
                        handleCardFormSuccess(mockCardData);
                      }}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Sécurité */}
            <motion.div 
              className="bg-blue-50 border border-blue-200 rounded-lg p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 text-blue-800">
                <Shield className="h-5 w-5" />
                <span className="font-semibold">Paiement 100% sécurisé</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                Vos données sont protégées par cryptage SSL et validation 3D Secure
              </p>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de validation 3DS */}
      {show3DS && cardData && (
        <Stripe3DSValidationModal
          isOpen={show3DS}
          onClose={() => setShow3DS(false)}
          cardData={cardData}
          amount={amount}
          currency={currency}
          onSuccess={handle3DSSuccess}
          onFailure={handle3DSFailure}
        />
      )}
    </>
  );
};

export default SecurePaymentModal;