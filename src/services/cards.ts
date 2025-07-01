
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface SavedCard {
  id: string;
  maskedNumber: string;
  cardType: 'visa' | 'mastercard' | 'american-express' | 'other';
  cardName: string;
  expiryDate: string;
  isDefault: boolean;
  createdAt: string;
}

export interface CardData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

class CardsAPI {
  createPaymentIntent(p0: { cardId: string; }): { clientSecret: any; } | PromiseLike<{ clientSecret: any; }> {
    throw new Error('Method not implemented.');
  }
  
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async getUserCards(): Promise<SavedCard[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/cards`, {
        headers: this.getAuthHeaders()
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des cartes:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new Error('Session expirée, veuillez vous reconnecter');
      }
      return [];
    }
  }

  async getCard(cardId: string): Promise<CardData & { id: string; cardType: string; isDefault: boolean }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/cards/${cardId}`, {
        headers: this.getAuthHeaders()
      });
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la carte:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new Error('Session expirée, veuillez vous reconnecter');
      }
      throw error;
    }
  }

  async addCard(cardData: CardData, setAsDefault: boolean = false): Promise<string> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/cards`, {
        ...cardData,
        setAsDefault
      }, {
        headers: this.getAuthHeaders()
      });
      return response.data.cardId;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la carte:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new Error('Session expirée, veuillez vous reconnecter');
      }
      throw error;
    }
  }

  async setDefaultCard(cardId: string): Promise<void> {
    try {
      await axios.put(`${API_BASE_URL}/api/cards/${cardId}/default`, {}, {
        headers: this.getAuthHeaders()
      });
    } catch (error) {
      console.error('Erreur lors de la définition de la carte par défaut:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new Error('Session expirée, veuillez vous reconnecter');
      }
      throw error;
    }
  }

  async deleteCard(cardId: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/api/cards/${cardId}`, {
        headers: this.getAuthHeaders()
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de la carte:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new Error('Session expirée, veuillez vous reconnecter');
      }
      throw error;
    }
  }
}

export const cardsAPI = new CardsAPI();
