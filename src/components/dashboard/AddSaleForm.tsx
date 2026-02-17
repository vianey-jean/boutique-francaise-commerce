
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { Product, Sale } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Sparkles, Crown, Diamond } from 'lucide-react';
import ConfirmDeleteDialog from './forms/ConfirmDeleteDialog';
import { useSaleForm } from './forms/hooks/useSaleForm';
import { calculateSaleProfit } from './forms/utils/saleCalculations';
import SaleFormFields from './forms/SaleFormFields';
import axios from 'axios';

interface AddSaleFormProps {
  isOpen: boolean;
  onClose: () => void;
  editSale?: Sale;
}

/**
 * Formulaire pour ajouter ou modifier une vente
 */
const AddSaleForm: React.FC<AddSaleFormProps> = ({ isOpen, onClose, editSale }) => {
  const { products, addSale, updateSale, deleteSale } = useApp();
  const { toast } = useToast();
  
  const {
    formData,
    setFormData,
    selectedProduct,
    setSelectedProduct,
    isSubmitting,
    setIsSubmitting,
    maxQuantity,
    setMaxQuantity,
    showDeleteConfirm,
    setShowDeleteConfirm,
    isAdvanceProduct,
    setIsAdvanceProduct,
    isOutOfStock,
    handleProductSelect,
    initializeForm
  } = useSaleForm(editSale, products, isOpen);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000';

  // Fonction pour créer ou récupérer un client
  const handleClientData = async (clientName: string, clientPhone: string, clientAddress: string) => {
    if (!clientName.trim()) return null;

    try {
      const token = localStorage.getItem('token');
      
      // Vérifier si le client existe déjà
      const existingClientsResponse = await axios.get(`${API_BASE_URL}/api/clients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const existingClient = existingClientsResponse.data.find((client: any) => 
        client.nom.toLowerCase() === clientName.toLowerCase()
      );
      
      if (existingClient) {
        console.log('Client existant trouvé:', existingClient);
        return existingClient;
      }
      
      // Créer un nouveau client si les informations sont complètes
      if (clientPhone.trim() && clientAddress.trim()) {
        const newClientResponse = await axios.post(`${API_BASE_URL}/api/clients`, {
          nom: clientName,
          phone: clientPhone,
          adresse: clientAddress
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Nouveau client créé:', newClientResponse.data);
        toast({
          title: "Client enregistré",
          description: `Le client ${clientName} a été ajouté à votre base de données`,
          className: "notification-success",
        });
        
        return newClientResponse.data;
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors de la gestion du client:', error);
      return null;
    }
  };

  // Fonction pour mettre à jour un client existant
  const updateClientData = async (clientId: string, clientName: string, clientPhone: string, clientAddress: string) => {
    try {
      const token = localStorage.getItem('token');
      
      const updatedClientResponse = await axios.put(`${API_BASE_URL}/api/clients/${clientId}`, {
        nom: clientName,
        phone: clientPhone,
        adresse: clientAddress
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Client mis à jour:', updatedClientResponse.data);
      toast({
        title: "Client mis à jour",
        description: `Les informations du client ${clientName} ont été mises à jour`,
        className: "notification-success",
      });
      
      return updatedClientResponse.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du client:', error);
      return null;
    }
  };

  // Fonction pour gérer les clients lors de la modification
  const handleClientForUpdate = async (clientName: string, clientPhone: string, clientAddress: string) => {
    if (!clientName.trim()) return null;

    try {
      const token = localStorage.getItem('token');
      
      // Vérifier si le client existe déjà
      const existingClientsResponse = await axios.get(`${API_BASE_URL}/api/clients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const existingClient = existingClientsResponse.data.find((client: any) => 
        client.nom.toLowerCase() === clientName.toLowerCase()
      );
      
      if (existingClient) {
        // Client existe, mettre à jour ses informations si elles ont changé
        if (existingClient.phone !== clientPhone || existingClient.adresse !== clientAddress) {
          return await updateClientData(existingClient.id, clientName, clientPhone, clientAddress);
        }
        return existingClient;
      } else {
        // Client n'existe pas, le créer si les informations sont complètes
        if (clientPhone.trim() && clientAddress.trim()) {
          const newClientResponse = await axios.post(`${API_BASE_URL}/api/clients`, {
            nom: clientName,
            phone: clientPhone,
            adresse: clientAddress
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          console.log('Nouveau client créé lors de la modification:', newClientResponse.data);
          toast({
            title: "Client enregistré",
            description: `Le client ${clientName} a été ajouté à votre base de données`,
            className: "notification-success",
          });
          
          return newClientResponse.data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors de la gestion du client pour modification:', error);
      return null;
    }
  };

  // Fonction pour gérer les clients lors de la suppression
  const handleClientForDeletion = async (clientName: string, clientPhone: string, clientAddress: string) => {
    if (!clientName.trim()) return;

    try {
      const token = localStorage.getItem('token');
      
      // Vérifier si le client existe déjà
      const existingClientsResponse = await axios.get(`${API_BASE_URL}/api/clients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const existingClient = existingClientsResponse.data.find((client: any) => 
        client.nom.toLowerCase() === clientName.toLowerCase()
      );
      
      if (!existingClient) {
        // Client n'existe pas dans la base, l'ajouter avant de supprimer la vente
        if (clientPhone.trim() && clientAddress.trim()) {
          const newClientResponse = await axios.post(`${API_BASE_URL}/api/clients`, {
            nom: clientName,
            phone: clientPhone,
            adresse: clientAddress
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          console.log('Client ajouté avant suppression de la vente:', newClientResponse.data);
          toast({
            title: "Client sauvegardé",
            description: `Le client ${clientName} a été sauvegardé avant la suppression de la vente`,
            className: "notification-success",
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la gestion du client pour suppression:', error);
    }
  };

  // Fonction pour calculer le profit selon la nouvelle logique
  const updateProfit = (priceUnit: string, quantity: string, purchasePriceUnit: string) => {
    if (isAdvanceProduct) {
      // Pour les produits d'avance : profit = prix de vente - prix d'achat (sans quantité)
      const profit = Number(priceUnit || 0) - Number(purchasePriceUnit || 0);
      setFormData(prev => ({
        ...prev,
        profit: profit.toFixed(2),
      }));
    } else {
      // Pour les autres produits : profit normal
      const profit = calculateSaleProfit(priceUnit, quantity, purchasePriceUnit);
      setFormData(prev => ({
        ...prev,
        profit: profit,
      }));
    }
  };

  // Gestionnaire pour le changement de prix de vente unitaire
  const handleSellingPriceChange = (price: string) => {
    setFormData(prev => ({
      ...prev,
      sellingPriceUnit: price,
    }));
    updateProfit(price, formData.quantitySold, formData.purchasePriceUnit);
  };

  // Gestionnaire pour le changement de quantité
  const handleQuantityChange = (quantity: string) => {
    if (!isAdvanceProduct) {
      setFormData(prev => ({
        ...prev,
        quantitySold: quantity,
      }));
      updateProfit(formData.sellingPriceUnit, quantity, formData.purchasePriceUnit);
    }
  };

  // Fonction pour soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un produit.",
        variant: "destructive",
         className: "notification-erreur",
      });
      return;
    }
    
    // Pour les nouveaux ajouts (pas les modifications), vérifier le stock
    if (!editSale && !isAdvanceProduct && isOutOfStock) {
      toast({
        title: "Erreur",
        description: "Stock épuisé. Impossible d'ajouter cette vente.",
        variant: "destructive",
         className: "notification-erreur",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Gérer les données client
      if (editSale) {
        // Lors de la modification, gérer les clients différemment
        if (formData.clientName.trim()) {
          await handleClientForUpdate(formData.clientName, formData.clientPhone, formData.clientAddress);
        }
      } else {
        // Pour les nouveaux ajouts
        if (formData.clientName.trim()) {
          await handleClientData(formData.clientName, formData.clientPhone, formData.clientAddress);
        }
      }

      const quantity = isAdvanceProduct ? 0 : Number(formData.quantitySold);
      const purchasePriceUnit = Number(formData.purchasePriceUnit);
      const sellingPriceUnit = Number(formData.sellingPriceUnit);
      
      let purchasePrice, sellingPrice;
      
      if (isAdvanceProduct) {
        // Pour les produits d'avance
        // purchasePrice = prix d'achat du produit (pas unitaire)
        // sellingPrice = prix de vente unitaire saisi par l'utilisateur
        purchasePrice = purchasePriceUnit; // Le prix d'achat est directement le prix du produit
        sellingPrice = sellingPriceUnit;   // Le prix de vente est ce que l'utilisateur a saisi
      } else {
        // Pour les autres produits
        // A = Prix d'achat unitaire * Quantité
        // V = Prix de vente unitaire * Quantité
        purchasePrice = purchasePriceUnit * quantity;
        sellingPrice = sellingPriceUnit * quantity;
      }
      
      const profit = Number(formData.profit);
      
      console.log('📊 Données calculées pour la vente:', {
        isAdvanceProduct,
        quantity,
        purchasePriceUnit,
        sellingPriceUnit,
        purchasePrice,
        sellingPrice,
        profit
      });
      
      const saleData = {
        date: formData.date,
        productId: formData.productId,
        description: formData.description,
        sellingPrice: sellingPrice,
        quantitySold: quantity,
        purchasePrice: purchasePrice,
        profit: profit,
        clientName: formData.clientName,
        clientAddress: formData.clientAddress,
        clientPhone: formData.clientPhone,
      };

      let success: boolean | Sale = false;
      
      if (editSale && updateSale) {
        success = await updateSale({ ...saleData, id: editSale.id });
      } else if (addSale) {
        success = await addSale(saleData);
      }
      
      if (success) {
        toast({
          title: "Succès",
          description: editSale ? "Vente mise à jour avec succès" : "Vente ajoutée avec succès",
          variant: "default",
          className: "notification-success",
        });
        onClose();
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
         className: "notification-erreur",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editSale || !deleteSale) return;
    
    setIsSubmitting(true);
    try {
      // Gérer le client avant la suppression
      if (editSale.clientName) {
        await handleClientForDeletion(
          editSale.clientName, 
          editSale.clientPhone || '', 
          editSale.clientAddress || ''
        );
      }

      const success = await deleteSale(editSale.id);
      if (success) {
        toast({
          title: "Succès",
          description: "La vente a été supprimée avec succès",
          variant: "default",
          className: "notification-success",
        });
        onClose();
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
         className: "notification-erreur",
      });
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  const isProfitNegative = Number(formData.profit) < 0;

  // Améliorer la logique de désactivation du bouton
  const isButtonDisabled = () => {
    if (isSubmitting) return true;
    if (!selectedProduct) return true;
    
    // Pour les nouveaux ajouts seulement
    if (!editSale) {
      // Pour les produits normaux, vérifier le stock
      if (!isAdvanceProduct && isOutOfStock) return true;
    }
    
    return false;
  };

  const getButtonText = () => {
    if (isSubmitting) return "Enregistrement...";
    if (!editSale && !selectedProduct) return "Sélectionner un produit";
    if (!editSale && !isAdvanceProduct && isOutOfStock) return "Stock épuisé";
    return editSale ? "Mettre à jour" : "Ajouter";
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto bg-gradient-to-br from-white/90 via-purple-50/40 to-indigo-50/50 dark:from-slate-900/90 dark:via-purple-950/40 dark:to-indigo-950/50 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.35)] rounded-3xl">
          {/* Decorative glass orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-400/15 to-indigo-400/15 rounded-full blur-3xl" />
          </div>
          <DialogHeader className="relative">
            <DialogTitle className="flex items-center gap-3 text-xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
              <div className="p-2.5 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-full shadow-lg shadow-purple-500/30 border border-white/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              {editSale ? 'Modifier la vente' : 'Ajouter une vente'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {editSale ? 'Modifiez les détails de la vente.' : 'Enregistrez une nouvelle vente.'}
              {isAdvanceProduct && (
                <div className="mt-2 text-amber-600 text-sm font-medium">
                  Produit d'avance détecté - La quantité sera automatiquement fixée à 0.
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <SaleFormFields
              formData={formData}
              setFormData={setFormData}
              selectedProduct={selectedProduct}
              editSale={editSale}
              onProductSelect={handleProductSelect}
              onSellingPriceChange={handleSellingPriceChange}
              onQuantityChange={handleQuantityChange}
              maxQuantity={maxQuantity}
              isSubmitting={isSubmitting}
              isOutOfStock={isOutOfStock}
              isAdvanceProduct={isAdvanceProduct}
              isProfitNegative={isProfitNegative}
            />
            
            <DialogFooter className="flex gap-3 pt-4">
              {editSale && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isSubmitting}
                  className="mr-auto rounded-full px-5 bg-gradient-to-r from-red-500/80 to-rose-500/80 backdrop-blur-xl border border-white/20 shadow-lg shadow-red-500/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              )}
              
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-full px-5 bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Annuler
              </Button>
              
              <Button
                type="submit"
                className="rounded-full px-6 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white border-0 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 font-bold"
                disabled={isButtonDisabled()}
              >
                <Diamond className="h-4 w-4 mr-2" />
                {getButtonText()}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <ConfirmDeleteDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Supprimer la vente"
        description="Êtes-vous sûr de vouloir supprimer cette vente ? Cette action ne peut pas être annulée."
      />
    </>
  );
};

export default AddSaleForm;
