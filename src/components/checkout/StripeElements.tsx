
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface StripeElementsProps {
  children: React.ReactNode;
  amount: number;
}

const StripeElements: React.FC<StripeElementsProps> = ({ children, amount }) => {
  const options = {
    mode: 'payment' as const,
    amount: Math.round(amount * 100), // Convertir en centimes
    currency: 'eur',
    appearance: {
      theme: 'stripe' as const,
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};

export default StripeElements;
