
import { useState, useEffect } from 'react';
import { stripeAPI, SavedCard } from '@/services/stripeAPI';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useSavedCards = () => {
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadSavedCards = async () => {
    // Si l'utilisateur n'est pas connecté, ne pas charger les cartes
    if (!user) {
      setCards([]);
      setLoading(false);
      return;
    }

    try {
      const response = await stripeAPI.getSavedCards();
      setCards(response.data.cards);
    } catch (error: any) {
      console.error('Erreur chargement cartes:', error);
      
      // Si erreur 403, l'utilisateur n'est pas authentifié
      if (error.response?.status === 403) {
        console.log('Utilisateur non authentifié - pas de cartes sauvegardées');
        setCards([]);
      } else {
        toast.error('Erreur lors du chargement des cartes sauvegardées');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteCard = async (cardId: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour supprimer une carte');
      return;
    }

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
  }, [user]); // Recharger quand l'utilisateur change

  return {
    cards,
    loading,
    loadSavedCards,
    deleteCard
  };
};
