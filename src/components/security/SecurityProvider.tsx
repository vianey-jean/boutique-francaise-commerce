import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import encryptionService from '@/utils/encryption';

interface SecurityContextType {
  isSecure: boolean;
  securityLevel: 'low' | 'medium' | 'high';
  validateInput: (input: string, type: 'email' | 'phone' | 'text' | 'number') => boolean;
  sanitizeInput: (input: string) => string;
  checkSuspiciousActivity: () => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSecure, setIsSecure] = useState(true);
  const [securityLevel, setSecurityLevel] = useState<'low' | 'medium' | 'high'>('high');
  const [attempts, setAttempts] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Check for security threats on mount
    checkSecurityThreats();
    
    // Monitor for suspicious activity
    const interval = setInterval(checkSuspiciousActivity, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const checkSecurityThreats = () => {
    // Check for common security issues
    const threats = [];
    
    // Check if running in development mode
    if (import.meta.env.DEV) {
      threats.push('Environnement de développement détecté');
    }
    
    // Check for browser security features
    if (!window.crypto || !window.crypto.subtle) {
      threats.push('API de cryptographie non disponible');
      setSecurityLevel('low');
    }
    
    // Check for HTTPS
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      threats.push('Connexion non sécurisée (HTTP)');
      setSecurityLevel('medium');
    }
    
    if (threats.length > 0) {
      console.warn('Menaces de sécurité détectées:', threats);
    }
    
    setIsSecure(threats.length === 0);
  };

  const validateInput = (input: string, type: 'email' | 'phone' | 'text' | 'number'): boolean => {
    try {
      return encryptionService.validateInput(input, type);
    } catch (error) {
      console.error('Erreur de validation:', error);
      return false;
    }
  };

  const sanitizeInput = (input: string): string => {
    try {
      return encryptionService.sanitizeInput(input);
    } catch (error) {
      console.error('Erreur de nettoyage:', error);
      return input;
    }
  };

  const checkSuspiciousActivity = () => {
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /eval\(/gi,
      /document\.write/gi,
      /innerHTML.*<script/gi,
      /javascript:/gi,
      /onload.*=/gi,
      /onerror.*=/gi
    ];
    
    // Check local storage for suspicious content
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key) || '';
          const suspicious = suspiciousPatterns.some(pattern => pattern.test(value));
          
          if (suspicious) {
            console.warn('Contenu suspect détecté dans le stockage local:', key);
            localStorage.removeItem(key);
            toast({
              title: "Alerte de sécurité",
              description: "Contenu suspect supprimé du stockage local",
              variant: "destructive",
            });
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de sécurité:', error);
    }
    
    // Check for excessive API calls
    setAttempts(prev => {
      const newAttempts = prev + 1;
      if (newAttempts > 100) { // 100 calls in 30 seconds
        toast({
          title: "Limite de sécurité atteinte",
          description: "Trop d'activité détectée, veuillez patienter",
          variant: "destructive",
        });
        return 0;
      }
      return newAttempts;
    });
  };

  const value = {
    isSecure,
    securityLevel,
    validateInput,
    sanitizeInput,
    checkSuspiciousActivity
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};