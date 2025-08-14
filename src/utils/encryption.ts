import CryptoJS from 'crypto-js';

class ClientEncryptionService {
  private secretKey: string;
  private algorithm: string = 'AES';

  constructor() {
    this.secretKey = import.meta.env.VITE_ENCRYPTION_KEY || 'K8#mP2$wQ9@nF5*vL7&xR3!zT6%yU4^jH1+cG0-bN9~aE8';
  }

  encrypt(text: string): any {
    if (!text || typeof text !== 'string') {
      return text;
    }

    try {
      const encrypted = CryptoJS.AES.encrypt(text, this.secretKey).toString();
      return {
        encrypted,
        algorithm: this.algorithm
      };
    } catch (error) {
      console.error('Client encryption error:', error);
      return text;
    }
  }

  decrypt(encryptedData: any): string {
    if (!encryptedData || typeof encryptedData === 'string') {
      return encryptedData as string;
    }

    try {
      const { encrypted } = encryptedData;
      const decrypted = CryptoJS.AES.decrypt(encrypted, this.secretKey);
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Client decryption error:', error);
      return encryptedData;
    }
  }

  decryptObject<T>(obj: any): T {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    const decryptedObj: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (this.shouldDecryptField(key)) {
        decryptedObj[key] = this.decrypt(value);
      } else {
        decryptedObj[key] = value;
      }
    }
    return decryptedObj as T;
  }

  decryptArray<T>(arr: any[]): T[] {
    return arr.map(item => this.decryptObject<T>(item));
  }

  private shouldDecryptField(fieldName: string): boolean {
    const fieldsToDecrypt = [
      'nom', 'firstName', 'lastName', 'email', 'phone', 'adresse', 'address',
      'description', 'prix', 'prixAchat', 'prixVente', 'price', 'quantity', 'quantite',
      'client', 'product', 'productName', 'clientName', 'notes'
    ];
    return fieldsToDecrypt.includes(fieldName);
  }

  sanitizeInput(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/[<>&"']/g, (match) => {
        const entityMap: Record<string, string> = {
          '<': '&lt;',
          '>': '&gt;',
          '&': '&amp;',
          '"': '&quot;',
          "'": '&#39;'
        };
        return entityMap[match];
      });
  }

  validateInput(input: string, type: 'email' | 'phone' | 'text' | 'number'): boolean {
    const patterns = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^[\+]?[0-9]{8,15}$/,
      text: /^[a-zA-ZÀ-ÿ\s\-\.]{2,100}$/,
      number: /^[0-9]+(\.[0-9]+)?$/
    };

    return patterns[type].test(input);
  }
}

export default new ClientEncryptionService();