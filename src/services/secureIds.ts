
import { v4 as uuidv4 } from 'uuid';

// Fonction pour générer un identifiant sécurisé unique
const generateSecureId = () => {
  return uuidv4();
};

// Map pour stocker les routes sécurisées et leurs identifiants uniques
const secureRoutes = new Map<string, string>();

// Map pour stocker les IDs sécurisés des produits
const secureProductIds = new Map<string, string>();

// Map pour stocker la correspondance inverse (secure ID -> real ID)
const reverseSecureIds = new Map<string, string>();

export const initSecureRoutes = () => {
  const routes = new Map([
    // Routes d'authentification
    ['/login', generateSecureId()],
    ['/register', generateSecureId()],
    ['/forgot-password', generateSecureId()],
    
    // Routes produits et catalogue
    ['/tous-les-produits', generateSecureId()],
    ['/promotions', generateSecureId()],
    ['/nouveautes', generateSecureId()],
    ['/populaires', generateSecureId()],
    ['/flash-sale/:id', generateSecureId()],
    
    // Routes utilisateur protégées
    ['/panier', generateSecureId()],
    ['/favoris', generateSecureId()],
    ['/paiement', generateSecureId()],
    ['/commandes', generateSecureId()],
    ['/order/:orderId', generateSecureId()], // Ajout de la route order
    ['/profil', generateSecureId()],
    
    // Routes admin
    ['/admin', generateSecureId()],
    ['/admin/produits', generateSecureId()],
    ['/admin/categories', generateSecureId()],
    ['/admin/utilisateurs', generateSecureId()],
    ['/admin/messages', generateSecureId()],
    ['/admin/parametres', generateSecureId()],
    ['/admin/commandes', generateSecureId()],
    ['/admin/service-client', generateSecureId()],
    ['/admin/code-promos', generateSecureId()],
    ['/admin/pub-layout', generateSecureId()],
    ['/admin/remboursements', generateSecureId()],
    ['/admin/flash-sales', generateSecureId()]
  ]);

  // Initialiser les routes sécurisées
  for (const [route, id] of routes) {
    secureRoutes.set(route, id);
  }

  return secureRoutes;
};

// Fonction pour récupérer l'identifiant sécurisé d'une route
export const getSecureRoute = (route: string): string | undefined => {
  return secureRoutes.get(route);
};

// Fonction pour obtenir la route réelle à partir d'un ID sécurisé
export const getRealRoute = (secureId: string): string | undefined => {
  for (const [route, id] of secureRoutes.entries()) {
    if (id === secureId) {
      return route;
    }
  }
  return undefined;
};

// Fonction pour valider un ID sécurisé
export const isValidSecureId = (secureId: string): boolean => {
  // Vérifier si c'est un UUID valide
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(secureId)) {
    return false;
  }
  
  // Vérifier si l'ID existe dans nos routes ou produits
  for (const [, id] of secureRoutes.entries()) {
    if (id === secureId) {
      return true;
    }
  }
  
  for (const [, id] of secureProductIds.entries()) {
    if (id === secureId) {
      return true;
    }
  }
  
  return false;
};

// Fonction pour obtenir le type d'entité d'un ID sécurisé
export const getEntityType = (secureId: string): 'route' | 'product' | 'unknown' => {
  for (const [, id] of secureRoutes.entries()) {
    if (id === secureId) {
      return 'route';
    }
  }
  
  for (const [, id] of secureProductIds.entries()) {
    if (id === secureId) {
      return 'product';
    }
  }
  
  return 'unknown';
};

// Fonction pour générer un ID sécurisé pour un produit - accepte 2 paramètres
export const getSecureProductId = (productId: string, type?: string): string => {
  if (secureProductIds.has(productId)) {
    return secureProductIds.get(productId)!;
  }
  
  const secureId = generateSecureId();
  secureProductIds.set(productId, secureId);
  reverseSecureIds.set(secureId, productId);
  return secureId;
};

// Fonction pour obtenir l'ID réel à partir d'un ID sécurisé
export const getRealId = (secureId: string): string | undefined => {
  return reverseSecureIds.get(secureId);
};

// Fonction générique pour obtenir un ID sécurisé - accepte 2 paramètres
export const getSecureId = (entityId: string, type?: string): string => {
  return getSecureProductId(entityId, type);
};

// Exporter la map des routes sécurisées pour l'utiliser dans d'autres fichiers
export { secureRoutes };
