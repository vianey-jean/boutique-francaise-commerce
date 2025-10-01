import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { useStore } from '@/contexts/StoreContext';

const PaymentCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const { createOrder } = useStore();

  useEffect(() => {
    const paymentIntent = searchParams.get('payment_intent');
    const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
    const redirectStatus = searchParams.get('redirect_status');

    const processPaymentResult = async () => {
      if (redirectStatus === 'succeeded') {
        setStatus('success');
        toast.success('Paiement accepté avec succès !');
        
        // Traiter la commande avec les données stockées
        const orderDataString = sessionStorage.getItem('pendingOrder');
        if (orderDataString) {
          try {
            const orderData = JSON.parse(orderDataString);
            
            // Créer la commande via le contexte
            console.log('Création de la commande après paiement réussi:', orderData);
            
            // Recréer les items du panier depuis les données stockées
            const cartItems = orderData.cartItems.map((item: any) => ({
              product: {
                id: item.productId,
                // Les autres propriétés seront récupérées du store
              },
              quantity: item.quantity
            }));
            
            await createOrder(
              orderData.shippingAddress,
              'card', // Méthode de paiement
              orderData.promoDetails
            );
            
            sessionStorage.removeItem('pendingOrder');
          } catch (error) {
            console.error('Erreur lors de la création de la commande:', error);
            toast.error('Erreur lors de la finalisation de la commande');
          }
        }
        
        // Rediriger vers les commandes après 2 secondes
        setTimeout(() => {
          navigate('/commandes');
        }, 2000);
      } else if (redirectStatus === 'failed' || redirectStatus === 'canceled') {
        setStatus('failed');
        toast.error('Le paiement a été refusé');
      } else {
        setStatus('loading');
      }
    };

    processPaymentResult();
  }, [searchParams, navigate, createOrder]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="border-2 shadow-xl">
            <CardContent className="pt-8 pb-8">
              {status === 'loading' && (
                <div className="text-center">
                  <Loader2 className="h-16 w-16 mx-auto mb-6 text-blue-600 animate-spin" />
                  <h2 className="text-2xl font-bold mb-4">Vérification du paiement...</h2>
                  <p className="text-gray-600">Veuillez patienter pendant que nous vérifions votre paiement.</p>
                </div>
              )}

              {status === 'success' && (
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 mx-auto mb-6 text-green-600" />
                  <h2 className="text-2xl font-bold mb-4 text-green-700">Paiement réussi !</h2>
                  <p className="text-gray-600 mb-6">
                    Votre paiement a été accepté avec succès. Vous allez être redirigé vers vos commandes.
                  </p>
                  <Button 
                    onClick={() => navigate('/commandes')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Voir mes commandes
                  </Button>
                </div>
              )}

              {status === 'failed' && (
                <div className="text-center">
                  <XCircle className="h-16 w-16 mx-auto mb-6 text-red-600" />
                  <h2 className="text-2xl font-bold mb-4 text-red-700">Paiement refusé</h2>
                  <p className="text-gray-600 mb-6">
                    Votre paiement a été refusé. Veuillez réessayer avec une autre carte ou vérifier vos informations.
                  </p>
                  <Button 
                    onClick={() => navigate('/paiement')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Réessayer le paiement
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentCallbackPage;
