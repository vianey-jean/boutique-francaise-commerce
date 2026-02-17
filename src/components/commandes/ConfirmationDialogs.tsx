/**
 * =============================================================================
 * Composants de Confirmation pour les Commandes
 * =============================================================================
 * 
 * Dialogs de confirmation pour les actions critiques:
 * - Validation d'une commande/réservation
 * - Annulation d'une commande/réservation
 * - Suppression d'une commande/réservation
 * 
 * @module ConfirmationDialogs
 * @version 1.0.0
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';

interface ValidationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Dialog de confirmation pour valider une commande/réservation
 */
export const ValidationDialog: React.FC<ValidationDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="bg-gradient-to-br from-white/90 via-emerald-50/40 to-teal-50/50 dark:from-slate-900/90 dark:via-emerald-950/40 dark:to-teal-950/50 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.35)] rounded-3xl">
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-emerald-400/15 to-teal-400/15 rounded-full blur-3xl" />
        </div>
        <AlertDialogHeader className="relative">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full shadow-lg shadow-emerald-500/30 border border-white/20">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Confirmer la validation
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-muted-foreground">
            Cette action va enregistrer la commande comme une vente validée et mettre à jour le stock.
            Êtes-vous sûr de vouloir continuer ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-3 justify-center">
          <AlertDialogCancel onClick={onCancel}>
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
          >
            Valider la commande
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface CancellationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Dialog de confirmation pour annuler une commande/réservation
 */
export const CancellationDialog: React.FC<CancellationDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="bg-gradient-to-br from-white/90 via-red-50/40 to-rose-50/50 dark:from-slate-900/90 dark:via-red-950/40 dark:to-rose-950/50 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.35)] rounded-3xl">
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-red-400/15 to-rose-400/15 rounded-full blur-3xl" />
        </div>
        <AlertDialogHeader className="relative">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-full shadow-lg shadow-red-500/30 border border-white/20">
              <XCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-xl font-extrabold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
            Confirmer l'annulation
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-muted-foreground">
            Cette action va annuler la commande. Si elle était validée, la vente sera également supprimée
            et le stock sera restauré. Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-3 justify-center">
          <AlertDialogCancel onClick={onCancel}>
            Retour
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
          >
            Confirmer l'annulation
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface DeleteDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Dialog de confirmation pour supprimer une commande/réservation
 */
export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="bg-gradient-to-br from-white/90 via-slate-50/40 to-zinc-50/50 dark:from-slate-900/90 dark:via-slate-800/40 dark:to-zinc-900/50 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.35)] rounded-3xl">
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-slate-400/10 to-zinc-400/10 rounded-full blur-3xl" />
        </div>
        <AlertDialogHeader className="relative">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-slate-500 to-zinc-600 rounded-full shadow-lg shadow-slate-500/30 border border-white/20">
              <Trash2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-xl font-extrabold bg-gradient-to-r from-slate-600 to-zinc-600 bg-clip-text text-transparent">
            Supprimer cette entrée ?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-muted-foreground">
            Cette action supprimera définitivement cette commande/réservation et toutes les données associées.
            Cette action ne peut pas être annulée.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-3 justify-center">
          <AlertDialogCancel onClick={onCancel}>
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-gradient-to-r from-slate-600 to-zinc-600 hover:from-slate-700 hover:to-zinc-700"
          >
            Supprimer définitivement
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
