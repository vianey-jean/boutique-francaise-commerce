
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Plus } from 'lucide-react';

interface EmptyCardsStateProps {
  onAddNewCard: () => void;
}

const EmptyCardsState: React.FC<EmptyCardsStateProps> = ({ onAddNewCard }) => {
  return (
    <div className="text-center py-8">
      <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <p className="text-gray-600 mb-4">Aucune carte enregistrée</p>
      <Button onClick={onAddNewCard} className="bg-blue-500 hover:bg-blue-600">
        <Plus className="h-4 w-4 mr-2" />
        Ajouter une nouvelle carte
      </Button>
    </div>
  );
};

export default EmptyCardsState;
