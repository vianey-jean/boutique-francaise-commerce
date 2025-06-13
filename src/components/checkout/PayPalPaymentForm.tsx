
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Shield, CheckCircle } from 'lucide-react';

interface PayPalPaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const PayPalPaymentForm: React.FC<PayPalPaymentFormProps> = ({ 
  amount, 
  onSuccess, 
  onCancel 
}) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'init' | 'processing' | 'success'>('init');

  const handlePayPalPayment = async () => {
    setLoading(true);
    setStep('processing');
    
    try {
      toast.info("Redirection vers PayPal...");
      
      // Simuler l'authentification PayPal
      setTimeout(() => {
        toast.success("Connexion PayPal réussie!");
        
        // Simuler la confirmation de paiement
        setTimeout(() => {
          setStep('success');
          setLoading(false);
          toast.success("Paiement PayPal confirmé!");
          
          setTimeout(() => {
            onSuccess();
          }, 1000);
        }, 2000);
      }, 1500);
      
    } catch (error) {
      console.error('Erreur PayPal:', error);
      setLoading(false);
      setStep('init');
      toast.error("Erreur lors du paiement PayPal");
    }
  };

  if (step === 'success') {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-green-600">Paiement PayPal réussi!</h3>
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
          src="/src/assets/paypal.png" 
          alt="PayPal" 
          className="h-12 mx-auto mb-4"
        />
        <h3 className="text-xl font-bold mb-2">Paiement avec PayPal</h3>
        <p className="text-gray-600">Montant à payer: <span className="font-bold text-lg">{amount.toFixed(2)}€</span></p>
      </div>

      {step === 'processing' && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
          <LoadingSpinner size="md" className="mx-auto mb-2" />
          <p className="text-blue-800 font-medium">Connexion à PayPal en cours...</p>
          <p className="text-blue-600 text-sm">Veuillez patienter, ne fermez pas cette fenêtre</p>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center mb-2">
          <Shield className="h-5 w-5 text-blue-600 mr-2" />
          <span className="font-semibold text-blue-800">Protection PayPal</span>
        </div>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Protection des achats PayPal</li>
          <li>• Cryptage SSL 256-bit</li>
          <li>• Aucune donnée bancaire partagée</li>
          <li>• Remboursement garanti</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handlePayPalPayment}
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Connexion PayPal...
            </>
          ) : (
            <>
              <img src="/src/assets/paypal.png" alt="" className="h-5 mr-2" />
              Payer avec PayPal
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

export default PayPalPaymentForm;
