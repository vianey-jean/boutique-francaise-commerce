import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const CheckoutCancelPage = () => {
  const navigate = useNavigate();

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
            {/* Icône d'annulation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-24 h-24 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
            >
              <XCircle className="h-12 w-12 text-white" />
            </motion.div>

            {/* Message d'annulation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Paiement annulé
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Votre paiement a été annulé. Aucun montant n'a été débité de votre compte.
                Vos articles sont toujours dans votre panier.
              </p>
            </motion.div>

            {/* Informations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 mb-8 max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-center mb-6">
                <CreditCard className="h-8 w-8 text-orange-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Que s'est-il passé ?</h2>
              </div>
              
              <div className="space-y-4 text-left">
                <div className="p-4 bg-orange-50 rounded-xl">
                  <p className="text-orange-800">
                    <strong>Paiement interrompu :</strong> Vous avez annulé le processus de paiement ou fermé la fenêtre Stripe.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-blue-800">
                    <strong>Vos articles sont sauvegardés :</strong> Tous les produits de votre panier sont toujours disponibles.
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-green-800">
                    <strong>Aucun frais :</strong> Aucun montant n'a été débité. Vous pouvez réessayer quand vous le souhaitez.
                  </p>
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
                onClick={() => navigate('/panier')}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 h-auto shadow-xl"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Retour au panier
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="border-2 border-gray-300 hover:border-gray-400 px-8 py-4 h-auto"
              >
                Continuer mes achats
              </Button>
            </motion.div>

            {/* Message d'aide */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-12 p-6 bg-gradient-to-r from-gray-100 to-blue-100 rounded-2xl border border-gray-200"
            >
              <p className="text-gray-700">
                <strong>Besoin d'aide ?</strong> Si vous rencontrez des difficultés lors du paiement, 
                n'hésitez pas à contacter notre service client.
              </p>
              <Button
                variant="link"
                onClick={() => navigate('/contact')}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Contacter le support
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutCancelPage;