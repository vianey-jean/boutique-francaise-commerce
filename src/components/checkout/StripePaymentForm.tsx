
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { CreditCard, Shield } from 'lucide-react';

interface StripePaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ 
  amount, 
  onSuccess, 
  onCancel 
}) => {
  const [loading, setLoading] = useState(false);

  const handleStripePayment = async () => {
    setLoading(true);
    
    try {
      // Simuler la redirection vers Stripe (en production, vous devrez intégrer l'API Stripe)
      toast.info("Redirection vers Stripe...");
      
      // Simuler l'appel API vers Stripe
      const stripeSessionUrl = `https://checkout.stripe.com/pay?amount=${amount * 100}&currency=eur`;
      
      // En production, vous devrez créer une session Stripe via votre backend
      // const response = await fetch('/api/create-stripe-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ amount, currency: 'eur' })
      // });
      // const { url } = await response.json();
      
      // Simuler un délai de traitement
      setTimeout(() => {
        setLoading(false);
        toast.success("Paiement Stripe simulé avec succès!");
        onSuccess();
      }, 2000);
      
      // En production, rediriger vers Stripe
      // window.location.href = url;
      
    } catch (error) {
      console.error('Erreur Stripe:', error);
      setLoading(false);
      toast.error("Erreur lors du paiement Stripe");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-bold mb-2">Paiement sécurisé avec Stripe</h3>
        <p className="text-gray-600">Montant à payer: <span className="font-bold text-lg">{amount.toFixed(2)}€</span></p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center mb-2">
          <Shield className="h-5 w-5 text-blue-600 mr-2" />
          <span className="font-semibold text-blue-800">Paiement 100% sécurisé</span>
        </div>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Cryptage SSL 256-bit</li>
          <li>• Conformité PCI DSS</li>
          <li>• Protection contre la fraude</li>
          <li>• Données bancaires non stockées</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handleStripePayment}
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Redirection vers Stripe...
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5 mr-2" />
              Payer avec Stripe
            </>
          )}
        </Button>
        
        <Button 
          onClick={onCancel}
          variant="outline"
          disabled={loading}
          className="sm:w-auto"
        >
          Annuler
        </Button>
      </div>
    </div>
  );
};

export default StripePaymentForm;
