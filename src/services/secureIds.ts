import { v4 as uuidv4 } from 'uuid';

// Fonction pour générer un identifiant sécurisé unique
const generateSecureId = () => {
  return uuidv4();
};

// Map pour stocker les routes sécurisées et leurs identifiants uniques
const secureRoutes = new Map<string, string>();

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

