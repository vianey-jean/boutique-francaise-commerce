
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, ExternalLink } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface StripeCheckoutProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ amount, onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleCheckout = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stripe-payments/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convertir en centimes
          currency: 'eur'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création de la session de paiement');
      }

      const data = await response.json();
      
      if (data.success && data.url) {
        // Rediriger vers Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (err) {
      console.error('Erreur checkout:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du paiement';
      setError(errorMessage);
      toast.error('Erreur lors du paiement: ' + errorMessage);
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Paiement sécurisé
        </CardTitle>
        <p className="text-sm text-gray-600">
          Vous serez redirigé vers Stripe pour finaliser votre paiement en toute sécurité
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <span className="text-sm text-blue-800">Montant à payer</span>
          <span className="font-semibold text-lg">
            {amount.toFixed(2)}€
          </span>
        </div>

        <Button
          onClick={handleCheckout}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Redirection en cours...
            </>
          ) : (
            <>
              <ExternalLink className="h-4 w-4 mr-2" />
              Procéder au paiement - {amount.toFixed(2)}€
            </>
          )}
        </Button>

        <div className="text-xs text-gray-500 text-center">
          Paiement sécurisé par Stripe • SSL 256-bit • Données protégées
        </div>
      </CardContent>
    </Card>
  );
};

export default StripeCheckout;
