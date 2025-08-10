# DOCUMENTATION API REST

## Vue d'ensemble

API REST sécurisée pour le système de gestion commerciale "Gestion-Ventes". Cette API fournit tous les endpoints nécessaires pour la gestion des produits, ventes, prêts et authentification.

**Base URL**: `http://localhost:3001/api`

## Authentification

### JWT Token
Toutes les routes protégées nécessitent un header Authorization :
```
Authorization: Bearer <token>
```

Le token JWT expire après 24 heures et contient les informations utilisateur.

## Endpoints d'Authentification

### POST /api/auth/login
Connexion utilisateur avec email et mot de passe.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response Success (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "gender": "M",
    "address": "123 Street",
    "phone": "+1234567890"
  }
}
```

**Response Error (401):**
```json
{
  "error": "Invalid credentials",
  "message": "Email ou mot de passe incorrect"
}
```

### POST /api/auth/register
Inscription d'un nouvel utilisateur.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required, min 8 chars)",
  "firstName": "string (required)",
  "lastName": "string (required)",
  "gender": "string (required, M/F)",
  "address": "string (required)",
  "phone": "string (required)"
}
```

**Response Success (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "gender": "M",
    "address": "123 Street",
    "phone": "+1234567890"
  }
}
```

### POST /api/auth/check-email
Vérification de l'existence d'un email.

**Request Body:**
```json
{
  "email": "string (required)"
}
```

**Response:**
```json
{
  "exists": true
}
```

### POST /api/auth/reset-password-request
Demande de réinitialisation de mot de passe.

**Request Body:**
```json
{
  "email": "string (required)"
}
```

### POST /api/auth/reset-password
Réinitialisation effective du mot de passe.

**Request Body:**
```json
{
  "email": "string (required)"
}
```

## Endpoints Produits

### GET /api/products
Récupère tous les produits disponibles.

**Response:**
```json
[
  {
    "id": "uuid",
    "description": "iPhone 14 Pro",
    "purchasePrice": 800.00,
    "quantity": 10,
    "imageUrl": "http://example.com/image.jpg",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

### GET /api/products/:id
🔒 **Authentification requise**

Récupère un produit spécifique par son ID.

**Response:**
```json
{
  "id": "uuid",
  "description": "iPhone 14 Pro",
  "purchasePrice": 800.00,
  "quantity": 10,
  "imageUrl": "http://example.com/image.jpg",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### POST /api/products
🔒 **Authentification requise**

Crée un nouveau produit.

**Request Body:**
```json
{
  "description": "string (required)",
  "purchasePrice": "number (required, > 0)",
  "quantity": "number (required, >= 0)"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "description": "iPhone 14 Pro",
  "purchasePrice": 800.00,
  "quantity": 10,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### PUT /api/products/:id
🔒 **Authentification requise**

Met à jour un produit existant.

**Request Body:**
```json
{
  "description": "string (optional)",
  "purchasePrice": "number (optional, > 0)",
  "quantity": "number (optional, >= 0)"
}
```

### DELETE /api/products/:id
🔒 **Authentification requise**

Supprime un produit. Le produit ne peut être supprimé que s'il n'a pas de ventes associées.

**Response (200):**
```json
{
  "message": "Produit supprimé avec succès"
}
```

### POST /api/products/:id/upload-image
🔒 **Authentification requise**

Upload d'image pour un produit.

**Request**: Multipart form-data avec file

**Response:**
```json
{
  "imageUrl": "http://localhost:3001/uploads/image-filename.jpg"
}
```

## Endpoints Ventes

### GET /api/sales/by-month
🔒 **Authentification requise**

Récupère les ventes pour un mois spécifique.

**Query Parameters:**
- `month`: number (1-12, required)
- `year`: number (required)

**Response:**
```json
[
  {
    "id": "uuid",
    "date": "2024-01-15",
    "productId": "uuid",
    "description": "iPhone 14 Pro",
    "sellingPrice": 1000.00,
    "quantitySold": 2,
    "purchasePrice": 800.00,
    "profit": 400.00,
    "margin": 20.0,
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

### POST /api/sales
🔒 **Authentification requise**

Enregistre une nouvelle vente.

**Request Body:**
```json
{
  "date": "string (YYYY-MM-DD, required)",
  "productId": "string (uuid, required)",
  "sellingPrice": "number (required, > 0)",
  "quantitySold": "number (required, > 0)"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "date": "2024-01-15",
  "productId": "uuid",
  "description": "iPhone 14 Pro",
  "sellingPrice": 1000.00,
  "quantitySold": 2,
  "purchasePrice": 800.00,
  "profit": 400.00,
  "margin": 20.0,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### POST /api/sales/export-month
🔒 **Authentification requise**

Exporte les ventes d'un mois au format PDF.

**Request Body:**
```json
{
  "month": "number (1-12, required)",
  "year": "number (required)"
}
```

**Response**: PDF file download

## Endpoints Bénéfices

### GET /api/benefices
🔒 **Authentification requise**

Récupère tous les calculs de bénéfices sauvegardés.

**Response:**
```json
[
  {
    "id": "uuid",
    "productId": "uuid",
    "productDescription": "iPhone 14 Pro",
    "purchasePrice": 800.00,
    "customTax": 10.0,
    "customTva": 20.0,
    "otherFees": 50.0,
    "desiredMargin": 25.0,
    "totalCost": 930.0,
    "recommendedPrice": 1162.5,
    "netProfit": 232.5,
    "profitMargin": 25.0,
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

### POST /api/benefices
🔒 **Authentification requise**

Sauvegarde un calcul de bénéfice.

**Request Body:**
```json
{
  "productId": "string (uuid, required)",
  "purchasePrice": "number (required, > 0)",
  "customTax": "number (optional, >= 0)",
  "customTva": "number (optional, >= 0)",
  "otherFees": "number (optional, >= 0)",
  "desiredMargin": "number (optional, >= 0)"
}
```

## Endpoints Prêts Familiaux

### GET /api/pretfamilles
🔒 **Authentification requise**

Récupère tous les prêts familiaux.

**Response:**
```json
[
  {
    "id": "uuid",
    "familyName": "Famille Dupont",
    "amount": 1500.0,
    "amountPaid": 500.0,
    "remainingAmount": 1000.0,
    "loanDate": "2024-01-15",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

### POST /api/pretfamilles
🔒 **Authentification requise**

Crée un nouveau prêt familial.

**Request Body:**
```json
{
  "familyName": "string (required)",
  "amount": "number (required, > 0)",
  "loanDate": "string (YYYY-MM-DD, required)"
}
```

### PUT /api/pretfamilles/:id/payment
🔒 **Authentification requise**

Enregistre un paiement pour un prêt familial.

**Request Body:**
```json
{
  "paymentAmount": "number (required, > 0)"
}
```

## Endpoints Prêts Produits

### GET /api/pretproduits
🔒 **Authentification requise**

Récupère tous les prêts de produits.

**Response:**
```json
[
  {
    "id": "uuid",
    "productId": "uuid",
    "productDescription": "iPhone 14 Pro",
    "clientName": "Jean Martin",
    "totalAmount": 1000.0,
    "advanceAmount": 300.0,
    "remainingAmount": 700.0,
    "saleDate": "2024-01-15",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

### POST /api/pretproduits
🔒 **Authentification requise**

Crée un nouveau prêt de produit.

**Request Body:**
```json
{
  "productId": "string (uuid, required)",
  "clientName": "string (required)",
  "totalAmount": "number (required, > 0)",
  "advanceAmount": "number (required, >= 0)",
  "saleDate": "string (YYYY-MM-DD, required)"
}
```

## Endpoints Dépenses

### GET /api/depenses/month/:month/:year
🔒 **Authentification requise**

Récupère les dépenses d'un mois spécifique.

**Parameters:**
- `month`: number (1-12)
- `year`: number

**Response:**
```json
{
  "movements": [
    {
      "id": "uuid",
      "type": "debit",
      "amount": 150.0,
      "description": "Achat matériel bureau",
      "date": "2024-01-15",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "fixedExpenses": [
    {
      "id": "uuid",
      "name": "Loyer",
      "amount": 800.0,
      "category": "Immobilier"
    }
  ],
  "totalMovements": -150.0,
  "totalFixed": -800.0,
  "balance": -950.0
}
```

### POST /api/depenses/movement
🔒 **Authentification requise**

Ajoute un mouvement de dépense.

**Request Body:**
```json
{
  "type": "string (debit|credit, required)",
  "amount": "number (required, > 0)",
  "description": "string (required)",
  "date": "string (YYYY-MM-DD, required)"
}
```

## Endpoints Synchronisation

### GET /api/sync/events
🔒 **Authentification requise**

Connexion Server-Sent Events pour la synchronisation temps réel.

**Headers:**
```
Accept: text/event-stream
Cache-Control: no-cache
Authorization: Bearer <token>
```

**Events reçus:**
```javascript
// Connexion établie
data: {"type": "connected", "message": "Connexion établie"}

// Données modifiées
data: {"type": "data-changed", "entity": "products", "action": "create", "data": {...}}

// Synchronisation forcée
data: {"type": "force-sync", "message": "Synchronisation requise"}

// Heartbeat (toutes les 30s)
data: {"type": "heartbeat", "timestamp": 1641976800000}
```

## Gestion d'Erreurs

### Codes d'État HTTP
- `200`: Succès
- `201`: Créé avec succès
- `400`: Requête invalide (données manquantes/incorrectes)
- `401`: Non authentifié (token manquant/invalide)
- `403`: Accès interdit (permissions insuffisantes)
- `404`: Ressource non trouvée
- `409`: Conflit (données déjà existantes)
- `422`: Entité non processable (validation échouée)
- `500`: Erreur serveur interne

### Format des Erreurs
```json
{
  "error": "ValidationError",
  "message": "Description lisible de l'erreur",
  "details": {
    "field": "email",
    "code": "INVALID_FORMAT",
    "expected": "valid email format"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Erreurs Courantes

**401 Unauthorized:**
```json
{
  "error": "Unauthorized",
  "message": "Token manquant ou invalide"
}
```

**400 Bad Request:**
```json
{
  "error": "ValidationError",
  "message": "Données de requête invalides",
  "details": {
    "purchasePrice": "doit être un nombre positif",
    "quantity": "doit être supérieur ou égal à 0"
  }
}
```

## Limites et Quotas

### Rate Limiting
- **Authentification**: 5 tentatives par minute par IP
- **API générale**: 100 requêtes par minute par utilisateur
- **Upload**: 10 fichiers par minute par utilisateur

### Taille des Requêtes
- **Body JSON**: 10MB maximum
- **Upload d'images**: 5MB maximum par fichier
- **Formats acceptés**: JPG, PNG, GIF, WEBP

### Timeout
- **Requêtes standard**: 30 secondes
- **Upload**: 2 minutes
- **SSE**: Connexion maintenue indéfiniment

## Exemples d'Utilisation

### Authentification complète
```javascript
// Connexion
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json' 
  },
  body: JSON.stringify({ 
    email: 'user@example.com', 
    password: 'motdepasse123' 
  })
});

const { token, user } = await loginResponse.json();

// Utilisation du token pour les requêtes suivantes
const productsResponse = await fetch('/api/products', {
  headers: { 
    'Authorization': `Bearer ${token}` 
  }
});

const products = await productsResponse.json();
```

### Gestion des produits
```javascript
// Création d'un produit
const createProduct = await fetch('/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    description: 'iPhone 15 Pro',
    purchasePrice: 900,
    quantity: 5
  })
});

// Mise à jour d'un produit
const updateProduct = await fetch('/api/products/uuid', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    quantity: 10
  })
});
```

### Synchronisation temps réel
```javascript
const eventSource = new EventSource(`/api/sync/events`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

eventSource.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  
  switch(data.type) {
    case 'connected':
      console.log('Connexion temps réel établie');
      break;
    case 'data-changed':
      console.log('Données modifiées:', data.entity, data.action);
      // Rafraîchir les données locales
      break;
    case 'force-sync':
      console.log('Synchronisation forcée requise');
      // Recharger toutes les données
      break;
  }
});

eventSource.onerror = (error) => {
  console.error('Erreur SSE:', error);
  // Gérer la reconnexion
};
```

### Gestion avancée des erreurs
```javascript
const apiCall = async (url, options) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur API');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
};
```

## Migration et Évolution

### Versioning API
- Version actuelle: `v1`
- URL avec version: `/api/v1/...` (prévu)
- Rétrocompatibilité maintenue

### Changements Prévus
- Migration base de données PostgreSQL
- Authentification OAuth2
- API GraphQL en complément
- WebSockets pour temps réel avancé

## Monitoring et Observabilité

### Logs API
- Toutes les requêtes sont loggées
- Erreurs tracées avec stack trace
- Métriques de performance collectées

### Health Check
```
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 86400,
  "database": "connected",
  "memory": {
    "used": "150MB",
    "total": "512MB"
  }
}
```