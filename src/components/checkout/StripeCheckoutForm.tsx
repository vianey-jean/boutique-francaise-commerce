
import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard, Lock, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/sonner';
import { stripeAPI } from '@/services/stripeAPI';
import { useStripe as useStripeContext } from '@/contexts/StripeContext';

interface StripeCheckoutFormProps {
  orderData: {
    items: any[];
    shippingAddress: any;
    deliveryPrice: number;
    totalAmount: number;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

const StripeCheckoutForm: React.FC<StripeCheckoutFormProps> = ({
  orderData,
  onSuccess,
  onCancel
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { isLoaded, error } = useStripeContext();
  const [processing, setProcessing] = useState(false);
  const [saveCard, setSaveCard] = useState(false);

  // Si Stripe n'est pas encore chargé, afficher un état de chargement
  if (!isLoaded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-lg mx-auto shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du système de paiement sécurisé...</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Si erreur de chargement Stripe
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-lg mx-auto shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="text-center py-8">
            <p className="text-red-600 mb-4">Erreur de chargement du système de paiement</p>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={onCancel} variant="outline">
              Retour
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error('Stripe n\'est pas encore chargé. Veuillez patienter.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error('Élément de carte non trouvé');
      return;
    }

    setProcessing(true);

    try {
      console.log('Création de la session de checkout...');
      
      // Créer une session de checkout
      const response = await stripeAPI.createCheckoutSession({
        ...orderData,
        saveCard
      });

      console.log('Réponse de la session:', response.data);

      if (response.data.url) {
        // Rediriger vers Stripe Checkout
        console.log('Redirection vers Stripe Checkout:', response.data.url);
        window.location.href = response.data.url;
      } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (error: any) {
      console.error('Erreur lors du paiement:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de l\'initialisation du paiement';
      toast.error(errorMessage);
    } finally {
      setProcessing(false);
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
        fontFamily: 'system-ui, -apple-system, sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-lg mx-auto shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CreditCard className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Paiement sécurisé
          </CardTitle>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-2">
            <Shield className="h-4 w-4" />
            <span>Protégé par Stripe et 3D Secure</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Résumé de la commande */}
            <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">Récapitulatif</h3>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Sous-total</span>
                <span>{(orderData.totalAmount - orderData.deliveryPrice).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Livraison</span>
                <span>{orderData.deliveryPrice.toFixed(2)} €</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total TTC</span>
                  <span className="text-green-600">{orderData.totalAmount.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            {/* Élément carte Stripe */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Informations de carte
              </label>
              <div className="p-4 border border-gray-300 rounded-xl bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                <CardElement options={cardElementOptions} />
              </div>
            </div>

            {/* Option d'enregistrement */}
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <Checkbox
                id="save-card"
                checked={saveCard}
                onCheckedChange={(checked) => setSaveCard(checked === true)}
                className="border-blue-300"
              />
              <label htmlFor="save-card" className="text-sm text-blue-800 cursor-pointer">
                Enregistrer cette carte pour les prochains achats (max 6 cartes)
              </label>
            </div>

            {/* Informations de sécurité */}
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
              <Lock className="h-5 w-5 text-green-600" />
              <div className="text-sm text-green-800">
                <p className="font-medium">Paiement 100% sécurisé</p>
                <p>Cryptage SSL 256 bits • 3D Secure • PCI DSS</p>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 h-12 border-2 border-gray-300 hover:border-gray-400"
                disabled={processing}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={!stripe || processing}
                className="flex-1 h-12 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-600 hover:via-blue-600 hover:to-purple-600 text-white shadow-xl"
              >
                {processing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Traitement...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Payer {orderData.totalAmount.toFixed(2)} €
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StripeCheckoutForm;
