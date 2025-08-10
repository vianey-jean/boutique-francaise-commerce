# ARCHITECTURE DU SYSTÈME

## Vue d'ensemble

Ce document décrit l'architecture complète du système de gestion commerciale "Gestion-Ventes", conçu selon les meilleures pratiques de développement moderne avec React et TypeScript.

## Stack Technologique

### Frontend
- **Framework**: React 18.3.1 avec TypeScript
- **Build Tool**: Vite 5.4.1 (performances optimales)
- **Styling**: Tailwind CSS 3.4.11 + Shadcn/UI
- **État Global**: React Context API avec reducers
- **Routage**: React Router DOM v6.26.2
- **Formulaires**: React Hook Form 7.53.0 + Zod 3.23.8
- **Tests**: Vitest 3.2.4 + React Testing Library 16.3.0
- **Accessibilité**: WCAG 2.1 AA compliant
- **Graphiques**: Recharts 2.12.7
- **Animations**: Framer Motion 12.23.0
- **Gestion d'état**: TanStack React Query 5.56.2

### Backend
- **Runtime**: Node.js avec Express.js
- **Base de données**: JSON (développement) → Migration PostgreSQL prévue
- **Authentification**: JWT avec bcrypt
- **Middleware**: CORS, Multer, Auth
- **Temps réel**: Server-Sent Events (SSE)
- **API**: REST avec validation Zod

## Principes Architecturaux

### 1. Immutabilité
- Tous les états sont immuables par défaut
- Utilisation de patterns fonctionnels
- Props en lecture seule uniquement
- Pas de mutations directes d'objets

### 2. Séparation des Responsabilités
- **Présentation**: Composants UI purs dans `/components/ui/`
- **Logique Métier**: Services et hooks dans `/services/` et `/hooks/`
- **État**: Contextes spécialisés dans `/contexts/`
- **Types**: Définitions centralisées dans `/types/`

### 3. Composabilité
- Composants réutilisables et génériques
- Hooks personnalisés pour la logique partagée
- Services modulaires et testables
- Patterns de composition avancés

### 4. Performance
- Lazy loading des pages
- Memoization avec React.memo et useMemo
- Debouncing pour les recherches
- Optimisation des re-renders

## Structure des Dossiers

```
src/
├── components/           # Composants React
│   ├── ui/              # Composants UI de base (shadcn/ui)
│   ├── dashboard/       # Composants du tableau de bord
│   ├── business/        # Composants métier spécifiques
│   ├── forms/           # Composants de formulaires
│   ├── navigation/      # Navigation et accessibilité
│   ├── accessibility/   # Composants d'accessibilité
│   └── common/          # Composants communs
├── contexts/            # Contextes React
│   ├── AuthContext.tsx  # Authentification
│   ├── AppContext.tsx   # État global de l'application
│   └── ThemeContext.tsx # Gestion des thèmes
├── hooks/               # Hooks personnalisés
│   ├── use-auth.tsx     # Authentification
│   ├── use-mobile.tsx   # Détection mobile
│   └── useBusinessCalculations.ts # Calculs métier
├── services/            # Services métier
│   ├── api.ts           # Service API principal
│   ├── realtime/        # Services temps réel
│   └── BusinessCalculationService.ts
├── pages/               # Pages de l'application
├── types/               # Définitions TypeScript
├── lib/                 # Utilitaires et helpers
├── styles/              # Styles CSS modulaires
└── tests/               # Tests unitaires et d'intégration
```

## Patterns Utilisés

