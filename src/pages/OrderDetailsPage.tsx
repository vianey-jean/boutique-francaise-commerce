
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PageDataLoader from '@/components/layout/PageDataLoader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Truck, MapPin, Calendar, CreditCard, FileText } from 'lucide-react';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [dataLoaded, setDataLoaded] = useState(false);

  const loadOrderData = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { loaded: true };
  };

  const handleDataSuccess = () => {
    setDataLoaded(true);
  };

  const handleMaxRetriesReached = () => {
    setDataLoaded(true);
  };

  // Données fictives pour la commande
  const order = {
    id: orderId,
    number: 'CMD-2024-001',
    status: 'Expédié',
    date: '2024-12-15',
    total: 159.98,
    items: [
      {
        id: '1',
        name: 'Perruque Lace Front Premium',
        quantity: 1,
        price: 129.99,
        image: '/placeholder.svg'
      }
    ],
    shippingAddress: {
      name: 'Marie Dupont',
      address: '123 Rue de la Paix',
      city: 'Paris',
      postalCode: '75001',
      country: 'France'
    },
    tracking: 'FR123456789'
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'en cours': return 'bg-yellow-100 text-yellow-800';
      case 'expédié': return 'bg-blue-100 text-blue-800';
      case 'livré': return 'bg-green-100 text-green-800';
      case 'annulé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/5 dark:via-indigo-500/5 dark:to-purple-500/5">
          <div className="absolute inset-0 bg-grid-neutral-100/50 dark:bg-grid-neutral-800/50" />
          <div className="container mx-auto px-4 py-12 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-2xl shadow-lg">
                  <FileText className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Détails de la commande
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-4 leading-relaxed">
                Commande #{order.number}
              </p>
              
              <Badge className={`${getStatusColor(order.status)} text-sm px-4 py-2`}>
                {order.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Informations principales */}
            <div className="lg:col-span-2 space-y-6">
              {/* Articles commandés */}
              <Card className="shadow-sm border border-neutral-200 dark:border-neutral-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-neutral-900 dark:text-neutral-100">
                    <Package className="h-5 w-5 mr-2" />
                    Articles commandés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 rounded-xl">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-neutral-900 dark:text-neutral-100">{item.name}</h3>
                          <p className="text-neutral-600 dark:text-neutral-400">Quantité: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-neutral-900 dark:text-neutral-100">
                            {item.price.toFixed(2)} €
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Adresse de livraison */}
              <Card className="shadow-sm border border-neutral-200 dark:border-neutral-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-neutral-900 dark:text-neutral-100">
                    <MapPin className="h-5 w-5 mr-2" />
                    Adresse de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 rounded-xl p-4">
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">{order.shippingAddress.name}</p>
                    <p className="text-neutral-600 dark:text-neutral-400">{order.shippingAddress.address}</p>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      {order.shippingAddress.postalCode} {order.shippingAddress.city}
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400">{order.shippingAddress.country}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar avec résumé */}
            <div className="lg:col-span-1 space-y-6">
              {/* Résumé de commande */}
              <Card className="shadow-sm border border-neutral-200 dark:border-neutral-800 sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center text-neutral-900 dark:text-neutral-100">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Résumé
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Sous-total</span>
                    <span className="text-neutral-900 dark:text-neutral-100">129.99 €</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Livraison</span>
                    <span className="text-neutral-900 dark:text-neutral-100">4.99 €</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">TVA</span>
                    <span className="text-neutral-900 dark:text-neutral-100">25.00 €</span>
                  </div>
                  
                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                    <div className="flex justify-between text-lg font-bold text-neutral-900 dark:text-neutral-100">
                      <span>Total</span>
                      <span>{order.total.toFixed(2)} €</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Suivi de livraison */}
              <Card className="shadow-sm border border-neutral-200 dark:border-neutral-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-neutral-900 dark:text-neutral-100">
                    <Truck className="h-5 w-5 mr-2" />
                    Suivi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-4">
                    <p className="text-blue-800 dark:text-blue-300 font-medium mb-2">
                      Numéro de suivi
                    </p>
                    <p className="font-mono text-blue-900 dark:text-blue-200">{order.tracking}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Informations de commande */}
              <Card className="shadow-sm border border-neutral-200 dark:border-neutral-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-neutral-900 dark:text-neutral-100">
                    <Calendar className="h-5 w-5 mr-2" />
                    Informations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Date de commande</span>
                    <span className="text-neutral-900 dark:text-neutral-100">{order.date}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Statut</span>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
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

export default OrderDetailsPage;
