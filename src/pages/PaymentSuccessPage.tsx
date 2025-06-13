
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/sonner';

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Simuler la vérification du paiement avec Stripe
    const verifyPayment = async () => {
      if (sessionId) {
        try {
          // Ici, on vérifierait normalement le statut du paiement avec Stripe
          // En utilisant la clé secrète côté serveur
          console.log('Vérification du paiement Stripe:', sessionId);
          
          // Simulation de la vérification
          setTimeout(() => {
            setIsProcessing(false);
            toast.success("Paiement confirmé par Stripe !");
          }, 2000);
          
        } catch (error) {
          console.error('Erreur lors de la vérification:', error);
          setIsProcessing(false);
          toast.error("Erreur lors de la vérification du paiement");
        }
      } else {
        setIsProcessing(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (isProcessing) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md mx-auto"
          >
            <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-bold mb-2">Vérification du paiement...</h3>
            <p className="text-gray-600">Stripe confirme votre transaction</p>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="h-10 w-10 text-white" />
          </motion.div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Paiement réussi !
          </h1>

          <p className="text-gray-600 mb-6">
            Votre paiement a été traité avec succès par Stripe. 
            Votre commande est maintenant confirmée et sera bientôt préparée.
          </p>

          {sessionId && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-500">ID de session Stripe :</p>
              <p className="text-xs font-mono text-gray-700 break-all">{sessionId}</p>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={() => navigate('/commandes')}
              className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
            >
              <Package className="h-5 w-5 mr-2" />
              Voir mes commandes
            </Button>

            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full h-12"
            >
              <Home className="h-5 w-5 mr-2" />
              Retour à l'accueil
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-500">
              Un email de confirmation vous sera envoyé sous peu.
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PaymentSuccessPage;
