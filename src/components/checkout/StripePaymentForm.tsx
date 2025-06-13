
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { CreditCard, Shield } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

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
      // Initialiser Supabase client
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL || '',
        import.meta.env.VITE_SUPABASE_ANON_KEY || ''
      );

      toast.info("Création de la session de paiement Stripe...");
      
      // Appeler la fonction edge pour créer la session Stripe
      const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
        body: {
          amount: Math.round(amount * 100), // Convertir en centimes
          currency: 'eur'
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data?.url) {
        throw new Error('URL de paiement non reçue');
      }

      toast.success("Redirection vers Stripe Checkout...");
      
      // Rediriger vers Stripe Checkout
      window.location.href = data.url;
      
    } catch (error) {
      console.error('Erreur Stripe:', error);
      setLoading(false);
      toast.error(error instanceof Error ? error.message : "Erreur lors de la création de la session de paiement Stripe");
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
          <li>• Redirection vers Stripe.com</li>
          <li>• Validation automatique du paiement</li>
        </ul>
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h4 className="font-semibold text-green-800 mb-2">Processus de paiement :</h4>
        <ol className="text-sm text-green-700 space-y-1">
          <li>1. Redirection vers Stripe.com</li>
          <li>2. Saisie sécurisée des informations bancaires</li>
          <li>3. Validation par Stripe</li>
          <li>4. Retour automatique sur notre site</li>
          <li>5. Confirmation de la commande</li>
        </ol>
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
              Redirection en cours...
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

      <div className="text-xs text-gray-500 text-center">
        <p>🔒 Vos données bancaires sont traitées directement par Stripe</p>
        <p>Elles ne transitent jamais par nos serveurs</p>
      </div>
    </div>
  );
};

export default StripePaymentForm;
