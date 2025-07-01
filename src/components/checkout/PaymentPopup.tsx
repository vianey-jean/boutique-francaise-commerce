
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, Shield, X } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';

// Vérifier que la clé publique Stripe est définie
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
console.log('Stripe Public Key available:', !!stripePublicKey);

const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

interface PaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number; // Montant total TTC en euros
  onSuccess: () => void;
}

const PaymentForm: React.FC<{
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
  onClose: () => void;
}> = ({ amount, onSuccess, onError, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();
  const { clearSelectedItems } = useStore();

  // Vérifier si Stripe est prêt
  useEffect(() => {
    console.log('Stripe ready check:', { stripe: !!stripe, elements: !!elements });
    if (stripe && elements) {
      setIsReady(true);
      console.log('Stripe is ready!');
    }
  }, [stripe, elements]);

  // Vérifier la configuration au montage
  useEffect(() => {
    if (!stripePublicKey) {
      setError('Configuration Stripe manquante. Veuillez vérifier votre clé publique Stripe.');
      console.error('VITE_STRIPE_PUBLISHABLE_KEY is not defined');
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe n\'est pas encore chargé. Veuillez patienter...');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Élément de carte non trouvé');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      console.log('Starting payment process for amount:', amount);

      // Vérifier d'abord si la carte est valide
      const { error: cardError } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (cardError) {
        console.error('Card validation error:', cardError);
        setError(cardError.message || 'Informations de carte invalides');
        setIsProcessing(false);
        return;
      }

      console.log('Card validation successful');

      // Créer un PaymentIntent avec le montant total TTC
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stripe-payments/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convertir le montant TTC en centimes
          currency: 'eur'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Payment intent creation failed:', errorData);
        throw new Error(errorData.message || 'Erreur lors de la création du paiement');
      }

      const { clientSecret } = await response.json();
      console.log('Payment intent created successfully');

      if (!clientSecret) {
        throw new Error('Impossible de créer l\'intention de paiement');
      }

      // Confirmer le paiement avec 3D Secure intégré
      console.log('Confirming payment with 3D Secure...');
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (stripeError) {
        console.error('Payment confirmation error:', stripeError);
        setError(stripeError.message || 'Erreur lors du paiement');
        onError(stripeError.message || 'Erreur lors du paiement');
      } else if (paymentIntent?.status === 'succeeded') {
        console.log('Payment succeeded!');
        // Paiement réussi
        toast.success('Votre paiement a été validé !');
        
        // Supprimer les produits du panier
        clearSelectedItems();
        
        // Fermer la popup et rediriger
        onClose();
        navigate('/commandes');
        onSuccess();
      } else {
        console.log('Payment status:', paymentIntent?.status);
        setError('Le paiement n\'a pas pu être traité');
        onError('Le paiement n\'a pas pu être traité');
      }
    } catch (err) {
      console.error('Payment error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du paiement';
      setError(errorMessage);
      toast.error('Le paiement a été refusé');
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!stripePublicKey) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Configuration Stripe manquante. Veuillez vérifier la configuration de votre clé publique Stripe.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Informations de carte bancaire
          </label>
          <div className="p-4 border rounded-lg bg-white min-h-[50px] flex items-center">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
                hidePostalCode: false,
              }}
            />
          </div>
          <p className="text-xs text-gray-500">
            Saisissez votre numéro de carte, date d'expiration, CVC et code postal
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isReady && !error && (
          <Alert>
            <AlertDescription>
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Chargement du système de paiement sécurisé...
              </div>
            </AlertDescription>
          </Alert>
        )}

        {isReady && (
          <Alert>
            <AlertDescription className="text-green-700">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-green-600" />
                Système de paiement prêt - Vous pouvez saisir vos informations de carte
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-blue-800">Paiement sécurisé avec 3D Secure</span>
        </div>
        <span className="font-semibold text-lg text-green-600">
          {amount.toFixed(2)}€ TTC
        </span>
      </div>

      <div className="flex gap-3">
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
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Traitement en cours...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Payer {amount.toFixed(2)}€ TTC
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

const PaymentPopup: React.FC<PaymentPopupProps> = ({ isOpen, onClose, amount, onSuccess }) => {
  const [error, setError] = useState<string>('');

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  if (!stripePromise) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Erreur de configuration</DialogTitle>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertDescription>
              La clé publique Stripe n'est pas configurée. Veuillez vérifier votre configuration.
            </AlertDescription>
          </Alert>
          <Button onClick={handleClose} className="mt-4">Fermer</Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Paiement sécurisé
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <Elements stripe={stripePromise}>
          <PaymentForm 
            amount={amount}
            onSuccess={onSuccess}
            onError={handleError}
            onClose={handleClose}
          />
        </Elements>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentPopup;
