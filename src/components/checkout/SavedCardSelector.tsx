
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/sonner';
import { stripeAPI } from '@/services/stripeAPI';
import { useSavedCards } from '@/hooks/useSavedCards';
import SavedCardItem from './SavedCardItem';
import EmptyCardsState from './EmptyCardsState';

interface SavedCardSelectorProps {
  onSelectCard: (cardId: string) => void;
  onAddNewCard: () => void;
  orderData: any;
}

const SavedCardSelector: React.FC<SavedCardSelectorProps> = ({
  onSelectCard,
  onAddNewCard,
  orderData
}) => {
  const { cards, loading, deleteCard } = useSavedCards();
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [processing, setProcessing] = useState(false);

  React.useEffect(() => {
    if (cards.length > 0 && !selectedCard) {
      setSelectedCard(cards[0].id);
    }
  }, [cards, selectedCard]);

  const handlePayWithSelectedCard = async () => {
    if (!selectedCard) {
      toast.error('Veuillez sélectionner une carte');
      return;
    }

    setProcessing(true);
    try {
      const response = await stripeAPI.payWithSavedCard(selectedCard, orderData);
      
      if (response.data.requires_action) {
        window.location.href = response.data.client_secret;
      } else if (response.data.success) {
        onSelectCard(selectedCard);
        toast.success('Paiement effectué avec succès');
      } else {
        toast.error('Échec du paiement');
      }
    } catch (error) {
      console.error('Erreur paiement:', error);
      toast.error('Erreur lors du paiement');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Cartes enregistrées ({cards.length}/6)
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {cards.length === 0 ? (
            <EmptyCardsState onAddNewCard={onAddNewCard} />
          ) : (
            <>
              <div className="space-y-3">
                {cards.map((card) => (
                  <SavedCardItem
                    key={card.id}
                    card={card}
                    isSelected={selectedCard === card.id}
                    onSelect={() => setSelectedCard(card.id)}
                    onDelete={() => deleteCard(card.id)}
                  />
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={onAddNewCard}
                  className="flex-1 border-2 border-gray-300 hover:border-gray-400"
                  disabled={cards.length >= 6}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {cards.length >= 6 ? 'Limite atteinte' : 'Nouvelle carte'}
                </Button>
                <Button
                  onClick={handlePayWithSelectedCard}
                  disabled={!selectedCard || processing}
                  className="flex-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  {processing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Traitement...
                    </div>
                  ) : (
                    `Payer ${orderData.totalAmount.toFixed(2)} €`
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SavedCardSelector;
