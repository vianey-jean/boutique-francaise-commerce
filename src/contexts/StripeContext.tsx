
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

let stripePromise: Promise<any> | null = null;

const getStripePromise = () => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.error('VITE_STRIPE_PUBLISHABLE_KEY manquante dans les variables d\'environnement');
      return null;
    }
    console.log('Initialisation de Stripe avec la clé:', publishableKey.substring(0, 20) + '...');
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

interface StripeContextType {
  stripe: any;
  isLoaded: boolean;
  error: string | null;
}

const StripeContext = createContext<StripeContextType | undefined>(undefined);

export const StripeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stripeInstance, setStripeInstance] = useState<any>(null);

  useEffect(() => {
    const checkStripeLoaded = async () => {
      try {
        const stripePromise = getStripePromise();
        if (!stripePromise) {
          setError('Configuration Stripe manquante - vérifiez VITE_STRIPE_PUBLISHABLE_KEY');
          setIsLoaded(false);
          return;
        }

        console.log('Chargement de Stripe.js...');
        const stripe = await stripePromise;
        
        if (stripe) {
          setStripeInstance(stripe);
          setIsLoaded(true);
          setError(null);
          console.log('Stripe.js chargé avec succès');
        } else {
          setError('Impossible de charger Stripe.js - vérifiez votre clé publique');
          setIsLoaded(false);
        }
      } catch (error: any) {
        console.error('Erreur lors du chargement de Stripe.js:', error);
        setError(`Erreur de chargement Stripe.js: ${error.message}`);
        setIsLoaded(false);
      }
    };

    checkStripeLoaded();
  }, []);

  if (error) {
    return (
      <StripeContext.Provider value={{ stripe: null, isLoaded: false, error }}>
        {children}
      </StripeContext.Provider>
    );
  }

  if (!isLoaded || !stripeInstance) {
    return (
      <StripeContext.Provider value={{ stripe: null, isLoaded: false, error: null }}>
        {children}
      </StripeContext.Provider>
    );
  }

  return (
    <Elements stripe={stripeInstance}>
      <StripeContext.Provider value={{ stripe: stripeInstance, isLoaded, error: null }}>
        {children}
      </StripeContext.Provider>
    </Elements>
  );
};

export const useStripe = () => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
};
