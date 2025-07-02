
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, CreditCard, Shield, Lock } from 'lucide-react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { stripeAPI } from '@/services/stripeAPI';
import { toast } from '@/components/ui/sonner';
import { motion, AnimatePresence } from 'framer-motion';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    items: any[];
    shippingAddress: any;
    deliveryPrice: number;
    totalAmount: number;
  };
  onSuccess: () => void;
}

const PaymentForm: React.FC<{
  orderData: PaymentPopupProps['orderData'];
  onSuccess: () => void;
  onClose: () => void;
}> = ({ orderData, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Vérifier que Stripe est prêt
    if (stripe && elements) {
      setIsReady(true);
    }
  }, [stripe, elements]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements || isProcessing) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Élément de carte non trouvé');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Créer la session de checkout Stripe
      const sessionResponse = await stripeAPI.createCheckoutSession({
        items: orderData.items,
        shippingAddress: orderData.shippingAddress,
        deliveryPrice: orderData.deliveryPrice,
        saveCard: false
      });

      if (sessionResponse.data.url) {
        // Rediriger vers Stripe Checkout
        window.location.href = sessionResponse.data.url;
        return;
      }

      throw new Error('URL de paiement non reçue');

    } catch (err: any) {
      console.error('Erreur lors du paiement:', err);
      setError(err.response?.data?.error || err.message || 'Erreur lors du traitement du paiement');
      toast.error('Erreur lors du paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        backgroundColor: '#ffffff',
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg border">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Informations de carte bancaire
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Saisissez votre numéro de carte, date d'expiration, CVC et code postal
          </p>
          
          {!isReady ? (
            <div className="py-4 text-center text-gray-500">
              Chargement du système de paiement sécurisé...
            </div>
          ) : (
            <div className="p-3 bg-white border rounded">
              <CardElement options={cardElementOptions} />
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-900">
              Paiement sécurisé avec 3D Secure
            </span>
          </div>
          <div className="text-lg font-bold text-gray-900">
            {orderData.totalAmount.toFixed(2)}€ TTC
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
          disabled={isProcessing}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={!isReady || isProcessing}
          className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Traitement...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4" />
              <span>Payer</span>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
};

const PaymentPopup: React.FC<PaymentPopupProps> = ({ 
  isOpen, 
  onClose, 
  orderData, 
  onSuccess 
}) => {
  const [stripeError, setStripeError] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier que la clé publique Stripe est définie
    if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
      setStripeError('Clé publique Stripe non configurée');
      toast.error('Configuration Stripe manquante');
    }
  }, []);

  if (!isOpen) return null;

  if (stripeError) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">Erreur de configuration</CardTitle>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-red-600 mb-4">{stripeError}</p>
                <Button onClick={onClose} className="w-full">
                  Fermer
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-xl font-bold">Paiement sécurisé</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise}>
                <PaymentForm 
                  orderData={orderData}
                  onSuccess={onSuccess}
                  onClose={onClose}
                />
              </Elements>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentPopup;
