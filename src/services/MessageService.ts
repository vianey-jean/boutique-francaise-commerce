export interface ContactMessage {
  id: string;
  nom: string;
  email: string;
  sujet: string;
  message: string;
  dateEnvoi: string;
  lu: boolean;
}

export class MessageService {
  private static readonly BASE_URL = 'http://localhost:3001/api';

  static async getAllMessages(): Promise<ContactMessage[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/messages`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des messages');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur MessageService.getAllMessages:', error);
      return [];
    }
  }

  static async sendContactMessage(messageData: Omit<ContactMessage, 'id' | 'dateEnvoi' | 'lu'>): Promise<boolean> {
    try {
      const response = await fetch(`${this.BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...messageData,
          dateEnvoi: new Date().toISOString(),
          lu: false
        })
      });
      return response.ok;
    } catch (error) {
      console.error('Erreur MessageService.sendContactMessage:', error);
      return false;
    }
  }

  static async markAsRead(messageId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.BASE_URL}/messages/${messageId}/mark-read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Erreur MessageService.markAsRead:', error);
      return false;
    }
  }
}