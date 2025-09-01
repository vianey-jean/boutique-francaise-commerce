
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import SecureLink from '@/components/SecureLink';

interface EmptyCartMessageProps {
  isAuthenticated: boolean;
}

const EmptyCartMessage: React.FC<EmptyCartMessageProps> = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return (
      <div className="text-center py-16 border rounded-lg bg-gray-50">
        <div className="mb-4">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-medium mb-3">Connectez-vous pour voir votre panier</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Connectez-vous pour accéder à votre panier et profiter d'une expérience personnalisée
        </p>
        <Button asChild size="lg">
          <SecureLink to="/login">Se connecter</SecureLink>
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-16 border rounded-lg bg-gray-50">
      <div className="mb-4">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-medium mb-3">Votre panier est vide</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Ajoutez des produits à votre panier pour commencer votre commande
      </p>
      <Button asChild size="lg" className="bg-red-800 hover:bg-red-700">
        <SecureLink to="/">Découvrir nos produits</SecureLink>
      </Button>
    </div>
  );
};

export default EmptyCartMessage;