### 1. Provider Pattern
```typescript
// Contexte avec gestion d'état immutable
const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    login,
    logout,
    register
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

### 2. Custom Hooks Pattern
```typescript
// Hook métier avec logique encapsulée
const useBusinessCalculations = (products: Product[]): BusinessStats => {
  return useMemo(() => ({
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + (p.purchasePrice * p.quantity), 0),
    lowStockProducts: products.filter(p => p.quantity < 5)
  }), [products]);
};
```

### 3. Service Layer Pattern
```typescript
// Service pur sans effets de bord
export const BusinessCalculationService = {
  calculateProfit: (salePrice: number, purchasePrice: number): number => {
    return salePrice - purchasePrice;
  },
  
  calculateMargin: (profit: number, salePrice: number): number => {
    return salePrice > 0 ? (profit / salePrice) * 100 : 0;
  }
};
```

### 4. Error Boundary Pattern
```typescript
// Gestion globale des erreurs
class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
}
```

## Gestion des États

### Contextes Spécialisés
- **AuthContext**: Authentification utilisateur uniquement
- **AppContext**: État global de l'application (produits, ventes, etc.)
- **ThemeContext**: Gestion des thèmes clair/sombre

### État Local vs Global
- **État local**: UI temporaire (formulaires, modals)
- **État global**: Données partagées (produits, utilisateur connecté)
- **État serveur**: Cache avec React Query

## Architecture Backend

### Structure API
```
server/
├── routes/              # Routes Express
│   ├── auth.js         # Authentification
│   ├── products.js     # Gestion produits
│   ├── sales.js        # Gestion ventes
│   └── sync.js         # Synchronisation temps réel
├── models/             # Modèles de données
├── middleware/         # Middlewares Express
│   ├── auth.js        # Vérification JWT
│   └── sync.js        # Gestion SSE
└── db/                # Base de données JSON
```

### Endpoints Principaux
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/products` - Liste des produits
- `POST /api/products` - Création produit
- `GET /api/sales/by-month` - Ventes par mois
- `GET /api/sync/events` - Événements temps réel

## Sécurité

### Authentification
- JWT avec expiration 24h
- Refresh token automatique
- Logout automatique après inactivité

### Validation
- Validation côté client avec Zod
- Validation côté serveur avec Express-validator
- Sanitisation des entrées

### Protection CORS
- Configuration stricte des origines
- Headers sécurisés
- Protection CSRF

## Performance et Optimisation

### Frontend
- **Code Splitting**: Lazy loading des pages
- **Memoization**: React.memo pour les composants
- **Debouncing**: Recherches optimisées
- **Caching**: React Query pour les données serveur

### Backend
- **Rate Limiting**: Protection contre les abus
- **Compression**: Gzip pour les réponses
- **Logging**: Structured logging avec niveaux

## Tests et Qualité

### Stratégie de Tests
- **Tests unitaires**: 70% (Vitest + React Testing Library)
- **Tests d'intégration**: 20% (API + composants)
- **Tests E2E**: 10% (Playwright prévu)

### Couverture
- Composants UI: 100%
- Hooks métier: 100%
- Services: 100%
- API endpoints: 90%

### Outils de Qualité
- **ESLint**: Règles strictes TypeScript
- **Prettier**: Formatage automatique
- **TypeScript**: Mode strict activé
- **Husky**: Pre-commit hooks (prévu)

## Déploiement et DevOps

### Environnements
- **Développement**: Vite dev server + Node.js local
- **Production**: Build optimisé + serveur Node.js

### CI/CD (Prévu)
- Tests automatisés
- Build et déploiement automatique
- Monitoring des performances

## Évolutions Futures

### Court terme
- Migration base de données PostgreSQL
- Tests automatisés complets
- Monitoring et logging avancés

### Moyen terme
- Mode hors-ligne (PWA)
- API GraphQL
- Microservices

### Long terme
- Application mobile React Native
- Intelligence artificielle (prédictions)
- Intégrations tierces (comptabilité)

## Bonnes Pratiques Appliquées

### Code Quality
- Types stricts TypeScript
- Immutabilité par défaut
- Fonctions pures privilégiées
- Composition over inheritance

### Performance
- Lazy loading systématique
- Memoization appropriée
- Bundle splitting optimisé
- Minimisation des re-renders

### Accessibilité
- ARIA labels appropriés
- Navigation clavier complète
- Contraste respecté (WCAG 2.1 AA)
- Support lecteurs d'écran

### Sécurité
- Validation stricte des données
- Authentification robuste
- Protection XSS/CSRF
- Headers sécurisés