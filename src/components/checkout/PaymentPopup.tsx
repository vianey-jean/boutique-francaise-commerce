
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import StripeElements from './StripeElements';
import StripePaymentForm from './StripePaymentForm';

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
        </DialogHeader>
        <StripeElements amount={amount}>
          <StripePaymentForm
            amount={amount}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </StripeElements>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentPopup;
