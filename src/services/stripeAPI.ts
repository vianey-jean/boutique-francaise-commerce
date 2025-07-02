import { API } from './apiConfig';

export interface SavedCard {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  isDefault: boolean;
}

export interface CheckoutSessionData {
  items: any[];
  shippingAddress: any;
  deliveryPrice?: number;
  saveCard?: boolean;
}

export const stripeAPI = {
  // Créer une session de checkout
  createCheckoutSession: (data: CheckoutSessionData) =>
    API.post('/stripe/create-checkout-session', data),

  // Vérifier le statut d'une session
  verifySession: (sessionId: string) =>
    API.get(`/stripe/verify-session/${sessionId}`),

  // Récupérer les cartes sauvegardées
  getSavedCards: () =>
    API.get<{ cards: SavedCard[] }>('/stripe/saved-cards'),

  // Payer avec une carte sauvegardée
  payWithSavedCard: (paymentMethodId: string, data: any) =>
    API.post('/stripe/pay-with-saved-card', {
      paymentMethodId,
      ...data
    }),

  // Supprimer une carte sauvegardée
  deleteSavedCard: (cardId: string) =>
    API.delete(`/stripe/saved-cards/${cardId}`),
};