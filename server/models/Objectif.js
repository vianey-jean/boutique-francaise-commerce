const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db/objectif.json');

const DEFAULT_OBJECTIF = 2000;

const readData = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { 
      objectif: DEFAULT_OBJECTIF, 
      totalVentesMois: 0, 
      mois: new Date().getMonth() + 1, 
      annee: new Date().getFullYear(),
      historique: []
    };
  }
};

const writeData = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

const Objectif = {
  get: () => {
    const data = readData();
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    // Reset total if month changed and save previous month to historique
    if (data.mois !== currentMonth || data.annee !== currentYear) {
      // Save previous month data to historique before resetting
      if (data.totalVentesMois > 0 || data.objectif > 0) {
        if (!data.historique) data.historique = [];
        
        const existingIndex = data.historique.findIndex(
          h => h.mois === data.mois && h.annee === data.annee
        );
        
        const pourcentage = data.objectif > 0 
          ? Math.round((data.totalVentesMois / data.objectif) * 100) 
          : 0;
        
        const monthData = {
          mois: data.mois,
          annee: data.annee,
          totalVentesMois: data.totalVentesMois,
          objectif: data.objectif,
          pourcentage
        };
        
        if (existingIndex >= 0) {
          data.historique[existingIndex] = monthData;
        } else {
          data.historique.push(monthData);
        }
      }
      
      // Reset for new year - keep historique but filter for new year display
      if (data.annee !== currentYear) {
        // Archive previous year data (keep in historique but will be filtered in display)
      }
      
      data.totalVentesMois = 0;
      data.mois = currentMonth;
      data.annee = currentYear;
      // Reset objectif to default at the start of each month
      data.objectif = data.objectif || DEFAULT_OBJECTIF;
      writeData(data);
    }
    
    return data;
  },
  
  updateObjectif: (newObjectif) => {
    const data = readData();
    data.objectif = Number(newObjectif);
    
    // Also update in current month historique if exists
    if (data.historique) {
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
      
      const existingIndex = data.historique.findIndex(
        h => h.mois === currentMonth && h.annee === currentYear
      );
      
      if (existingIndex >= 0) {
        data.historique[existingIndex].objectif = Number(newObjectif);
        data.historique[existingIndex].pourcentage = data.objectif > 0 
          ? Math.round((data.historique[existingIndex].totalVentesMois / Number(newObjectif)) * 100)
          : 0;
      }
    }
    
    writeData(data);
    return data;
  },
  
  updateTotalVentes: (newTotal) => {
    const data = readData();
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    // Reset if month changed
    if (data.mois !== currentMonth || data.annee !== currentYear) {
      data.totalVentesMois = 0;
      data.mois = currentMonth;
      data.annee = currentYear;
    }
    
    data.totalVentesMois = Number(newTotal);
    writeData(data);
    return data;
  },
  
  recalculateFromSales: (sales) => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    // Calculate total from current month sales
    const monthlyTotal = sales
      .filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate.getMonth() + 1 === currentMonth && saleDate.getFullYear() === currentYear;
      })
      .reduce((sum, sale) => {
        if (sale.totalSellingPrice) {
          return sum + Number(sale.totalSellingPrice);
        } else if (sale.sellingPrice) {
          return sum + Number(sale.sellingPrice);
        }
        return sum;
      }, 0);
    
    const data = readData();
    data.totalVentesMois = monthlyTotal;
    data.mois = currentMonth;
    data.annee = currentYear;
    
    // Update current month in historique
    if (!data.historique) data.historique = [];
    
    const pourcentage = data.objectif > 0 
      ? Math.round((monthlyTotal / data.objectif) * 100) 
      : 0;
    
    const existingIndex = data.historique.findIndex(
      h => h.mois === currentMonth && h.annee === currentYear
    );
    
    const monthData = {
      mois: currentMonth,
      annee: currentYear,
      totalVentesMois: monthlyTotal,
      objectif: data.objectif,
      pourcentage
    };
    
    if (existingIndex >= 0) {
      data.historique[existingIndex] = monthData;
    } else {
      data.historique.push(monthData);
    }
    
    writeData(data);
    
    return data;
  },

  getHistorique: () => {
    const data = readData();
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Filter historique for current year only
    const yearHistorique = (data.historique || [])
      .filter(h => h.annee === currentYear)
      .sort((a, b) => a.mois - b.mois);
    
    return {
      currentData: {
        objectif: data.objectif,
        totalVentesMois: data.totalVentesMois,
        mois: data.mois,
        annee: data.annee
      },
      historique: yearHistorique,
      annee: currentYear
    };
  },

  saveMonthlyData: (sales) => {
    const data = Objectif.recalculateFromSales(sales);
    return Objectif.getHistorique();
  }
};

module.exports = Objectif;
