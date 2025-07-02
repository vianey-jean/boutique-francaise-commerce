
import { useState, useEffect } from 'react';
import { stripeAPI, SavedCard } from '@/services/stripeAPI';
import { toast } from '@/components/ui/sonner';

export const useSavedCards = () => {
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSavedCards = async () => {
    try {
      const response = await stripeAPI.getSavedCards();
      setCards(response.data.cards);
    } catch (error) {
      console.error('Erreur chargement cartes:', error);
      toast.error('Erreur lors du chargement des cartes sauvegardées');
    } finally {
      setLoading(false);
    }
  };

  const deleteCard = async (cardId: string) => {
    try {
      await stripeAPI.deleteSavedCard(cardId);
      setCards(cards.filter(card => card.id !== cardId));
      toast.success('Carte supprimée avec succès');
    } catch (error) {
      console.error('Erreur suppression carte:', error);
      toast.error('Erreur lors de la suppression de la carte');
    }
  };

  useEffect(() => {
    loadSavedCards();
  }, []);

  return {
    cards,
    loading,
    loadSavedCards,
    deleteCard
  };
};
