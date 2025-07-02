
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { stripeAPI } from '@/services/stripeAPI';
import { useStore } from '@/contexts/StoreContext';
import { toast } from '@/components/ui/sonner';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const CheckoutSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchCart } = useStore();
  const [verifying, setVerifying] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    verifyPaymentAndCreateOrder();
  }, []);

  const verifyPaymentAndCreateOrder = async () => {
    const sessionId = searchParams.get('session_id');
    
    console.log('Vérification du paiement avec session ID:', sessionId);
    
    if (!sessionId) {
      setError('Session de paiement non trouvée');
      toast.error('Session de paiement non trouvée');
      setTimeout(() => navigate('/panier'), 3000);
      return;
    }

    try {
      console.log('Appel API pour vérifier la session...');
      const response = await stripeAPI.verifySession(sessionId);
      console.log('Réponse de vérification:', response.data);
      
      if (response.data.success && response.data.payment_status === 'paid') {
        setPaymentVerified(true);
        
        // Recharger le panier pour refléter les changements
        try {
          await fetchCart();
          console.log('Panier rechargé avec succès');
        } catch (cartError) {
          console.error('Erreur lors du rechargement du panier:', cartError);
        }
        
        toast.success('Paiement confirmé ! Votre commande a été enregistrée avec succès.');
        
        // Rediriger vers les commandes après 3 secondes
        setTimeout(() => {
          navigate('/commandes');
        }, 3000);
        
      } else {
        throw new Error(`Paiement non validé. Statut: ${response.data.payment_status || 'inconnu'}`);
      }
    } catch (error: any) {
      console.error('Erreur lors de la vérification:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la vérification du paiement';
      setError(errorMessage);
      toast.error(errorMessage);
      setTimeout(() => navigate('/panier'), 5000);
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
          <Card className="w-full max-w-md p-8 text-center">
            <CardContent>
              <LoadingSpinner size="lg" />
              <p className="text-lg font-medium mt-4">Vérification du paiement...</p>
              <p className="text-sm text-gray-500 mt-4">
                Veuillez patienter pendant que nous vérifions votre transaction et créons votre commande
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-24 h-24 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
              >
                <AlertCircle className="h-12 w-12 text-white" />
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Erreur de vérification
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                {error}
              </p>

              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => navigate('/panier')}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 h-auto shadow-xl"
                >
                  Retour au panier
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/contact')}
                  className="border-2 border-gray-300 hover:border-gray-400 px-8 py-4 h-auto"
                >
                  Contacter le support
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Icône de succès */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
            >
              <CheckCircle className="h-12 w-12 text-white" />
            </motion.div>

            {/* Message de succès */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Paiement réussi !
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Votre commande a été confirmée et enregistrée avec succès. 
                Vous allez être redirigé vers vos commandes dans quelques secondes.
              </p>
            </motion.div>

            {/* Informations sur la commande */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 mb-8 max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-center mb-6">
                <Package className="h-8 w-8 text-blue-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Détails de la commande</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                  <span className="font-medium text-green-800">Statut du paiement</span>
                  <span className="text-green-600 font-bold">✅ Validé et enregistré</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                  <span className="font-medium text-blue-800">Statut de la commande</span>
                  <span className="text-blue-600 font-bold">🚀 Confirmée</span>
                </div>

                <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
                  <p>• Votre paiement a été traité avec succès</p>
                  <p>• Votre commande a été enregistrée dans notre système</p>
                  <p>• La livraison sera effectuée dans les délais prévus</p>
                  <p>• Redirection automatique vers vos commandes...</p>
                </div>
              </div>
            </motion.div>

            {/* Boutons d'action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={() => navigate('/commandes')}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 h-auto shadow-xl"
              >
                <Package className="h-5 w-5 mr-2" />
                Voir mes commandes maintenant
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="border-2 border-gray-300 hover:border-gray-400 px-8 py-4 h-auto"
              >
                Continuer mes achats
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </motion.div>

            {/* Message de remerciement */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-12 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl border border-purple-200"
            >
              <p className="text-purple-800 font-medium">
                🎉 Merci pour votre confiance ! Votre commande a été enregistrée avec succès.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutSuccessPage;
