
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import StripeCheckout from './StripeCheckout';

interface PaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess: () => void;
}

const PaymentPopup: React.FC<PaymentPopupProps> = ({ isOpen, onClose, amount, onSuccess }) => {
  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  const handleError = (error: string) => {
    console.error('Erreur de paiement:', error);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Paiement sécurisé</DialogTitle>
          <DialogDescription>
            Finalisez votre commande avec notre système de paiement sécurisé
          </DialogDescription>
        </DialogHeader>
        <StripeCheckout
          amount={amount}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PaymentPopup;
