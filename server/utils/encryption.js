const crypto = require('crypto');

class EncryptionService {
  constructor() {
    this.algorithm = process.env.CRYPTO_ALGORITHM || 'aes-256-gcm';
    this.secretKey = process.env.ENCRYPTION_KEY || 'K8#mP2$wQ9@nF5*vL7&xR3!zT6%yU4^jH1+cG0-bN9~aE8';
    this.key = crypto.scryptSync(this.secretKey, 'salt', 32);
  }

  encrypt(text) {
    if (!text || typeof text !== 'string') {
      return text;
    }

    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipher(this.algorithm, this.key);
      cipher.setAAD(Buffer.from('gestion-vente', 'utf8'));
      
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      
      return {
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
      };
    } catch (error) {
      console.error('Encryption error:', error);
      return text; // Fallback to original text
    }
  }

  decrypt(encryptedData) {
    if (!encryptedData || typeof encryptedData === 'string') {
      return encryptedData;
    }

    try {
      const { encrypted, iv, authTag } = encryptedData;
      const decipher = crypto.createDecipher(this.algorithm, this.key);
      decipher.setAAD(Buffer.from('gestion-vente', 'utf8'));
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      return encryptedData; // Fallback to original data
    }
  }

  encryptObject(obj) {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    const encryptedObj = {};
    for (const [key, value] of Object.entries(obj)) {
      if (this.shouldEncryptField(key)) {
        encryptedObj[key] = this.encrypt(String(value));
      } else {
        encryptedObj[key] = value;
      }
    }
    return encryptedObj;
  }

  decryptObject(obj) {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    const decryptedObj = {};
    for (const [key, value] of Object.entries(obj)) {
      if (this.shouldEncryptField(key)) {
        decryptedObj[key] = this.decrypt(value);
      } else {
        decryptedObj[key] = value;
      }
    }
    return decryptedObj;
  }

  shouldEncryptField(fieldName) {
    const fieldsToEncrypt = [
      'nom', 'firstName', 'lastName', 'email', 'phone', 'adresse', 'address',
      'description', 'prix', 'prixAchat', 'prixVente', 'price', 'quantity', 'quantite',
      'client', 'product', 'productName', 'clientName', 'notes'
    ];
    return fieldsToEncrypt.includes(fieldName);
  }

  encryptPassword(password) {
    const bcrypt = require('bcryptjs');
    const salt = bcrypt.genSaltSync(12);
    return bcrypt.hashSync(password, salt);
  }

  comparePassword(password, hashedPassword) {
    const bcrypt = require('bcryptjs');
    return bcrypt.compareSync(password, hashedPassword);
  }
}

module.exports = new EncryptionService();