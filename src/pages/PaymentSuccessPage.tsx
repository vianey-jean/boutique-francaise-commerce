
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { motion } from 'framer-motion';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      toast.success('Paiement effectué avec succès !');
      console.log('Session ID:', sessionId);
    }
  }, [sessionId]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="h-12 w-12 text-green-600" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Paiement réussi !
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="space-y-2">
                <p className="text-gray-600">
                  Votre commande a été traitée avec succès.
                </p>
                <p className="text-sm text-gray-500">
                  Vous recevrez bientôt un email de confirmation.
                </p>
                {sessionId && (
                  <p className="text-xs text-gray-400 mt-2">
                    ID de session: {sessionId}
                  </p>
                )}
              </div>

              <div className="flex flex-col space-y-3">
                <Button
                  onClick={() => navigate('/commandes')}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Voir mes commandes
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Retour à l'accueil
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PaymentSuccessPage;
