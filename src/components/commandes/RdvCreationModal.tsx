/**
 * =============================================================================
 * Modal Premium de Création de Rendez-vous depuis une Réservation
 * =============================================================================
 * 
 * Ce composant affiche un formulaire modal élégant et luxueux pour créer
 * un rendez-vous à partir d'une réservation enregistrée.
 * 
 * FONCTIONNALITÉS:
 * - Design premium avec animations fluides
 * - Champs préremplis depuis la réservation
 * - Saisie du titre et description personnalisés
 * - Validation des champs obligatoires
 * - Icônes modernes et interface professionnelle
 * 
 * PROPS:
 * - isOpen: boolean - Contrôle l'affichage du modal
 * - onClose: () => void - Callback de fermeture
 * - onConfirm: (titre: string, description: string) => Promise<void> - Callback de validation
 * - reservation: ReservationData | null - Données de la réservation
 * 
 * DÉPENDANCES:
 * - framer-motion: Animations
 * - lucide-react: Icônes
 * - @/components/ui/*: Composants UI Shadcn
 * 
 * @component RdvCreationModal
 * @author Système de gestion des ventes
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  FileText,
  Sparkles,
  CalendarPlus,
  Edit3,
  Package,
  Crown,
  CheckCircle2,
  X
} from 'lucide-react';

/**
 * Interface pour les données de réservation
 * Contient les informations nécessaires pour préremplir le formulaire
 */
interface ReservationData {
  id: string;
  clientNom: string;
  clientPhone: string;
  clientAddress: string;
  dateEcheance: string;
  horaire: string;
  produits: Array<{
    nom: string;
    quantite: number;
    prixUnitaire: number;
    prixVente: number;
  }>;
}

/**
 * Props du composant RdvCreationModal
 */
interface RdvCreationModalProps {
  /** Contrôle l'affichage du modal */
  isOpen: boolean;
  /** Callback appelé lors de la fermeture */
  onClose: () => void;
  /** Callback appelé lors de la confirmation avec titre et description */
  onConfirm: (titre: string, description: string) => Promise<void>;
  /** Données de la réservation source (null si aucune) */
  reservation: ReservationData | null;
  /** État de chargement pendant l'enregistrement */
  isLoading?: boolean;
}

/**
 * Composant Modal Premium pour la création de RDV
 * 
 * Affiche un formulaire élégant avec animations et design luxueux
 * pour permettre à l'utilisateur de personnaliser le titre et la
 * description du rendez-vous avant sa création.
 * 
 * @param props - Props du composant
 * @returns Élément React du modal
 * 
 * @example
 * <RdvCreationModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   onConfirm={handleCreateRdv}
 *   reservation={pendingReservation}
 * />
 */
const RdvCreationModal: React.FC<RdvCreationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  reservation,
  isLoading = false
}) => {
  // État local pour les champs du formulaire
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // Réinitialiser le formulaire quand le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setTitre('');
      setDescription('');
      setError('');
    }
  }, [isOpen]);

  /**
   * Gère la soumission du formulaire
   * Valide le titre obligatoire et appelle onConfirm
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation du titre obligatoire
    if (!titre.trim()) {
      setError('Le titre du rendez-vous est obligatoire');
      return;
    }
    
    setError('');
    await onConfirm(titre.trim(), description.trim());
  };

  /**
   * Formate la date pour l'affichage
   * @param dateStr - Date au format YYYY-MM-DD
   * @returns Date formatée en français
   */
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Si pas de réservation, ne rien afficher
  if (!reservation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-gradient-to-br from-background via-background to-muted/30 border-2 border-primary/20 shadow-2xl">
        {/* En-tête premium avec gradient */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-primary/10"
        >
          {/* Icône animée */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.1, type: 'spring', stiffness: 200 }}
            className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-2xl"
          />
          
          <div className="flex items-center gap-4 relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg shadow-primary/30"
            >
              <CalendarPlus className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            
            <div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent flex items-center gap-2">
                <span>🗓️</span>
                Détails du rendez-vous
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Renseignez le titre et la description du rendez-vous
              </DialogDescription>
            </div>
          </div>
          
          {/* Badge Crown pour effet premium */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute top-4 right-4"
          >
            <Badge variant="secondary" className="bg-amber-500/20 text-amber-600 border-amber-500/30 flex items-center gap-1">
              <Crown className="w-3 h-3" />
              Premium
            </Badge>
          </motion.div>
        </motion.div>

        {/* Corps du formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informations préremplies (non modifiables) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl border border-muted"
          >
            <h4 className="col-span-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Informations préremplies
            </h4>
            
            {/* Client */}
            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Client</p>
                <p className="font-medium text-sm">{reservation.clientNom}</p>
              </div>
            </div>
            
            {/* Téléphone */}
            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Téléphone</p>
                <p className="font-medium text-sm">{reservation.clientPhone}</p>
              </div>
            </div>
            
            {/* Date */}
            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-medium text-sm">{formatDate(reservation.dateEcheance)}</p>
              </div>
            </div>
            
            {/* Horaire */}
            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Horaire</p>
                <p className="font-medium text-sm">{reservation.horaire}</p>
              </div>
            </div>
            
            {/* Adresse (pleine largeur) */}
            <div className="col-span-2 flex items-center gap-3 p-3 bg-background/50 rounded-lg">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Lieu</p>
                <p className="font-medium text-sm">{reservation.clientAddress}</p>
              </div>
            </div>
            
            {/* Produits */}
            {reservation.produits.length > 0 && (
              <div className="col-span-2 flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                <Package className="w-5 h-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Produits réservés</p>
                  <div className="flex flex-wrap gap-1">
                    {reservation.produits.map((p, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {p.nom} x{p.quantite}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Champs modifiables */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {/* Titre du rendez-vous */}
            <div className="space-y-2">
              <Label htmlFor="rdv-titre" className="flex items-center gap-2 text-sm font-semibold">
                <Edit3 className="w-4 h-4 text-primary" />
                Titre du rendez-vous
                <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="rdv-titre"
                  value={titre}
                  onChange={(e) => {
                    setTitre(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Ex: Livraison perruque naturelle, Essayage, etc."
                  className={`h-12 pl-4 pr-4 bg-background/50 border-2 transition-all duration-200 ${
                    error 
                      ? 'border-destructive focus:border-destructive focus:ring-destructive/20' 
                      : 'border-muted focus:border-primary focus:ring-primary/20'
                  }`}
                  autoFocus
                />
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  {error}
                </motion.p>
              )}
            </div>

            {/* Description (optionnelle) */}
            <div className="space-y-2">
              <Label htmlFor="rdv-description" className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="w-4 h-4 text-primary" />
                Description
                <Badge variant="secondary" className="text-xs ml-1">Optionnel</Badge>
              </Label>
              <Textarea
                id="rdv-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ajoutez des notes ou détails supplémentaires..."
                className="min-h-[100px] bg-background/50 border-2 border-muted focus:border-primary transition-all duration-200 resize-none"
              />
            </div>
          </motion.div>

          {/* Boutons d'action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3 pt-4 border-t border-muted"
          >
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 border-2"
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/30 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                />
              ) : (
                <>
                  <CalendarPlus className="w-5 h-5 mr-2" />
                  Créer le rendez-vous
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RdvCreationModal;
