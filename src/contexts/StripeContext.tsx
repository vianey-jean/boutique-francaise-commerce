
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface StripeContextType {
  stripe: any;
  isLoaded: boolean;
}

const StripeContext = createContext<StripeContextType | undefined>(undefined);

export const StripeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkStripeLoaded = async () => {
      try {
        const stripe = await stripePromise;
        if (stripe) {
          setIsLoaded(true);
          console.log('Stripe.js chargé avec succès');
        }
      } catch (error) {
        console.error('Erreur lors du chargement de Stripe.js:', error);
      }
    };

    checkStripeLoaded();
  }, []);

  return (
    <Elements stripe={stripePromise}>
      <StripeContext.Provider value={{ stripe: stripePromise, isLoaded }}>
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
