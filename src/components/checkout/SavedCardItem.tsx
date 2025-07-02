
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { SavedCard } from '@/services/stripeAPI';

interface SavedCardItemProps {
  card: SavedCard;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const SavedCardItem: React.FC<SavedCardItemProps> = ({
  card,
  isSelected,
  onSelect,
  onDelete
}) => {
  const getBrandIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      default:
        return '💳';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getBrandIcon(card.brand)}</span>
          <div>
            <p className="font-medium capitalize">
              {card.brand} •••• {card.last4}
            </p>
            <p className="text-sm text-gray-600">
              Expire {card.exp_month.toString().padStart(2, '0')}/{card.exp_year}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default SavedCardItem;
