
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ordersAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Clock, CheckCircle, Truck, ShoppingBag, Calendar, MapPin, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['user-orders'],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not found');
      const response = await ordersAPI.getUserOrders(user.id);
      return response.data;
    },
    enabled: !!user?.id,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmée': return CheckCircle;
      case 'en préparation': return Package;
      case 'en livraison': return Truck;
      case 'livrée': return ShoppingBag;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmée': return 'from-blue-500 to-blue-600';
      case 'en préparation': return 'from-yellow-500 to-orange-500';
      case 'en livraison': return 'from-orange-500 to-red-500';
      case 'livrée': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${AUTH_BASE_URL}${imagePath}`;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-500 border-t-transparent mx-auto"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 opacity-20 animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Chargement de vos commandes
                  </h2>
                  <p className="text-gray-600">Veuillez patienter...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center space-y-6">
                <div className="bg-gradient-to-br from-red-100 to-orange-200 p-8 rounded-3xl w-fit mx-auto">
                  <Package className="h-16 w-16 text-red-500 mx-auto" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-red-600">Erreur de chargement</h2>
                  <p className="text-gray-600">Impossible de charger vos commandes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <div className="container mx-auto px-4 space-y-8">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-6">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <ShoppingBag className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">Mes Commandes</h1>
                  <p className="text-blue-100 text-lg">
                    Suivez l'état de toutes vos commandes ({orders.length})
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-3xl w-fit mx-auto mb-6">
                <ShoppingBag className="h-20 w-20 text-gray-400 mx-auto" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Aucune commande</h2>
              <p className="text-gray-600 text-lg mb-8">
                Vous n'avez pas encore passé de commande
              </p>
              <Button 
                onClick={() => window.location.href = '/products'}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 rounded-xl font-semibold"
              >
                Découvrir nos produits
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order: any) => {
                const StatusIcon = getStatusIcon(order.status);
                return (
                  <Card key={order.id} className="border-0 shadow-2xl bg-white overflow-hidden hover:shadow-3xl transition-all duration-300">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 pb-6">
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                        <div className="flex items-center space-x-4">
                          <div className={`bg-gradient-to-r ${getStatusColor(order.status)} p-4 rounded-2xl shadow-lg`}>
                            <StatusIcon className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl text-gray-900">
                              Commande #{order.id.slice(-8).toUpperCase()}
                            </CardTitle>
                            <div className="flex items-center space-x-6 text-gray-600 mt-2">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-5 w-5" />
                                <span className="font-medium">{formatDate(order.createdAt)}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <CreditCard className="h-5 w-5" />
                                <span className="font-bold text-green-600">{order.totalAmount.toFixed(2)} €</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center lg:text-right">
                          <Badge className={`bg-gradient-to-r ${getStatusColor(order.status)} text-white border-0 px-4 py-2 text-sm font-semibold rounded-full`}>
                            <StatusIcon className="h-4 w-4 mr-2" />
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-6 space-y-6">
                      {/* Products Section */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <Package className="h-5 w-5 mr-2 text-blue-600" />
                          Articles commandés
                        </h3>
                        <div className="grid gap-4">
                          {order.items.map((item: any, index: number) => (
                            <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100">
                              <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
                                {item.image ? (
                                  <img 
                                    src={getImageUrl(item.image)} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = `${AUTH_BASE_URL}/uploads/placeholder.jpg`;
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <ShoppingBag className="h-8 w-8 text-gray-500" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                                <p className="text-gray-600">
                                  Quantité: <span className="font-semibold">{item.quantity}</span> × 
                                  <span className="font-semibold text-green-600"> {item.price.toFixed(2)} €</span>
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold text-gray-900">
                                  {(item.quantity * item.price).toFixed(2)} €
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <MapPin className="h-5 w-5 mr-2 text-green-600" />
                          Adresse de livraison
                        </h3>
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
                          <div className="space-y-2">
                            <p className="font-bold text-gray-900 text-lg">
                              {order.shippingAddress.prenom} {order.shippingAddress.nom}
                            </p>
                            <p className="text-gray-700">{order.shippingAddress.adresse}</p>
                            <p className="text-gray-700">
                              {order.shippingAddress.codePostal} {order.shippingAddress.ville}
                            </p>
                            <p className="text-gray-700 font-medium">{order.shippingAddress.pays}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrdersPage;
