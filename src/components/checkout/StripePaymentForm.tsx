
import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, Shield } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface StripePaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [paymentIntent, setPaymentIntent] = useState<string>('');

  // Créer un PaymentIntent au chargement du composant
  React.useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stripe-payments/create-payment-intent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(authToken && { 'Authorization': `Bearer ${authToken}` })
          },
          body: JSON.stringify({
            amount: Math.round(amount * 100), // Convertir en centimes
            currency: 'eur'
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erreur lors de la création du paiement');
        }

        const data = await response.json();
        setPaymentIntent(data.clientSecret);
      } catch (err) {
        console.error('Erreur création PaymentIntent:', err);
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création du paiement';
        setError(errorMessage);
        onError(errorMessage);
      }
    };

    createPaymentIntent();
  }, [amount, onError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message);
      }

      const { error: confirmError, paymentIntent: confirmedPayment } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required'
      });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (confirmedPayment && confirmedPayment.status === 'succeeded') {
        toast.success('Paiement effectué avec succès !');
        onSuccess();
      }
    } catch (err) {
      console.error('Erreur paiement:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du paiement';
      setError(errorMessage);
      toast.error('Erreur lors du paiement: ' + errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!paymentIntent) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-6">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Chargement du système de paiement sécurisé...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Informations de carte bancaire
        </CardTitle>
        <p className="text-sm text-gray-600">
          Saisissez votre numéro de carte, date d'expiration, CVC et code postal
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-blue-800">Paiement sécurisé avec Stripe</span>
          </div>
          <span className="font-semibold text-lg">
            {amount.toFixed(2)}€
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <PaymentElement 
            options={{
              layout: 'tabs'
            }}
          />
          
          <Button
            type="submit"
            disabled={!stripe || isProcessing}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Payer {amount.toFixed(2)}€
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StripePaymentForm;
