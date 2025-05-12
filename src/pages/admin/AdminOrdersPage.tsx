
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '@/services/api';
import AdminLayout from './AdminLayout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ChevronDown, Eye, Truck } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useNotifications } from '@/contexts/NotificationContext';
import NotificationBadge from '@/components/ui/notification-badge';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  subtotal: number;
}

interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  status: 'confirmée' | 'en préparation' | 'en livraison' | 'livrée';
  createdAt: string;
  updatedAt: string;
}

const AdminOrdersPage = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { markOrdersAsRead } = useNotifications();
  
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const response = await API.get('/orders');
      return response.data as Order[];
    }
  });

  useEffect(() => {
    // Marquer les commandes comme lues lorsque cette page est chargée
    markOrdersAsRead();
  }, []);
  
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: Order['status'] }) => {
      return API.put(`/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Statut de la commande mis à jour');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour du statut');
    }
  });

  const filteredOrders = statusFilter
    ? orders.filter(order => order.status === statusFilter)
    : orders;

  const sortedOrders = [...filteredOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleChangeStatus = (orderId: string, status: Order['status']) => {
    updateOrderStatusMutation.mutate({ orderId, status });
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'confirmée':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Confirmée</Badge>;
      case 'en préparation':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">En préparation</Badge>;
      case 'en livraison':
        return <Badge variant="outline" className="border-purple-500 text-purple-500">En livraison</Badge>;
      case 'livrée':
        return <Badge variant="outline" className="border-green-500 text-green-500">Livrée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Commandes non confirmées (nouvelles)
  const newOrders = orders.filter(o => o.status === 'confirmée').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold">
            Gestion des Commandes
            {newOrders > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-800 rounded">
                {newOrders} {newOrders === 1 ? 'nouvelle' : 'nouvelles'}
              </span>
            )}
          </h1>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={statusFilter === null ? "default" : "outline"} 
              onClick={() => setStatusFilter(null)}
              className="text-xs"
            >
              Toutes
            </Button>
            <Button 
              variant={statusFilter === 'confirmée' ? "default" : "outline"}
              onClick={() => setStatusFilter('confirmée')}
              className="text-xs relative"
            >
              Confirmées
              {newOrders > 0 && <NotificationBadge count={newOrders} />}
            </Button>
            <Button 
              variant={statusFilter === 'en préparation' ? "default" : "outline"}
              onClick={() => setStatusFilter('en préparation')}
              className="text-xs"
            >
              En préparation
            </Button>
            <Button 
              variant={statusFilter === 'en livraison' ? "default" : "outline"}
              onClick={() => setStatusFilter('en livraison')}
              className="text-xs"
            >
              En livraison
            </Button>
            <Button 
              variant={statusFilter === 'livrée' ? "default" : "outline"}
              onClick={() => setStatusFilter('livrée')}
              className="text-xs"
            >
              Livrées
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-800"></div>
          </div>
        ) : sortedOrders.length === 0 ? (
          <div className="text-center py-10 border rounded-md bg-gray-50">
            <AlertCircle className="mx-auto h-10 w-10 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune commande trouvée</h3>
            {statusFilter && (
              <p className="mt-1 text-sm text-gray-500">
                Aucune commande avec le statut "{statusFilter}".
              </p>
            )}
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Commande</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOrders.map((order) => (
                  <TableRow key={order.id} className={order.status === 'confirmée' ? 'bg-gray-50' : ''}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>{order.userName || 'Client'}</TableCell>
                    <TableCell className="text-right">{order.totalAmount.toFixed(2)} €</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getStatusBadge(order.status)}
                        {order.status === 'confirmée' && (
                          <div className="ml-2">
                            <NotificationBadge count={1} />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/commande/${order.id}`, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Truck className="h-4 w-4 mr-1" />
                              Statut 
                              <ChevronDown className="h-3 w-3 ml-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => handleChangeStatus(order.id, 'confirmée')}
                              disabled={order.status === 'confirmée'}
                            >
                              Confirmée
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleChangeStatus(order.id, 'en préparation')}
                              disabled={order.status === 'en préparation'}
                            >
                              En préparation
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleChangeStatus(order.id, 'en livraison')}
                              disabled={order.status === 'en livraison'}
                            >
                              En livraison
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleChangeStatus(order.id, 'livrée')}
                              disabled={order.status === 'livrée'}
                            >
                              Livrée
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
