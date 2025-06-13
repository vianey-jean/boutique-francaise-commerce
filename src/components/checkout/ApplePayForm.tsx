import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Shield, CheckCircle, Smartphone } from 'lucide-react';

interface ApplePayFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const ApplePayForm: React.FC<ApplePayFormProps> = ({ 
  amount, 
  onSuccess, 
  onCancel 
}) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'init' | 'auth' | 'processing' | 'success'>('init');

  const handleApplePayment = async () => {
    // Vérifier si Apple Pay est disponible
    if (!window.ApplePaySession || !window.ApplePaySession.canMakePayments()) {
      toast.error("Apple Pay n'est pas disponible sur cet appareil");
      return;
    }

    setLoading(true);
    setStep('auth');
    
    try {
      toast.info("Authentification Touch ID/Face ID...");
      
      // Simuler l'authentification biométrique
      setTimeout(() => {
        setStep('processing');
        toast.success("Authentification réussie!");
        
        // Simuler le traitement du paiement
        setTimeout(() => {
          setStep('success');
          setLoading(false);
          toast.success("Paiement Apple Pay confirmé!");
          
          setTimeout(() => {
            onSuccess();
          }, 1000);
        }, 2000);
      }, 1500);
      
    } catch (error) {
      console.error('Erreur Apple Pay:', error);
      setLoading(false);
      setStep('init');
      toast.error("Erreur lors du paiement Apple Pay");
    }
  };

  if (step === 'success') {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-bold">Paiement Apple Pay réussi!</h3>
        <p className="text-gray-600">Montant: {amount.toFixed(2)}€</p>
        <div className="animate-pulse text-sm text-gray-500">
          Finalisation de la commande...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <img 
          src="/src/assets/applepay.png" 
          alt="Apple Pay" 
          className="h-12 mx-auto mb-4"
        />
        <h3 className="text-xl font-bold mb-2">Paiement avec Apple Pay</h3>
        <p className="text-gray-600">Montant à payer: <span className="font-bold text-lg">{amount.toFixed(2)}€</span></p>
      </div>

      {step === 'auth' && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
          <Smartphone className="h-8 w-8 mx-auto mb-2 text-gray-600" />
          <p className="font-medium text-gray-800">Authentification biométrique</p>
          <p className="text-gray-600 text-sm">Utilisez Touch ID ou Face ID pour confirmer</p>
        </div>
      )}

      {step === 'processing' && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
          <LoadingSpinner size="md" className="mx-auto mb-2" />
          <p className="text-blue-800 font-medium">Traitement du paiement...</p>
          <p className="text-blue-600 text-sm">Sécurisation avec Secure Element</p>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center mb-2">
          <Shield className="h-5 w-5 text-gray-600 mr-2" />
          <span className="font-semibold text-gray-800">Sécurité Apple Pay</span>
        </div>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Authentification biométrique</li>
          <li>• Secure Element intégré</li>
          <li>• Aucun numéro de carte partagé</li>
          <li>• Tokenisation des données</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handleApplePayment}
          disabled={loading}
          className="flex-1 bg-black hover:bg-gray-800 text-white h-12"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              {step === 'auth' ? 'Authentification...' : 'Traitement...'}
            </>
          ) : (
            <>
              <img src="/src/assets/applepay.png" alt="" className="h-5 mr-2" />
              Payer avec Apple Pay
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

export default ApplePayForm;
