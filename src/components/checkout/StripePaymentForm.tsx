
import React, { useState } from 'react';
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const handleStripePayment = async () => {
    setIsProcessing(true);
    setError('');

    try {
      console.log('Création de la session de checkout pour le montant:', amount);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stripe/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convertir en centimes
          currency: 'eur'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur de création de session:', errorData);
        throw new Error(errorData.message || 'Erreur lors de la création de la session de paiement');
      }

      const data = await response.json();
      console.log('Session créée avec succès:', data);

      if (data.success && data.url) {
        // Rediriger vers Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('URL de session invalide');
      }
    } catch (err) {
      console.error('Erreur Stripe:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du paiement';
      setError(errorMessage);
      toast.error('Erreur lors du paiement: ' + errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Paiement sécurisé
        </CardTitle>
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

        <Button
          onClick={handleStripePayment}
          disabled={isProcessing}
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Redirection vers Stripe...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Payer {amount.toFixed(2)}€
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default StripePaymentForm;
