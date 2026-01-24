const fs = require('fs');
const path = require('path');
const Product = require('./Product');

const nouvelleAchatPath = path.join(__dirname, '../db/nouvelle_achat.json');

// Initialiser le fichier s'il n'existe pas
if (!fs.existsSync(nouvelleAchatPath)) {
  fs.writeFileSync(nouvelleAchatPath, JSON.stringify([], null, 2));
}

const NouvelleAchat = {
  // Récupérer tous les achats
  getAll: () => {
    try {
      const data = fs.readFileSync(nouvelleAchatPath, 'utf8');
      const achats = JSON.parse(data);
      console.log(`📦 Retrieved ${achats.length} achats from database`);
      return achats;
    } catch (error) {
      console.error("❌ Error reading achats:", error);
      return [];
    }
  },

  // Récupérer un achat par ID
  getById: (id) => {
    try {
      const data = fs.readFileSync(nouvelleAchatPath, 'utf8');
      const achats = JSON.parse(data);
      return achats.find(achat => achat.id === id) || null;
    } catch (error) {
      console.error("❌ Error finding achat by id:", error);
      return null;
    }
  },

  // Récupérer les achats par mois et année
  getByMonthYear: (month, year) => {
    try {
      const data = fs.readFileSync(nouvelleAchatPath, 'utf8');
      const achats = JSON.parse(data);
      
      return achats.filter(achat => {
        const date = new Date(achat.date);
        return date.getMonth() + 1 === month && date.getFullYear() === year;
      });
    } catch (error) {
      console.error("❌ Error filtering achats by month/year:", error);
      return [];
    }
  },

  // Récupérer les achats par année
  getByYear: (year) => {
    try {
      const data = fs.readFileSync(nouvelleAchatPath, 'utf8');
      const achats = JSON.parse(data);
      
      return achats.filter(achat => {
        const date = new Date(achat.date);
        return date.getFullYear() === year;
      });
    } catch (error) {
      console.error("❌ Error filtering achats by year:", error);
      return [];
    }
  },

  /**
   * Créer un nouvel achat et gérer le produit associé
   * 
   * LOGIQUE DE FONCTIONNEMENT :
   * 1. Si productId est fourni et le produit existe → mise à jour du stock
   * 2. Si productId est fourni mais le produit n'existe pas → création du produit
   * 3. Si productId n'est pas fourni → création d'un nouveau produit
   * 4. Dans tous les cas → enregistrement de l'achat dans nouvelle_achat.json
   * 
   * @param {Object} achatData - Données de l'achat
   * @param {string} achatData.productId - ID du produit (optionnel)
   * @param {string} achatData.productDescription - Description du produit (obligatoire)
   * @param {number} achatData.purchasePrice - Prix d'achat unitaire (obligatoire)
   * @param {number} achatData.quantity - Quantité achetée (obligatoire)
   * @param {string} achatData.fournisseur - Nom du fournisseur (optionnel)
   * @param {string} achatData.caracteristiques - Caractéristiques du produit (optionnel)
   * @param {string} achatData.date - Date de l'achat (optionnel, défaut: maintenant)
   * @returns {Object|null} L'achat créé ou null en cas d'erreur
   */
  create: (achatData) => {
    try {
      console.log('📝 Creating new achat:', achatData);
      
      // Lire les achats existants
      const data = fs.readFileSync(nouvelleAchatPath, 'utf8');
      const achats = JSON.parse(data);
      
      // Variable pour stocker l'ID du produit final
      let finalProductId = achatData.productId;
      
      // ========================================
      // GESTION DU PRODUIT
      // ========================================
      if (achatData.productId) {
        // CAS 1: Un productId est fourni
        const existingProduct = Product.getById(achatData.productId);
        
        if (existingProduct) {
          // CAS 1A: Le produit existe → mise à jour du stock
          console.log('📦 Updating existing product stock...');
          const updatedProductData = {
            description: achatData.productDescription || existingProduct.description,
            purchasePrice: Number(achatData.purchasePrice) || existingProduct.purchasePrice,
            quantity: existingProduct.quantity + Number(achatData.quantity)
          };
          
          Product.update(achatData.productId, updatedProductData);
          console.log('✅ Product updated with new stock:', updatedProductData);
        } else {
          // CAS 1B: Le productId est fourni mais le produit n'existe pas → création
          console.log('🆕 Product ID provided but product not found, creating new product...');
          const newProduct = Product.create({
            description: achatData.productDescription,
            purchasePrice: Number(achatData.purchasePrice),
            quantity: Number(achatData.quantity),
            sellingPrice: 0 // Prix de vente à définir ultérieurement
          });
          
          if (newProduct) {
            finalProductId = newProduct.id;
            console.log('✅ New product created:', newProduct);
          }
        }
      } else {
        // CAS 2: Pas de productId fourni → vérifier si le produit existe par description
        console.log('🔍 No productId provided, checking if product exists by description...');
        
        // Rechercher un produit existant avec la même description
        const allProducts = Product.getAll();
        const existingProductByDescription = allProducts.find(
          p => p.description.toLowerCase().trim() === achatData.productDescription.toLowerCase().trim()
        );
        
        if (existingProductByDescription) {
          // CAS 2A: Un produit avec la même description existe → mise à jour
          console.log('📦 Found existing product by description, updating stock...');
          finalProductId = existingProductByDescription.id;
          
          const updatedProductData = {
            purchasePrice: Number(achatData.purchasePrice) || existingProductByDescription.purchasePrice,
            quantity: existingProductByDescription.quantity + Number(achatData.quantity)
          };
          
          Product.update(existingProductByDescription.id, updatedProductData);
          console.log('✅ Existing product updated:', updatedProductData);
        } else {
          // CAS 2B: Aucun produit correspondant → création d'un nouveau produit
          console.log('🆕 No matching product found, creating new product in products.json...');
          const newProduct = Product.create({
            description: achatData.productDescription,
            purchasePrice: Number(achatData.purchasePrice),
            quantity: Number(achatData.quantity),
            sellingPrice: 0 // Prix de vente à définir ultérieurement
          });
          
          if (newProduct) {
            finalProductId = newProduct.id;
            console.log('✅ New product created in products.json:', newProduct);
          } else {
            console.error('❌ Failed to create new product');
          }
        }
      }
      
      // ========================================
      // CRÉATION DE L'ENREGISTREMENT D'ACHAT
      // ========================================
      const newAchat = {
        id: Date.now().toString(),
        date: achatData.date || new Date().toISOString(),
        productId: finalProductId, // ID du produit (existant ou nouvellement créé)
        productDescription: achatData.productDescription,
        purchasePrice: Number(achatData.purchasePrice),
        quantity: Number(achatData.quantity),
        fournisseur: achatData.fournisseur || '',
        caracteristiques: achatData.caracteristiques || '',
        totalCost: Number(achatData.purchasePrice) * Number(achatData.quantity),
        type: 'achat_produit'
      };
      
      // Enregistrer l'achat
      achats.push(newAchat);
      fs.writeFileSync(nouvelleAchatPath, JSON.stringify(achats, null, 2));
      
      console.log('✅ Achat created successfully in nouvelle_achat.json:', newAchat);
      return newAchat;
    } catch (error) {
      console.error("❌ Error creating achat:", error);
      return null;
    }
  },

  // Mettre à jour un achat
  update: (id, achatData) => {
    try {
      console.log(`📝 Updating achat ${id}:`, achatData);
      
      const data = fs.readFileSync(nouvelleAchatPath, 'utf8');
      let achats = JSON.parse(data);
      
      const achatIndex = achats.findIndex(achat => achat.id === id);
      if (achatIndex === -1) {
        console.log(`❌ Achat not found for update: ${id}`);
        return null;
      }
      
      // Calculer le nouveau totalCost
      const updatedData = {
        ...achats[achatIndex],
        ...achatData,
        totalCost: Number(achatData.purchasePrice || achats[achatIndex].purchasePrice) * 
                   Number(achatData.quantity || achats[achatIndex].quantity)
      };
      
      achats[achatIndex] = updatedData;
      fs.writeFileSync(nouvelleAchatPath, JSON.stringify(achats, null, 2));
      
      console.log('✅ Achat updated successfully:', updatedData);
      return updatedData;
    } catch (error) {
      console.error("❌ Error updating achat:", error);
      return null;
    }
  },

  // Supprimer un achat
  delete: (id) => {
    try {
      console.log(`🗑️ Deleting achat ${id}`);
      
      const data = fs.readFileSync(nouvelleAchatPath, 'utf8');
      let achats = JSON.parse(data);
      
      const achatIndex = achats.findIndex(achat => achat.id === id);
      if (achatIndex === -1) {
        console.log(`❌ Achat not found for deletion: ${id}`);
        return false;
      }
      
      achats.splice(achatIndex, 1);
      fs.writeFileSync(nouvelleAchatPath, JSON.stringify(achats, null, 2));
      
      console.log('✅ Achat deleted successfully');
      return true;
    } catch (error) {
      console.error("❌ Error deleting achat:", error);
      return false;
    }
  },

  // Ajouter une dépense (taxes, carburant, autres)
  addDepense: (depenseData) => {
    try {
      console.log('📝 Adding depense:', depenseData);
      
      const data = fs.readFileSync(nouvelleAchatPath, 'utf8');
      const achats = JSON.parse(data);
      
      const newDepense = {
        id: Date.now().toString(),
        date: depenseData.date || new Date().toISOString(),
        description: depenseData.description,
        totalCost: Number(depenseData.montant),
        type: depenseData.type || 'autre_depense', // taxes, carburant, autre_depense
        categorie: depenseData.categorie || 'divers'
      };
      
      achats.push(newDepense);
      fs.writeFileSync(nouvelleAchatPath, JSON.stringify(achats, null, 2));
      
      console.log('✅ Depense added successfully:', newDepense);
      return newDepense;
    } catch (error) {
      console.error("❌ Error adding depense:", error);
      return null;
    }
  },

  // Calculer les statistiques mensuelles
  getMonthlyStats: (month, year) => {
    try {
      const achats = NouvelleAchat.getByMonthYear(month, year);
      
      const stats = {
        totalAchats: 0,
        totalDepenses: 0,
        achatsCount: 0,
        depensesCount: 0,
        byType: {}
      };
      
      achats.forEach(item => {
        if (item.type === 'achat_produit') {
          stats.totalAchats += item.totalCost;
          stats.achatsCount++;
        } else {
          stats.totalDepenses += item.totalCost;
          stats.depensesCount++;
        }
        
        // Regrouper par type
        if (!stats.byType[item.type]) {
          stats.byType[item.type] = { total: 0, count: 0 };
        }
        stats.byType[item.type].total += item.totalCost;
        stats.byType[item.type].count++;
      });
      
      stats.totalGeneral = stats.totalAchats + stats.totalDepenses;
      
      return stats;
    } catch (error) {
      console.error("❌ Error calculating monthly stats:", error);
      return null;
    }
  },

  // Calculer les statistiques annuelles
  getYearlyStats: (year) => {
    try {
      const achats = NouvelleAchat.getByYear(year);
      
      const stats = {
        totalAchats: 0,
        totalDepenses: 0,
        achatsCount: 0,
        depensesCount: 0,
        byMonth: {},
        byType: {}
      };
      
      achats.forEach(item => {
        const date = new Date(item.date);
        const month = date.getMonth() + 1;
        
        // Statistiques par mois
        if (!stats.byMonth[month]) {
          stats.byMonth[month] = { achats: 0, depenses: 0 };
        }
        
        if (item.type === 'achat_produit') {
          stats.totalAchats += item.totalCost;
          stats.achatsCount++;
          stats.byMonth[month].achats += item.totalCost;
        } else {
          stats.totalDepenses += item.totalCost;
          stats.depensesCount++;
          stats.byMonth[month].depenses += item.totalCost;
        }
        
        // Regrouper par type
        if (!stats.byType[item.type]) {
          stats.byType[item.type] = { total: 0, count: 0 };
        }
        stats.byType[item.type].total += item.totalCost;
        stats.byType[item.type].count++;
      });
      
      stats.totalGeneral = stats.totalAchats + stats.totalDepenses;
      
      return stats;
    } catch (error) {
      console.error("❌ Error calculating yearly stats:", error);
      return null;
    }
  }
};

module.exports = NouvelleAchat;