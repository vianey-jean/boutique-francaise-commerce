/**
 * =============================================================================
 * Page de gestion des Commandes et Réservations
 * =============================================================================
 * 
 * Cette page permet de gérer les commandes et réservations clients.
 * Elle intègre la synchronisation automatique avec les rendez-vous.
 * 
 * FONCTIONNALITÉS PRINCIPALES:
 * - Création/modification/suppression de commandes et réservations
 * - Gestion des statuts avec synchronisation RDV automatique
 * - Export PDF des commandes par date
 * - Création de RDV depuis une réservation avec modal premium
 * - Validation des commandes avec enregistrement en vente
 * 
 * SYNCHRONISATION RDV:
 * - Lors d'un changement de statut de réservation, le RDV lié est mis à jour
 * - Mapping des statuts: voir reservationRdvSyncService
 * 
 * @module CommandesPage
 * @author Système de gestion des ventes
 * @version 3.0.0 - Refactorisé avec composants
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit, ShoppingCart, Crown, Star, Sparkles, Gift, Award, Zap } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Commande, CommandeProduit, CommandeStatut } from '@/types/commande';
import api from '@/service/api';
import { rdvFromReservationService } from '@/services/rdvFromReservationService';
import { reservationRdvSyncService } from '@/services/reservationRdvSyncService';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Layout from '@/components/Layout';
import PremiumLoading from '@/components/ui/premium-loading';
import SaleQuantityInput from '@/components/dashboard/forms/SaleQuantityInput';

// Import des composants refactorisés
import {
  CommandesHero,
  CommandesSearchBar,
  CommandesTable,
  CommandesDialogs,
  RdvCreationModal,
  RdvConfirmationModal
} from '@/components/commandes';

interface Client {
  id: string;
  nom: string;
  phone: string;
  adresse: string;
}

interface Product {
  id: string;
  description: string;
  purchasePrice: number;
  quantity: number;
}

const CommandesPage: React.FC = () =>  {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCommande, setEditingCommande] = useState<Commande | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Form state
  const [clientNom, setClientNom] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [type, setType] = useState<'commande' | 'reservation'>('commande');
  const [produitNom, setProduitNom] = useState('');
  const [prixUnitaire, setPrixUnitaire] = useState('');
  const [quantite, setQuantite] = useState('1');
  const [prixVente, setPrixVente] = useState('');
  const [dateArrivagePrevue, setDateArrivagePrevue] = useState('');
  const [dateEcheance, setDateEcheance] = useState('');
  const [horaire, setHoraire] = useState('');
  
  // Liste des produits ajoutés au panier
  const [produitsListe, setProduitsListe] = useState<CommandeProduit[]>([]);
  
  // État pour gérer l'édition d'un produit dans le panier
  const [editingProductIndex, setEditingProductIndex] = useState<number | null>(null);
  
  // Autocomplete state
  const [clientSearch, setClientSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [showClientSuggestions, setShowClientSuggestions] = useState(false);
  const [showProductSuggestions, setShowProductSuggestions] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // État pour gérer l'ordre de tri par date
  const [sortDateAsc, setSortDateAsc] = useState(true);
  
  // État pour la recherche de commandes
  const [commandeSearch, setCommandeSearch] = useState('');
  
  // État pour la confirmation de validation
  const [validatingId, setValidatingId] = useState<string | null>(null);
  
  // État pour l'export PDF
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportDate, setExportDate] = useState('');
  
  // État pour la modale Reporter
  const [reporterModalOpen, setReporterModalOpen] = useState(false);
  const [reporterCommandeId, setReporterCommandeId] = useState<string | null>(null);
  const [reporterDate, setReporterDate] = useState('');
  const [reporterHoraire, setReporterHoraire] = useState('');
  
  // État pour la confirmation de création RDV depuis réservation
  const [showRdvConfirmDialog, setShowRdvConfirmDialog] = useState(false);
  const [showRdvFormModal, setShowRdvFormModal] = useState(false);
  const [pendingReservationForRdv, setPendingReservationForRdv] = useState<Commande | null>(null);
  const [rdvTitre, setRdvTitre] = useState('');
  const [rdvDescription, setRdvDescription] = useState('');
  const [isRdvLoading, setIsRdvLoading] = useState(false);
  
  // État pour la confirmation d'annulation
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchCommandes(), fetchClients(), fetchProducts()]);
      setIsLoading(false);
    };
    
    loadData();
    
    const interval = setInterval(checkNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchCommandes = async () => {
    try {
      const response = await api.get('/api/commandes');
      setCommandes(response.data);
    } catch (error) {
      console.error('Error fetching commandes:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les commandes',
        className: "bg-app-red text-white",
        variant: 'destructive',
      });
    }
  };

  const filteredCommandes = useMemo(() => {
    const commandesToFilter = commandeSearch.length >= 3 
      ? commandes 
      : commandes.filter(c => c.statut !== 'valide' && c.statut !== 'annule');
    
    let filtered = commandesToFilter;
    if (commandeSearch.length >= 3) {
      const searchLower = commandeSearch.toLowerCase();
      filtered = commandesToFilter.filter(commande => 
        commande.clientNom.toLowerCase().includes(searchLower) ||
        commande.clientPhone.includes(searchLower) ||
        commande.produits.some(p => p.nom.toLowerCase().includes(searchLower))
      );
    }
    
    return [...filtered].sort((a, b) => {
      const dateStrA = a.type === 'commande' ? a.dateArrivagePrevue || '' : a.dateEcheance || '';
      const dateStrB = b.type === 'commande' ? b.dateArrivagePrevue || '' : b.dateEcheance || '';
      const dateA = new Date(dateStrA);
      const dateB = new Date(dateStrB);
      
      const dateDiff = sortDateAsc 
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
      
      if (dateDiff === 0) {
        const horaireA = a.horaire || '23:59';
        const horaireB = b.horaire || '23:59';
        return sortDateAsc 
          ? horaireA.localeCompare(horaireB)
          : horaireB.localeCompare(horaireA);
      }
      
      return dateDiff;
    });
  }, [commandes, commandeSearch, sortDateAsc]);

  const fetchClients = async () => {
    try {
      const response = await api.get('/api/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const checkNotifications = () => {
    const now = new Date();
    commandes.forEach((commande) => {
      if (commande.type === 'commande' && commande.statut === 'arrive' && !commande.notificationEnvoyee) {
        toast({
          title: '📦 Produit arrivé!',
          description: `Contacter ${commande.clientNom} (${commande.clientPhone})`,
        });
        updateNotificationStatus(commande.id);
      }
      
      if (commande.type === 'reservation' && commande.dateEcheance) {
        const echeance = new Date(commande.dateEcheance);
        if (now >= echeance && !commande.notificationEnvoyee) {
          toast({
            title: '⏰ Réservation échue!',
            description: `Demander à ${commande.clientNom} s'il veut toujours ce produit`,
          });
          updateNotificationStatus(commande.id);
        }
      }
    });
  };

  const updateNotificationStatus = async (id: string) => {
    try {
      await api.put(`/api/commandes/${id}`, { notificationEnvoyee: true });
      fetchCommandes();
    } catch (error) {
      console.error('Error updating notification status:', error);
    }
  };

  const filteredClients = useMemo(() => {
    if (clientSearch.length < 3) return [];
    return clients.filter(client => 
      client.nom.toLowerCase().includes(clientSearch.toLowerCase())
    );
  }, [clientSearch, clients]);

  const filteredProducts = useMemo(() => {
    if (productSearch.length < 3) return [];
    
    const usedProductNames = new Set<string>();
    commandes.forEach(commande => {
      if (editingCommande && commande.id === editingCommande.id) return;
      if (commande.statut === 'valide' || commande.statut === 'annule') return;
      
      commande.produits.forEach(produit => {
        usedProductNames.add(produit.nom.toLowerCase());
      });
    });
    
    return products.filter(product => {
      const matchesSearch = product.description.toLowerCase().includes(productSearch.toLowerCase());
      const isNotUsed = !usedProductNames.has(product.description.toLowerCase());
      const hasStock = product.quantity > 0;
      return matchesSearch && isNotUsed && hasStock;
    });
  }, [productSearch, products, commandes, editingCommande]);

  const handleClientSelect = (client: Client) => {
    setClientNom(client.nom);
    setClientPhone(client.phone);
    setClientAddress(client.adresse);
    setClientSearch(client.nom);
    setShowClientSuggestions(false);
  };

  const handleProductSelect = (product: Product) => {
    setProduitNom(product.description);
    setPrixUnitaire(product.purchasePrice.toString());
    setProductSearch(product.description);
    setShowProductSuggestions(false);
    setSelectedProduct(product);
  };

  const isFormValid = () => {
    return (
      clientNom.trim() !== '' &&
      clientPhone.trim() !== '' &&
      clientAddress.trim() !== '' &&
      produitsListe.length > 0 &&
      (type === 'commande' ? dateArrivagePrevue.trim() !== '' : dateEcheance.trim() !== '')
    );
  };

  const resetForm = () => {
    setClientNom('');
    setClientPhone('');
    setClientAddress('');
    setProduitNom('');
    setPrixUnitaire('');
    setQuantite('1');
    setPrixVente('');
    setDateArrivagePrevue('');
    setDateEcheance('');
    setHoraire('');
    setType('commande');
    setClientSearch('');
    setProductSearch('');
    setProduitsListe([]);
    setEditingCommande(null);
    setSelectedProduct(null);
  };

  const resetProductFields = () => {
    setProduitNom('');
    setPrixUnitaire('');
    setQuantite('1');
    setPrixVente('');
    setProductSearch('');
    setEditingProductIndex(null);
    setSelectedProduct(null);
  };

  const handleAddProduit = () => {
    if (!produitNom.trim() || !prixUnitaire.trim() || !quantite.trim() || !prixVente.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs du produit',
        className: "bg-app-red text-white",
        variant: 'destructive',
      });
      return;
    }

    const quantiteInt = parseInt(quantite);
    const existingProduct = products.find(p => p.description.toLowerCase() === produitNom.toLowerCase());
    
    if (existingProduct) {
      if (existingProduct.quantity <= 0) {
        toast({
          title: 'Stock insuffisant',
          description: `${produitNom} n'a plus de stock disponible (stock: ${existingProduct.quantity})`,
          className: "bg-app-red text-white",
          variant: 'destructive',
        });
        return;
      }
      
      if (quantiteInt > existingProduct.quantity) {
        toast({
          title: 'Quantité insuffisante',
          description: `Stock disponible pour ${produitNom}: ${existingProduct.quantity} unités`,
          className: "bg-app-red text-white",
          variant: 'destructive',
        });
        return;
      }
    }

    const nouveauProduit: CommandeProduit = {
      nom: produitNom,
      prixUnitaire: parseFloat(prixUnitaire),
      quantite: quantiteInt,
      prixVente: parseFloat(prixVente),
    };

    if (editingProductIndex !== null) {
      const nouveauxProduits = [...produitsListe];
      nouveauxProduits[editingProductIndex] = nouveauProduit;
      setProduitsListe(nouveauxProduits);
      setEditingProductIndex(null);
      
      toast({
        title: 'Produit modifié',
        description: `${nouveauProduit.nom} a été mis à jour`,
      });
    } else {
      setProduitsListe([...produitsListe, nouveauProduit]);
      
      toast({
        title: 'Produit ajouté',
        description: `${nouveauProduit.nom} a été ajouté au panier`,
      });
    }
    
    resetProductFields();
  };

  const handleEditProduit = (index: number) => {
    const produit = produitsListe[index];
    setProduitNom(produit.nom);
    setPrixUnitaire(produit.prixUnitaire.toString());
    setQuantite(produit.quantite.toString());
    setPrixVente(produit.prixVente.toString());
    setProductSearch(produit.nom);
    setEditingProductIndex(index);
    
    const productFromList = products.find(p => p.description.toLowerCase() === produit.nom.toLowerCase());
    setSelectedProduct(productFromList || null);
    
    toast({
      title: 'Mode édition',
      description: 'Modifiez les champs et cliquez sur "Ajouter ce produit" pour sauvegarder',
    });
  };

  const handleRemoveProduit = (index: number) => {
    const nouveauxProduits = produitsListe.filter((_, i) => i !== index);
    setProduitsListe(nouveauxProduits);
    
    if (editingProductIndex === index) {
      setEditingProductIndex(null);
      resetProductFields();
    } else if (editingProductIndex !== null && editingProductIndex > index) {
      setEditingProductIndex(editingProductIndex - 1);
    }
    
    toast({
      title: 'Produit retiré',
      description: 'Le produit a été retiré du panier',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs et ajouter au moins un produit',
        className: "bg-app-red text-white",
        variant: 'destructive',
      });
      return;
    }

    const commandeData: Partial<Commande> = {
      clientNom,
      clientPhone,
      clientAddress,
      type,
      produits: produitsListe,
      dateCommande: new Date().toISOString(),
      statut: type === 'commande' ? 'en_route' : 'en_attente',
    };

    if (type === 'commande') {
      commandeData.dateArrivagePrevue = dateArrivagePrevue;
    } else {
      commandeData.dateEcheance = dateEcheance;
    }
    
    if (horaire) {
      commandeData.horaire = horaire;
    }

    try {
      const existingClient = clients.find(c => c.nom.toLowerCase() === clientNom.toLowerCase());
      if (!existingClient) {
        await api.post('/api/clients', {
          nom: clientNom,
          phone: clientPhone,
          adresse: clientAddress
        });
        await fetchClients();
      }

      for (const produit of produitsListe) {
        const existingProduct = products.find(p => p.description.toLowerCase() === produit.nom.toLowerCase());
        if (!existingProduct) {
          await api.post('/api/products', {
            description: produit.nom,
            purchasePrice: produit.prixUnitaire,
            quantity: produit.quantite
          });
        }
      }
      await fetchProducts();

      if (editingCommande) {
        await api.put(`/api/commandes/${editingCommande.id}`, commandeData);
        
        if (type === 'reservation' && dateEcheance && horaire) {
          const updatedCommande = { ...editingCommande, ...commandeData } as Commande;
          try {
            await rdvFromReservationService.updateRdvFromCommande(updatedCommande);
          } catch (err) {
            console.error('Erreur mise à jour RDV:', err);
          }
        }
        
        toast({
          title: 'Succès',
          description: 'Commande modifiée avec succès',
          className: "bg-app-green text-white",
        });
      } else {
        const response = await api.post('/api/commandes', commandeData);
        const newCommande = response.data as Commande;
        
        if (type === 'reservation' && dateEcheance && horaire) {
          setPendingReservationForRdv(newCommande);
          setRdvTitre('');
          setRdvDescription('');
          setShowRdvConfirmDialog(true);
        }
        
        toast({
          title: 'Succès',
          description: 'Commande ajoutée avec succès',
          className: "bg-app-green text-white",
        });
      }
      fetchCommandes();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving commande:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder la commande',
        className: "bg-app-red text-white",
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (commande: Commande) => {
    setEditingCommande(commande);
    setClientNom(commande.clientNom);
    setClientPhone(commande.clientPhone);
    setClientAddress(commande.clientAddress);
    setType(commande.type);
    setProduitsListe(commande.produits);
    setDateArrivagePrevue(commande.dateArrivagePrevue || '');
    setDateEcheance(commande.dateEcheance || '');
    setHoraire(commande.horaire || '');
    setClientSearch(commande.clientNom);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      try {
        await rdvFromReservationService.deleteRdvFromCommande(id);
      } catch (err) {
        console.error('Erreur suppression RDV lié:', err);
      }
      
      await api.delete(`/api/commandes/${id}`);
      toast({
        title: 'Succès',
        description: 'Commande supprimée avec succès',
        className: "bg-app-green text-white",
      });
      fetchCommandes();
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting commande:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la commande',
        className: "bg-app-red text-white",
        variant: 'destructive',
      });
    }
  };

  const handleStatusChange = async (id: string, newStatus: CommandeStatut | 'reporter') => {
    const commande = commandes.find(c => c.id === id);
    if (!commande) return;
    
    if (newStatus === 'valide') {
      setValidatingId(id);
      return;
    }
    
    if (newStatus === 'annule') {
      setCancellingId(id);
      return;
    }
    
    if (newStatus === 'reporter') {
      const currentDate = commande.type === 'commande' ? commande.dateArrivagePrevue : commande.dateEcheance;
      setReporterDate(currentDate || '');
      setReporterHoraire(commande.horaire || '');
      setReporterCommandeId(id);
      setReporterModalOpen(true);
      return;
    }
    
    if (commande.statut === 'valide' && commande.saleId) {
      try {
        await api.delete(`/api/sales/${commande.saleId}`);
        console.log('✅ Vente supprimée de sales.json, quantité restaurée');
        
        await api.put(`/api/commandes/${id}`, { statut: newStatus, saleId: null });
        
        toast({
          title: 'Succès',
          description: 'Statut mis à jour et vente annulée',
          className: "bg-app-green text-white",
        });
        
        await Promise.all([fetchCommandes(), fetchProducts()]);
        return;
      } catch (error) {
        console.error('Error reverting validation:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de mettre à jour le statut',
          className: "bg-app-red text-white",
          variant: 'destructive',
        });
        return;
      }
    }
    
    try {
      await api.put(`/api/commandes/${id}`, { statut: newStatus });
      
      if (commande.type === 'reservation') {
        await reservationRdvSyncService.syncRdvStatus(id, newStatus as CommandeStatut);
        console.log(`✅ Sync RDV: Réservation ${id} → Statut ${newStatus}`);
      }
      
      toast({
        title: 'Succès',
        description: 'Statut mis à jour',
        className: "bg-app-green text-white",
      });
      fetchCommandes();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut',
        className: "bg-app-red text-white",
        variant: 'destructive',
      });
    }
  };

  const confirmCancellation = async () => {
    if (!cancellingId) return;
    
    const commande = commandes.find(c => c.id === cancellingId);
    
    try {
      if (commande && commande.statut === 'valide' && commande.saleId) {
        await api.delete(`/api/sales/${commande.saleId}`);
        console.log('✅ Vente supprimée de sales.json lors de l\'annulation');
      }
      
      await api.put(`/api/commandes/${cancellingId}`, { statut: 'annule', saleId: null });
      
      if (commande && commande.type === 'reservation') {
        try {
          await api.put(`/api/rdv/by-commande/${cancellingId}`, {
            statut: 'annule'
          });
          console.log('✅ RDV marqué comme annulé');
        } catch (rdvError) {
          console.log('RDV non trouvé:', rdvError);
        }
      }
      
      toast({
        title: 'Succès',
        description: 'Commande annulée avec succès',
        className: "bg-app-green text-white",
      });
      await Promise.all([fetchCommandes(), fetchProducts()]);
      setCancellingId(null);
    } catch (error) {
      console.error('Error cancelling:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'annuler la commande',
        className: "bg-app-red text-white",
        variant: 'destructive',
      });
    }
  };

  const confirmValidation = async () => {
    if (!validatingId) return;
    
    const commandeToValidate = commandes.find(c => c.id === validatingId);
    if (!commandeToValidate) return;
    
    try {
      for (const p of commandeToValidate.produits) {
        const existingProduct = products.find(prod => prod.description.toLowerCase() === p.nom.toLowerCase());
        if (existingProduct && existingProduct.quantity < p.quantite) {
          toast({
            title: 'Stock insuffisant',
            description: `Stock disponible pour ${p.nom}: ${existingProduct.quantity} unités (demandé: ${p.quantite})`,
            className: "bg-app-red text-white",
            variant: 'destructive',
          });
          return;
        }
      }
      
      const today = new Date().toISOString().split('T')[0];
      
      const saleProducts = [];
      for (const p of commandeToValidate.produits) {
        let product = products.find(prod => prod.description.toLowerCase() === p.nom.toLowerCase());
        
        if (!product) {
          const newProductResponse = await api.post('/api/products', {
            description: p.nom,
            purchasePrice: p.prixUnitaire,
            quantity: p.quantite
          });
          product = newProductResponse.data;
        }
        
        const productProfit = (p.prixVente - p.prixUnitaire) * p.quantite;
        const totalPurchasePrice = p.prixUnitaire * p.quantite;
        const totalSellingPrice = p.prixVente * p.quantite;
        
        saleProducts.push({
          productId: product.id,
          description: p.nom,
          quantitySold: p.quantite,
          purchasePrice: totalPurchasePrice,
          sellingPrice: totalSellingPrice,
          profit: productProfit,
          deliveryFee: 0,
          deliveryLocation: "Saint-Denis"
        });
      }
      
      const totalPurchasePrice = commandeToValidate.produits.reduce((sum, p) => sum + (p.prixUnitaire * p.quantite), 0);
      const totalSellingPrice = commandeToValidate.produits.reduce((sum, p) => sum + (p.prixVente * p.quantite), 0);
      const totalProfit = totalSellingPrice - totalPurchasePrice;
      
      const saleData = {
        date: today,
        products: saleProducts,
        totalPurchasePrice,
        totalSellingPrice,
        totalProfit,
        clientName: commandeToValidate.clientNom,
        clientAddress: commandeToValidate.clientAddress,
        clientPhone: commandeToValidate.clientPhone,
        reste: 0,
        nextPaymentDate: null
      };
      
      console.log('✅ Validation commande - Données à enregistrer dans sales.json:', saleData);
      
      if (commandeToValidate.type === 'reservation') {
        try {
          await api.put(`/api/rdv/by-commande/${validatingId}`, {
            statut: 'confirme'
          });
          console.log('✅ ÉTAPE 1 - RDV synchronisé: statut confirme');
        } catch (rdvError) {
          console.log('RDV non trouvé ou erreur sync:', rdvError);
        }
      }
      
      const saleResponse = await api.post('/api/sales', saleData);
      const createdSale = saleResponse.data;
      console.log('✅ ÉTAPE 2 - Vente enregistrée dans sales.json');
      
      await api.put(`/api/commandes/${validatingId}`, { 
        statut: 'valide',
        saleId: createdSale.id
      });
      console.log('✅ ÉTAPE 3 - Commande marquée comme validée');
      
      toast({
        title: 'Succès',
        description: 'Commande validée et enregistrée comme vente',
        className: "bg-app-green text-white",
      });
      
      await Promise.all([fetchCommandes(), fetchProducts()]);
      setValidatingId(null);
    } catch (error) {
      console.error('❌ Error validating:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de valider la commande',
        className: "bg-app-red text-white",
        variant: 'destructive',
      });
    }
  };

  const handleCreateRdvFromReservation = async (titre: string, description: string) => {
    if (!pendingReservationForRdv) return;
    
    setIsRdvLoading(true);
    
    try {
      const heureDebut = pendingReservationForRdv.horaire || '09:00';
      const [hours, minutes] = heureDebut.split(':').map(Number);
      const endHours = (hours + 1) % 24;
      const heureFin = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      const rdvData = {
        titre: titre || `Réservation pour ${pendingReservationForRdv.clientNom}`,
        description: description || '',
        clientNom: pendingReservationForRdv.clientNom,
        clientTelephone: pendingReservationForRdv.clientPhone,
        clientAdresse: pendingReservationForRdv.clientAddress,
        date: pendingReservationForRdv.dateEcheance,
        heureDebut,
        heureFin,
        lieu: pendingReservationForRdv.clientAddress,
        statut: 'planifie',
        notes: `Créé depuis une réservation`,
        produits: pendingReservationForRdv.produits.map(p => ({
          nom: p.nom,
          quantite: p.quantite,
          prixUnitaire: p.prixUnitaire,
          prixVente: p.prixVente,
        })),
        commandeId: pendingReservationForRdv.id,
      };
      
      await api.post('/api/rdv', rdvData);
      
      toast({
        title: '📅 Rendez-vous créé',
        description: `Le RDV "${rdvData.titre}" a été créé pour le ${pendingReservationForRdv.dateEcheance} à ${heureDebut}`,
        className: "bg-app-green text-white",
      });
    } catch (err) {
      console.error('Erreur création RDV:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le rendez-vous',
        className: "bg-app-red text-white",
        variant: 'destructive',
      });
    } finally {
      setIsRdvLoading(false);
      setShowRdvFormModal(false);
      setPendingReservationForRdv(null);
      setRdvTitre('');
      setRdvDescription('');
    }
  };

  const handleDeclineRdv = () => {
    setShowRdvConfirmDialog(false);
    setPendingReservationForRdv(null);
    setRdvTitre('');
    setRdvDescription('');
  };

  const handleAcceptRdv = () => {
    setShowRdvConfirmDialog(false);
    setShowRdvFormModal(true);
  };

  const handleCloseRdvModal = () => {
    setShowRdvFormModal(false);
    setPendingReservationForRdv(null);
    setRdvTitre('');
    setRdvDescription('');
  };

  const getStatusOptions = (type: 'commande' | 'reservation') => {
    if (type === 'commande') {
      return [
        { value: 'en_route', label: '📦 En Route' },
        { value: 'arrive', label: '✅ Arrivé' },
        { value: 'valide', label: '💎 Validé' },
        { value: 'annule', label: '❌ Annulé' },
        { value: 'reporter', label: '📅 Reporter' },
      ];
    }
    return [
      { value: 'en_attente', label: '⏳ En Attente' },
      { value: 'valide', label: '💎 Validé' },
      { value: 'annule', label: '❌ Annulé' },
      { value: 'reporter', label: '📅 Reporter' },
    ];
  };

  const handleReporterConfirm = async () => {
    if (!reporterCommandeId || !reporterDate) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner une date',
        className: "bg-app-red text-white",
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const commande = commandes.find(c => c.id === reporterCommandeId);
      if (!commande) return;
      
      const updateData: any = {
        statut: 'reporter',
        horaire: reporterHoraire || undefined
      };
      
      if (commande.type === 'commande') {
        updateData.dateArrivagePrevue = reporterDate;
      } else {
        updateData.dateEcheance = reporterDate;
      }
      
      await api.put(`/api/commandes/${reporterCommandeId}`, updateData);
      
      if (commande.type === 'reservation') {
        try {
          const heureDebut = reporterHoraire || '09:00';
          const [h, m] = heureDebut.split(':').map(Number);
          const endH = (h + 1) % 24;
          const heureFin = `${endH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
          
          await api.put(`/api/rdv/by-commande/${reporterCommandeId}`, {
            date: reporterDate,
            heureDebut,
            heureFin,
            statut: 'reporte'
          });
          console.log('✅ RDV synchronisé: statut reporte');
        } catch (rdvError) {
          console.log('RDV non trouvé ou erreur:', rdvError);
        }
      }
      
      toast({
        title: 'Succès',
        description: `La date a été reportée au ${new Date(reporterDate).toLocaleDateString('fr-FR')}${reporterHoraire ? ' à ' + reporterHoraire : ''}`,
        className: "bg-app-green text-white",
      });
      
      fetchCommandes();
      setReporterModalOpen(false);
      setReporterCommandeId(null);
      setReporterDate('');
      setReporterHoraire('');
    } catch (error) {
      console.error('Error updating date:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de reporter la date',
        className: "bg-app-red text-white",
        variant: 'destructive',
      });
    }
  };

  const commandesForExportDate = useMemo(() => {
    if (!exportDate) return [];
    return commandes.filter(c => {
      const dateStr = c.type === 'commande' ? c.dateArrivagePrevue : c.dateEcheance;
      return dateStr === exportDate;
    }).sort((a, b) => {
      const horaireA = a.horaire || '23:59';
      const horaireB = b.horaire || '23:59';
      return horaireA.localeCompare(horaireB);
    });
  }, [commandes, exportDate]);

  const handleExportPDF = () => {
    if (commandesForExportDate.length === 0) {
      toast({
        title: 'Aucune donnée',
        description: `Cette date: ${new Date(exportDate).toLocaleDateString('fr-FR')} n'a aucune réservation ou commande`,
        className: "bg-app-red text-white",
        variant: 'destructive',
      });
      return;
    }

    const doc = new jsPDF('portrait', 'mm', 'a4');
    const dateFormatted = new Date(exportDate).toLocaleDateString('fr-FR', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Commandes & Réservations', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${dateFormatted}`, 105, 28, { align: 'center' });
    doc.text(`Total: ${commandesForExportDate.length} commande(s)/réservation(s)`, 105, 35, { align: 'center' });

    const tableData = commandesForExportDate.map(c => {
      const produits = c.produits.map(p => `${p.nom} (Qté: ${p.quantite})`).join('\n');
      const prixDetail = c.produits.map(p => `${p.prixVente}€ x ${p.quantite}`).join('\n');
      const total = c.produits.reduce((sum, p) => sum + (p.prixVente * p.quantite), 0).toFixed(2);
      const dateEch = c.type === 'commande' 
        ? new Date(c.dateArrivagePrevue || '').toLocaleDateString('fr-FR')
        : new Date(c.dateEcheance || '').toLocaleDateString('fr-FR');
      const horaire = c.horaire || '-';
      
      return [
        `${c.clientNom}\n${c.clientAddress}`,
        c.clientPhone,
        produits,
        `${prixDetail}\n\nTotal: ${total}€`,
        `${dateEch}\n${horaire}`
      ];
    });

    autoTable(doc, {
      startY: 42,
      head: [['Client', 'Contact', 'Produit', 'Prix', 'Date/Horaire']],
      body: tableData,
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak',
        valign: 'top'
      },
      headStyles: {
        fillColor: [147, 51, 234],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 45 },
        1: { cellWidth: 25 },
        2: { cellWidth: 45 },
        3: { cellWidth: 35 },
        4: { cellWidth: 30 }
      },
      alternateRowStyles: {
        fillColor: [245, 243, 255]
      }
    });

    const fileName = `commandes_${exportDate}.pdf`;
    doc.save(fileName);

    toast({
      title: 'Succès',
      description: `L'exportation a été effectuée avec succès`,
      className: "bg-app-green text-white",
    });
    
    setExportDialogOpen(false);
    setExportDate('');
  };

  const totalActiveCommandes = commandes.filter(c => c.statut !== 'valide' && c.statut !== 'annule').length;

  if (isLoading) {
    return (
      <Layout>
        <PremiumLoading 
          text="Bienvenue sur La page commandes ou reservation"
          size="xl"
          overlay={true}
          variant="default"
        />
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Header Premium */}
      <CommandesHero />

      <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* Barre de recherche et actions */}
        <CommandesSearchBar
          commandeSearch={commandeSearch}
          setCommandeSearch={setCommandeSearch}
          exportDialogOpen={exportDialogOpen}
          setExportDialogOpen={setExportDialogOpen}
          exportDate={exportDate}
          setExportDate={setExportDate}
          commandesForExportDate={commandesForExportDate}
          handleExportPDF={handleExportPDF}
          onNewCommande={() => setIsDialogOpen(true)}
        />

        {/* Dialog Nouvelle Commande */}
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-purple-50/40 to-pink-50/40 dark:from-gray-900 dark:via-purple-900/30 dark:to-pink-900/30 backdrop-blur-2xl border-2 border-purple-300/50 dark:border-purple-600/50 shadow-[0_20px_70px_rgba(168,85,247,0.4)]">
            <DialogHeader className="border-b-2 border-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 dark:from-purple-700 dark:via-pink-700 dark:to-indigo-700 pb-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Crown className="h-8 w-8 text-yellow-500 animate-pulse" />
                <Sparkles className="h-6 w-6 text-pink-500" />
              </div>
              <DialogTitle className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent text-center">
                {editingCommande ? (
                  <span className="flex items-center justify-center gap-2">
                    <Edit className="h-6 w-6 text-purple-600" />
                    Modifier Commande Premium
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Gift className="h-6 w-6 text-pink-600" />
                    Nouvelle Commande Elite
                  </span>
                )}
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground mt-3 text-center font-medium">
                ✨ Créez une expérience d'achat exclusive et luxueuse ✨
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              {/* Section Client Premium */}
              <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 border-2 border-blue-300 dark:border-blue-700 shadow-[0_8px_30px_rgba(59,130,246,0.3)]">
                <h3 className="font-black text-xl flex items-center gap-3 text-blue-700 dark:text-blue-300">
                  <span className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm shadow-lg">
                    <Crown className="h-5 w-5" />
                  </span>
                  <span className="flex items-center gap-2">
                    Client Premium
                    <Star className="h-5 w-5 text-yellow-500" />
                  </span>
                </h3>
                
                <div className="relative">
                  <Label htmlFor="clientNom" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                    👤 Nom du Client
                  </Label>
                  <Input
                    id="clientNom"
                    value={clientSearch}
                    onChange={(e) => {
                      setClientSearch(e.target.value);
                      setClientNom(e.target.value);
                      setShowClientSuggestions(e.target.value.length >= 3);
                    }}
                    placeholder="Saisir au moins 3 caractères..."
                    className="border-2 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-500 bg-white dark:bg-gray-900 shadow-sm"
                    required
                  />
                  {showClientSuggestions && filteredClients.length > 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-purple-300 dark:border-purple-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                      {filteredClients.map((client) => (
                        <div
                          key={client.id}
                          className="p-3 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 cursor-pointer transition-all duration-200 border-b border-gray-100 dark:border-gray-700 last:border-0"
                          onClick={() => handleClientSelect(client)}
                        >
                          <div className="font-semibold text-gray-900 dark:text-white">{client.nom}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                            📱 {client.phone}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientPhone" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                      📞 Téléphone
                    </Label>
                    <Input
                      id="clientPhone"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="Numéro de téléphone"
                      className="border-2 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-500 bg-white dark:bg-gray-900 shadow-sm"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="clientAddress" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                      🏠 Adresse
                    </Label>
                    <Input
                      id="clientAddress"
                      value={clientAddress}
                      onChange={(e) => setClientAddress(e.target.value)}
                      placeholder="Adresse complète"
                      className="border-2 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-500 bg-white dark:bg-gray-900 shadow-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section Produit Premium */}
              <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-rose-900/30 border-2 border-purple-300 dark:border-purple-700 shadow-[0_8px_30px_rgba(168,85,247,0.3)]">
                <h3 className="font-black text-xl flex items-center gap-3 text-purple-700 dark:text-purple-300">
                  <span className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm shadow-lg">
                    <ShoppingCart className="h-5 w-5" />
                  </span>
                  <span className="flex items-center gap-2">
                    Produits Elite
                    <Sparkles className="h-5 w-5 text-pink-500" />
                  </span>
                </h3>

                <div className="relative">
                  <Label htmlFor="produitNom" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                    📦 Nom du Produit
                  </Label>
                  <Input
                    id="produitNom"
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setProduitNom(e.target.value);
                      setShowProductSuggestions(e.target.value.length >= 3);
                    }}
                    placeholder="Saisir au moins 3 caractères..."
                    className="border-2 border-purple-300 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-500 bg-white dark:bg-gray-900 shadow-sm"
                  />
                  {showProductSuggestions && filteredProducts.length > 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-purple-300 dark:border-purple-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="p-3 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 cursor-pointer transition-all duration-200 border-b border-gray-100 dark:border-gray-700 last:border-0"
                          onClick={() => handleProductSelect(product)}
                        >
                          <div className="font-semibold text-gray-900 dark:text-white">{product.description}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                            <span>💰 {product.purchasePrice}€</span>
                            <span>📊 Stock: {product.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="prixUnitaire" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                      💵 Prix Unitaire (€)
                    </Label>
                    <Input
                      id="prixUnitaire"
                      type="number"
                      step="0.01"
                      value={prixUnitaire}
                      onChange={(e) => setPrixUnitaire(e.target.value)}
                      placeholder="Prix d'achat"
                      className="border-2 border-purple-300 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-500 bg-white dark:bg-gray-900 shadow-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="quantite" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                      📊 Quantité {selectedProduct && `(max: ${selectedProduct.quantity})`}
                    </Label>
                    <SaleQuantityInput
                      value={quantite}
                      onChange={setQuantite}
                      maxQuantity={selectedProduct?.quantity}
                      className="border-2 border-purple-300 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-500 bg-white dark:bg-gray-900 shadow-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="prixVente" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                      💎 Prix de Vente (€)
                    </Label>
                    <Input
                      id="prixVente"
                      type="number"
                      step="0.01"
                      value={prixVente}
                      onChange={(e) => setPrixVente(e.target.value)}
                      placeholder="Prix de vente"
                      className="border-2 border-purple-300 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-500 bg-white dark:bg-gray-900 shadow-sm"
                    />
                  </div>
                </div>

                <Button 
                  type="button"
                  onClick={handleAddProduit}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {editingProductIndex !== null ? 'Modifier ce produit' : 'Ajouter ce produit au panier'}
                </Button>

                {produitsListe.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      🛒 Panier ({produitsListe.length} produit{produitsListe.length > 1 ? 's' : ''})
                    </Label>
                    <div className="space-y-2">
                      {produitsListe.map((produit, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border-2 shadow-sm transition-all ${
                            editingProductIndex === index 
                              ? 'border-purple-500 dark:border-purple-400 ring-2 ring-purple-200 dark:ring-purple-800' 
                              : 'border-purple-200 dark:border-purple-700'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="font-semibold text-sm">
                              {produit.nom}
                              {editingProductIndex === index && (
                                <span className="ml-2 text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
                                  En édition
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Qté: {produit.quantite} | Prix unitaire: {produit.prixUnitaire}€ | Prix vente: {produit.prixVente}€
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditProduit(index)}
                              className="hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 rounded-xl transition-all duration-300"
                              title="Modifier ce produit"
                            >
                              <Edit className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveProduit(index)}
                              className="hover:bg-gradient-to-r hover:from-red-100 hover:to-rose-100 dark:hover:from-red-900/30 dark:hover:to-rose-900/30 rounded-xl transition-all duration-300"
                              title="Supprimer ce produit"
                            >
                              <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-sm font-semibold text-right text-purple-700 dark:text-purple-300">
                      Total: {produitsListe.reduce((sum, p) => sum + (p.prixVente * p.quantite), 0).toFixed(2)}€
                    </div>
                  </div>
                )}
              </div>

              {/* Section Détails Premium */}
              <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/30 dark:via-orange-900/30 dark:to-yellow-900/30 border-2 border-amber-300 dark:border-amber-700 shadow-[0_8px_30px_rgba(251,146,60,0.3)]">
                <h3 className="font-black text-xl flex items-center gap-3 text-amber-700 dark:text-amber-300">
                  <span className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white text-sm shadow-lg">
                    <Award className="h-5 w-5" />
                  </span>
                  <span className="flex items-center gap-2">
                    Détails Elite
                    <Zap className="h-5 w-5 text-orange-500" />
                  </span>
                </h3>
                
                <div>
                  <Label htmlFor="type" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                    🎯 Type
                  </Label>
                  <Select value={type} onValueChange={(value: 'commande' | 'reservation') => setType(value)}>
                    <SelectTrigger className="border-2 border-amber-300 dark:border-amber-700 focus:border-amber-500 dark:focus:border-amber-500 bg-white dark:bg-gray-900 shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="commande">📦 Commande</SelectItem>
                      <SelectItem value="reservation">🎫 Réservation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {type === 'commande' ? (
                  <div>
                    <Label htmlFor="dateArrivagePrevue" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                      📅 Date d'Arrivage Prévue
                    </Label>
                    <Input
                      id="dateArrivagePrevue"
                      type="date"
                      value={dateArrivagePrevue}
                      onChange={(e) => setDateArrivagePrevue(e.target.value)}
                      className="border-2 border-amber-300 dark:border-amber-700 focus:border-amber-500 dark:focus:border-amber-500 bg-white dark:bg-gray-900 shadow-sm"
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="dateEcheance" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                      ⏰ Date d'Échéance
                    </Label>
                    <Input
                      id="dateEcheance"
                      type="date"
                      value={dateEcheance}
                      onChange={(e) => setDateEcheance(e.target.value)}
                      className="border-2 border-amber-300 dark:border-amber-700 focus:border-amber-500 dark:focus:border-amber-500 bg-white dark:bg-gray-900 shadow-sm"
                      required
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="horaire" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                    🕐 Horaire (facultatif)
                  </Label>
                  <Input
                    id="horaire"
                    type="time"
                    value={horaire}
                    onChange={(e) => setHoraire(e.target.value)}
                    className="border-2 border-amber-300 dark:border-amber-700 focus:border-amber-500 dark:focus:border-amber-500 bg-white dark:bg-gray-900 shadow-sm"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-16 text-xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white shadow-[0_20px_60px_rgba(168,85,247,0.5)] hover:shadow-[0_20px_70px_rgba(236,72,153,0.6)] transform hover:-translate-y-2 hover:scale-105 transition-all duration-500 rounded-2xl border-2 border-white/20" 
                disabled={!isFormValid()}
              >
                <span className="flex items-center justify-center gap-3">
                  {editingCommande ? (
                    <>
                      <Edit className="h-6 w-6" />
                      Modifier la Commande Elite
                      <Sparkles className="h-6 w-6" />
                    </>
                  ) : (
                    <>
                      <Crown className="h-6 w-6 animate-pulse" />
                      Créer Commande Premium
                      <Star className="h-6 w-6" />
                    </>
                  )}
                </span>
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Tableau des commandes */}
        <CommandesTable
          filteredCommandes={filteredCommandes}
          totalActiveCommandes={totalActiveCommandes}
          commandeSearch={commandeSearch}
          sortDateAsc={sortDateAsc}
          setSortDateAsc={setSortDateAsc}
          handleEdit={handleEdit}
          handleStatusChange={handleStatusChange}
          setDeleteId={setDeleteId}
          getStatusOptions={getStatusOptions}
        />

        {/* Dialogs de confirmation */}
        <CommandesDialogs
          validatingId={validatingId}
          setValidatingId={setValidatingId}
          confirmValidation={confirmValidation}
          deleteId={deleteId}
          setDeleteId={setDeleteId}
          handleDelete={handleDelete}
          cancellingId={cancellingId}
          setCancellingId={setCancellingId}
          confirmCancellation={confirmCancellation}
          reporterModalOpen={reporterModalOpen}
          setReporterModalOpen={setReporterModalOpen}
          reporterDate={reporterDate}
          setReporterDate={setReporterDate}
          reporterHoraire={reporterHoraire}
          setReporterHoraire={setReporterHoraire}
          handleReporterConfirm={handleReporterConfirm}
        />

        {/* Modale Premium de confirmation pour créer un RDV */}
        <RdvConfirmationModal
          isOpen={showRdvConfirmDialog}
          onClose={handleDeclineRdv}
          onConfirm={handleAcceptRdv}
          reservation={pendingReservationForRdv ? {
            clientNom: pendingReservationForRdv.clientNom,
            dateEcheance: pendingReservationForRdv.dateEcheance || '',
            horaire: pendingReservationForRdv.horaire || '',
            clientAddress: pendingReservationForRdv.clientAddress,
          } : null}
        />

        {/* Modal Premium pour création de RDV depuis une réservation */}
        <RdvCreationModal
          isOpen={showRdvFormModal}
          onClose={handleCloseRdvModal}
          onConfirm={handleCreateRdvFromReservation}
          reservation={pendingReservationForRdv ? {
            id: pendingReservationForRdv.id,
            clientNom: pendingReservationForRdv.clientNom,
            clientPhone: pendingReservationForRdv.clientPhone,
            clientAddress: pendingReservationForRdv.clientAddress,
            dateEcheance: pendingReservationForRdv.dateEcheance || '',
            horaire: pendingReservationForRdv.horaire || '',
            produits: pendingReservationForRdv.produits,
          } : null}
          isLoading={isRdvLoading}
        />
      </div>
    </Layout>
  );
}

export default CommandesPage;
