
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import PageDataLoader from '@/components/layout/PageDataLoader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Truck, Shield, CheckCircle } from 'lucide-react';

const CheckoutPage = () => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const loadCheckoutData = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { loaded: true };
  };

  const handleDataSuccess = () => {
    setDataLoaded(true);
  };

  const handleMaxRetriesReached = () => {
    setDataLoaded(true);
  };

  const steps = [
    { id: 1, title: 'Adresse de livraison', icon: Truck },
    { id: 2, title: 'Mode de paiement', icon: CreditCard },
    { id: 3, title: 'Confirmation', icon: CheckCircle }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 dark:from-green-500/5 dark:via-emerald-500/5 dark:to-teal-500/5">
          <div className="absolute inset-0 bg-grid-neutral-100/50 dark:bg-grid-neutral-800/50" />
          <div className="container mx-auto px-4 py-12 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-2xl shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
                Finaliser ma commande
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed">
                Dernière étape avant de recevoir vos produits favoris
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Étapes de progression */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    currentStep >= step.id 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    <step.icon className="h-6 w-6" />
                  </div>
                  <span className={`ml-2 font-medium ${
                    currentStep >= step.id ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 ml-4 ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="shadow-sm border border-neutral-200 dark:border-neutral-800">
                <CardHeader>
                  <CardTitle className="text-2xl text-neutral-900 dark:text-neutral-100">
                    {steps[currentStep - 1]?.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Veuillez renseigner votre adresse de livraison pour continuer.
                      </p>
                      {/* Formulaire d'adresse */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-6">
                        <p className="text-blue-800 dark:text-blue-300">
                          Formulaire d'adresse de livraison à implémenter
                        </p>
                      </div>
                      <Button 
                        onClick={() => setCurrentStep(2)}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                      >
                        Continuer vers le paiement
                      </Button>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Choisissez votre mode de paiement sécurisé.
                      </p>
                      {/* Options de paiement */}
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-6">
                        <p className="text-purple-800 dark:text-purple-300">
                          Options de paiement à implémenter
                        </p>
                      </div>
                      <div className="flex space-x-4">
                        <Button 
                          variant="outline"
                          onClick={() => setCurrentStep(1)}
                        >
                          Retour
                        </Button>
                        <Button 
                          onClick={() => setCurrentStep(3)}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                        >
                          Continuer
                        </Button>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Vérifiez vos informations avant de finaliser votre commande.
                      </p>
                      {/* Récapitulatif */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-6">
                        <p className="text-green-800 dark:text-green-300">
                          Récapitulatif de commande à implémenter
                        </p>
                      </div>
                      <div className="flex space-x-4">
                        <Button 
                          variant="outline"
                          onClick={() => setCurrentStep(2)}
                        >
                          Retour
                        </Button>
                        <Button 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                        >
                          <Shield className="h-5 w-5 mr-2" />
                          Finaliser la commande
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="shadow-sm border border-neutral-200 dark:border-neutral-800 sticky top-8">
                <CardHeader>
                  <CardTitle className="text-xl text-neutral-900 dark:text-neutral-100">
                    Résumé de commande
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 rounded-xl p-4">
                    <p className="text-neutral-700 dark:text-neutral-300">
                      Résumé des articles à implémenter
                    </p>
                  </div>
                  
                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                    <div className="flex justify-between text-lg font-bold text-neutral-900 dark:text-neutral-100">
                      <span>Total</span>
                      <span>0,00 €</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
