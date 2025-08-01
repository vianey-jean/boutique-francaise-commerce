# RIZIKY-AGENDAS - ARCHITECTURE TECHNIQUE

## 1. VUE D'ENSEMBLE DE L'ARCHITECTURE

### 1.1 Architecture générale
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CLIENT WEB    │    │   API SERVER    │    │  DATA STORAGE   │
│   (React SPA)   │◄──►│  (Express.js)   │◄──►│  (JSON Files)   │
│                 │    │                 │    │                 │
│ • Components    │    │ • Routes        │    │ • users.json    │
│ • Services      │    │ • Models        │    │ • appointments  │
│ • State (RQ)    │    │ • Middlewares   │    │ • contacts.json │
│ • UI/UX         │    │ • Validations   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
   Port 5173/3000          Port 10000              File System
   (Vite Dev Server)    (Express Production)      (Local Storage)
```

### 1.2 Flux de données
```
User Action → Component → Service → API → Model → JSON File
     ▲                                                  │
     └─────────── Response ← Toast ← Service ←──────────┘

Exemple concret :
Click "Ajouter RDV" → AppointmentForm → AppointmentService.add() 
→ POST /api/appointments → Appointment.save() → appointments.json
→ Response → Toast Success → UI Update → React Query Invalidation
```

## 2. ARCHITECTURE FRONTEND (REACT)

### 2.1 Structure en couches
```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │   Pages     │ │ Components  │ │   UI Kit    │       │
│  │ HomePage    │ │ AppointForm │ │ Button      │       │
│  │ Dashboard   │ │ Calendar    │ │ Modal       │       │
│  │ LoginPage   │ │ Navbar      │ │ Input       │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                    BUSINESS LAYER                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │  Services   │ │   Hooks     │ │  Utilities  │       │
│  │ AuthService │ │ useAuth     │ │ formatDate  │       │
│  │ ApptService │ │ useQuery    │ │ validators  │       │
│  │ ApiService  │ │ useMutation │ │ helpers     │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                     DATA LAYER                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ React Query │ │ LocalStorage│ │ HTTP Client │       │
│  │ Cache       │ │ User Session│ │ Axios       │       │
│  │ Mutations   │ │ Persistence │ │ Interceptors│       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Composants et responsabilités
```typescript
// Architecture des composants
App.tsx                    // Root - Providers, Router, Layout
├── Navbar.tsx            // Navigation globale + Search
├── Pages/
│   ├── HomePage.tsx      // Landing page marketing
│   ├── DashboardPage.tsx // Hub principal utilisateur
│   ├── LoginPage.tsx     // Authentification
│   └── ...
├── Components/
│   ├── Calendar/         // Système de calendrier
│   │   ├── WeekCalendar.tsx       // Vue semaine principale
│   │   ├── CalendarHeader.tsx     // Navigation semaines
│   │   ├── CalendarDay.tsx        // Cellule jour
│   │   └── CalendarAppointment.tsx // RDV dans calendrier
│   ├── Appointments/     // Gestion rendez-vous
│   │   ├── AppointmentForm.tsx    // Création/Edition
│   │   ├── AppointmentDetails.tsx // Affichage détaillé
│   │   ├── AppointmentModal.tsx   // Confirmation actions
│   │   └── AppointmentSelector.tsx // Sélection multiple
│   └── UI/               // Composants shadcn/ui réutilisables
│       ├── Button.tsx
│       ├── Modal.tsx
│       └── ...
├── Services/             // Couche métier
│   ├── AuthService.ts    // Authentification
│   ├── AppointmentService.ts // Gestion RDV
│   └── api.ts           // Configuration Axios
└── Hooks/               // Logique réutilisable
    ├── useAuth.ts       // (À implémenter)
    └── useToast.ts      // Notifications
```

### 2.3 Gestion d'état avancée
```typescript
// Stratégie de state management
┌─────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT                     │
│                                                         │
│  Server State (React Query)    Local State (useState)   │
│  ┌─────────────────────────┐   ┌─────────────────────┐  │
│  │ • User data             │   │ • UI state          │  │
│  │ • Appointments          │   │ • Form inputs       │  │
│  │ • Search results        │   │ • Modal visibility  │  │
│  │ • Cache invalidation    │   │ • Loading states    │  │
│  └─────────────────────────┘   └─────────────────────┘  │
│                                                         │
│  Persistent State (localStorage)  Global State (Context) │
│  ┌─────────────────────────┐   ┌─────────────────────┐  │
│  │ • User session          │   │ • Theme preference  │  │
│  │ • Preferences           │   │ • App configuration │  │
│  │ • Last search           │   │ • Feature flags     │  │
│  └─────────────────────────┘   └─────────────────────┘  │
└─────────────────────────────────────────────────────────┘

// Exemple d'implémentation
const DashboardPage = () => {
  // Server state - React Query
  const { 
    data: appointments, 
    isLoading, 
    error,
    refetch 
  } = useQuery(['appointments'], AppointmentService.getAll);

  // Local UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Persistent state
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (!user) navigate('/login');
  }, []);

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage />}
      {appointments && <AppointmentList data={appointments} />}
    </div>
  );
};
```

## 3. ARCHITECTURE BACKEND (NODE.JS)

### 3.1 Structure MVC adaptée
```
┌─────────────────────────────────────────────────────────┐
│                    ROUTES LAYER                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │   Users     │ │Appointments │ │   Contact   │       │
│  │ /register   │ │ /create     │ │ /send       │       │
│  │ /login      │ │ /update     │ │ /list       │       │
│  │ /profile    │ │ /delete     │ │             │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                  MIDDLEWARE LAYER                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │    Auth     │ │ Validation  │ │   Upload    │       │
│  │isAuthenticated│validateInput│ uploadFiles │       │
│  │checkPermissions│sanitizeData│handleImages │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                    MODELS LAYER                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │    User     │ │Appointment  │ │   Contact   │       │
│  │ save()      │ │ save()      │ │ save()      │       │
│  │ getById()   │ │ getByUser() │ │ getAll()    │       │
│  │ validate()  │ │ search()    │ │ delete()    │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                     DATA LAYER                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │  JSON Files │ │ File System │ │   Uploads   │       │
│  │users.json   │ │ fs.readFile │ │/uploads/*   │       │
│  │appointments │ │fs.writeFile │ │ multer      │       │
│  │contacts.json│ │  path.join  │ │             │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Pattern Repository avec JSON
```javascript
// Pattern d'accès aux données
class BaseRepository {
  constructor(filename) {
    this.dataPath = path.join(__dirname, '../data', filename);
  }

  loadData() {
    try {
      if (fs.existsSync(this.dataPath)) {
        const data = fs.readFileSync(this.dataPath, 'utf8');
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error(`Erreur lecture ${this.dataPath}:`, error);
      return [];
    }
  }

  saveData(data) {
    try {
      fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Erreur écriture ${this.dataPath}:`, error);
      return false;
    }
  }

  generateId(items) {
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
  }

  findById(id) {
    const items = this.loadData();
    return items.find(item => item.id === parseInt(id));
  }

  findByUserId(userId) {
    const items = this.loadData();
    return items.filter(item => item.userId === parseInt(userId));
  }
}

// Utilisation spécialisée
class AppointmentRepository extends BaseRepository {
  constructor() {
    super('appointments.json');
  }

  findByDateRange(startDate, endDate, userId) {
    const appointments = this.findByUserId(userId);
    return appointments.filter(apt => 
      apt.date >= startDate && apt.date <= endDate
    );
  }

  search(query, userId) {
    const appointments = this.findByUserId(userId);
    const searchTerm = query.toLowerCase();
    
    return appointments.filter(apt =>
      apt.titre.toLowerCase().includes(searchTerm) ||
      apt.description.toLowerCase().includes(searchTerm) ||
      apt.location.toLowerCase().includes(searchTerm)
    );
  }

  hasConflict(appointmentData, excludeId = null) {
    const appointments = this.loadData();
    return appointments.some(apt =>
      apt.userId === appointmentData.userId &&
      apt.date === appointmentData.date &&
      apt.heure === appointmentData.heure &&
      apt.id !== excludeId
    );
  }
}
```

### 3.3 Système de validation en couches
```javascript
// Validation côté serveur
const ValidationService = {
  // Validation des données utilisateur
  validateUser(userData) {
    const errors = [];
    
    if (!userData.nom || userData.nom.length < 2) {
      errors.push('Nom requis (minimum 2 caractères)');
    }
    
    if (!userData.email || !this.isValidEmail(userData.email)) {
      errors.push('Email valide requis');
    }
    
    if (!userData.password || userData.password.length < 6) {
      errors.push('Mot de passe requis (minimum 6 caractères)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Validation des rendez-vous
  validateAppointment(appointmentData) {
    const errors = [];
    
    if (!appointmentData.titre || appointmentData.titre.length < 3) {
      errors.push('Titre requis (minimum 3 caractères)');
    }
    
    if (!appointmentData.date || !this.isValidDate(appointmentData.date)) {
      errors.push('Date valide requise (format YYYY-MM-DD)');
    }
    
    if (!appointmentData.heure || !this.isValidTime(appointmentData.heure)) {
      errors.push('Heure valide requise (format HH:MM)');
    }
    
    if (!appointmentData.duree || appointmentData.duree < 15 || appointmentData.duree > 480) {
      errors.push('Durée entre 15 et 480 minutes requise');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  isValidDate(date) {
    return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(Date.parse(date));
  },

  isValidTime(time) {
    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
  }
};

// Middleware de validation
const validateRequestData = (validationType) => {
  return (req, res, next) => {
    let validation;
    
    switch (validationType) {
      case 'user':
        validation = ValidationService.validateUser(req.body);
        break;
      case 'appointment':
        validation = ValidationService.validateAppointment(req.body);
        break;
      default:
        return next();
    }
    
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Données invalides',
        details: validation.errors
      });
    }
    
    next();
  };
};
```

## 4. SÉCURITÉ ET AUTHENTIFICATION

### 4.1 Stratégie d'authentification actuelle
```javascript
// Architecture d'authentification simple
┌─────────────────────────────────────────────────────────┐
│                 AUTHENTICATION FLOW                     │
│                                                         │
│  Frontend                API Server            Storage  │
│  ┌─────────┐            ┌─────────┐          ┌─────────┐│
│  │ Login   │───POST────►│ /login  │──────────►│users.json││
│  │ Form    │            │ Route   │          │        ││
│  └─────────┘            └─────────┘          └─────────┘│
│       │                      │                         │
│       ▼                      ▼                         │
│  ┌─────────┐            ┌─────────┐                    │
│  │localStorage          │ Response│                    │
│  │{user:...}│◄──────────│{user:..}│                    │
│  └─────────┘            └─────────┘                    │
│       │                                                │
│       ▼                                                │
│  ┌─────────┐            ┌─────────┐                    │
│  │Subsequent│──Header───►│isAuth   │                    │
│  │Requests │user-id: 123│Middleware│                   │
│  └─────────┘            └─────────┘                    │
└─────────────────────────────────────────────────────────┘

// Implémentation middleware
const isAuthenticated = (req, res, next) => {
  const userId = req.headers['user-id'];
  
  if (!userId) {
    return res.status(401).json({ 
      error: 'Token d\'authentification requis' 
    });
  }
  
  const user = User.getById(parseInt(userId));
  
  if (!user) {
    return res.status(401).json({ 
      error: 'Utilisateur non trouvé ou session expirée' 
    });
  }
  
  req.user = user; // Attacher l'utilisateur au contexte
  next();
};
```

### 4.2 Architecture de sécurité recommandée (évolution)
```javascript
// Migration vers JWT recommandée
┌─────────────────────────────────────────────────────────┐
│                   JWT AUTHENTICATION                    │
│                                                         │
│  Frontend              API Server               Storage │
│  ┌─────────┐          ┌─────────┐             ┌─────────┐│
│  │ Login   │──POST───►│ /login  │─────────────►│Database ││
│  │ Form    │          │ + JWT   │             │Users    ││
│  └─────────┘          └─────────┘             └─────────┘│
│       │                    │                            │
│       ▼                    ▼                            │
│  ┌─────────┐          ┌─────────┐                       │
│  │localStorage        │JWT Token│                       │
│  │{token:.}│◄─────────│{token:..│                       │
│  └─────────┘          │expires:.│                       │
│       │                └─────────┘                       │
│       ▼                                                 │
│  ┌─────────┐          ┌─────────┐                       │
│  │API Calls│──Bearer──►│JWT      │                       │
│  │Auth: ..│           │Middleware│                       │
│  └─────────┘          └─────────┘                       │
└─────────────────────────────────────────────────────────┘

// Implémentation JWT future
const jwt = require('jsonwebtoken');

const generateJWT = (user) => {
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24h
    },
    process.env.JWT_SECRET
  );
};

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'Token requis' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide' });
    }
    
    req.user = decoded;
    next();
  });
};
```

## 5. GESTION DES DONNÉES ET PERSISTANCE

### 5.1 Architecture de données actuelle
```
┌─────────────────────────────────────────────────────────┐
│                     DATA ARCHITECTURE                   │
│                                                         │
│                   File System Storage                   │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                server/data/                         │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │ │
│  │  │users.json   │ │appointments │ │contacts.json│   │ │
│  │  │[{           │ │.json        │ │[{           │   │ │
│  │  │  id: 1,     │ │[{           │ │  id: 1,     │   │ │
│  │  │  nom: "...", │ │  id: 1,     │ │  name:"...", │   │ │
│  │  │  email:".." │ │  userId: 1, │ │  email:".."│   │ │
│  │  │}]           │ │  titre:".." │ │  message:".."│   │ │
│  │  └─────────────┘ │}]           │ │}]           │   │ │
│  │                  └─────────────┘ └─────────────┘   │ │
│  └─────────────────────────────────────────────────────┘ │
│                            │                            │
│                            ▼                            │
│                   ┌─────────────────┐                   │
│                   │   Model Layer   │                   │
│                   │  ┌─────────────┐│                   │
│                   │  │ loadData()  ││                   │
│                   │  │ saveData()  ││                   │
│                   │  │ findById()  ││                   │
│                   │  │ validate()  ││                   │
│                   │  └─────────────┘│                   │
│                   └─────────────────┘                   │
└─────────────────────────────────────────────────────────┘

// Structure des données
{
  "users": [
    {
      "id": 1,
      "nom": "Dupont",
      "prenom": "Jean",
      "email": "jean.dupont@email.com",
      "password": "motdepasse", // En production : hashé
      "genre": "homme",
      "adresse": "123 Rue de la Paix",
      "phone": "0123456789",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "appointments": [
    {
      "id": 1,
      "userId": 1,
      "titre": "Réunion équipe",
      "description": "Point mensuel équipe projet",
      "date": "2024-01-20",
      "heure": "14:30",
      "duree": 60,
      "location": "Salle de réunion A",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 5.2 Migration vers base de données (recommandée)
```sql
-- Schema PostgreSQL recommandé
CREATE DATABASE riziky_agendas;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL, -- bcrypt hash
  genre VARCHAR(10) CHECK (genre IN ('homme', 'femme', 'autre')),
  adresse TEXT,
  phone VARCHAR(20),
  email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  date_rdv DATE NOT NULL,
  heure_rdv TIME NOT NULL,
  duree_minutes INTEGER NOT NULL CHECK (duree_minutes > 0),
  location VARCHAR(500) NOT NULL,
  status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Index pour les requêtes fréquentes
  CONSTRAINT unique_user_datetime UNIQUE (user_id, date_rdv, heure_rdv)
);

CREATE INDEX idx_appointments_user_date ON appointments(user_id, date_rdv);
CREATE INDEX idx_appointments_search ON appointments USING gin(to_tsvector('french', titre || ' ' || description || ' ' || location));

-- Triggers pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 6. COMMUNICATION API ET PROTOCOLES

### 6.1 Architecture REST API
```
┌─────────────────────────────────────────────────────────┐
│                      REST API DESIGN                    │
│                                                         │
│  Endpoints Structure:                                   │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ BASE URL: /api/v1                                   │ │
│  │                                                     │ │
│  │ Users:                                              │ │
│  │ POST   /users/register     - Inscription           │ │
│  │ POST   /users/login        - Connexion             │ │
│  │ POST   /users/reset-password - Reset MDP           │ │
│  │ GET    /users/check-email/:email - Vérif email     │ │
│  │ GET    /users/profile      - Profil utilisateur    │ │
│  │ PUT    /users/profile      - Mise à jour profil    │ │
│  │                                                     │ │
│  │ Appointments:                                       │ │
│  │ GET    /appointments       - Liste RDV utilisateur │ │
│  │ GET    /appointments/:id   - RDV spécifique        │ │
│  │ POST   /appointments       - Créer RDV             │ │
│  │ PUT    /appointments/:id   - Modifier RDV          │ │
│  │ DELETE /appointments/:id   - Supprimer RDV         │ │
│  │ GET    /appointments/search/:query - Recherche     │ │
│  │ GET    /appointments/week/:start/:end - Semaine    │ │
│  │                                                     │ │
│  │ Contact:                                            │ │
│  │ POST   /contact           - Envoyer message        │ │
│  │ GET    /contact           - Liste messages (admin) │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

// Format des réponses standardisé
{
  // Succès
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}

{
  // Erreur
  "success": false,
  "error": "Error message",
  "details": ["Field validation errors"],
  "code": "ERROR_CODE"
}
```

### 6.2 Gestion des erreurs centralisée
```javascript
// Middleware de gestion d'erreurs global
const errorHandler = (err, req, res, next) => {
  console.error('Erreur API:', err);

  // Erreurs de validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Données invalides',
      details: err.errors,
      code: 'VALIDATION_ERROR'
    });
  }

  // Erreurs d'authentification
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: 'Accès non autorisé',
      code: 'AUTH_ERROR'
    });
  }

  // Erreurs de ressource non trouvée
  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      success: false,
      error: 'Ressource non trouvée',
      code: 'NOT_FOUND'
    });
  }

  // Erreur serveur générique
  res.status(500).json({
    success: false,
    error: 'Erreur serveur interne',
    code: 'INTERNAL_ERROR'
  });
};

// Wrapper pour les routes async
const asyncWrapper = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Utilisation dans les routes
router.get('/appointments', isAuthenticated, asyncWrapper(async (req, res) => {
  const appointments = await AppointmentService.getByUserId(req.user.id);
  res.json({
    success: true,
    data: { appointments },
    message: 'Rendez-vous récupérés avec succès'
  });
}));
```

## 7. DÉPLOIEMENT ET INFRASTRUCTURE

### 7.1 Architecture de déploiement
```
┌─────────────────────────────────────────────────────────┐
│                   DEPLOYMENT ARCHITECTURE               │
│                                                         │
│  Development Environment:                               │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ Frontend (Vite Dev Server)    Backend (Node.js)     │ │
│  │ localhost:5173               localhost:10000        │ │
│  │          │                           │              │ │
│  │          └───── HTTP Requests ───────┘              │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                         │
│  Production Environment:                                │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                  Load Balancer                      │ │
│  │                 (Nginx/Cloudflare)                  │ │
│  │                        │                           │ │
│  │         ┌──────────────┼──────────────┐             │ │
│  │         ▼              ▼              ▼             │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │ │
│  │  │   Static    │ │ API Server  │ │   Database  │   │ │
│  │  │   Files     │ │ (Express)   │ │ (PostgreSQL)│   │ │
│  │  │ (CDN/S3)    │ │ (Railway/   │ │ (Supabase)  │   │ │
│  │  │             │ │  Heroku)    │ │             │   │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘   │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 7.2 Configuration de déploiement
```dockerfile
# Dockerfile Frontend
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Dockerfile Backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 10000
CMD ["npm", "start"]

# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:80"
    environment:
      - VITE_API_URL=http://backend:10000/api
    depends_on:
      - backend

  backend:
    build: ./server
    ports:
      - "10000:10000"
    environment:
      - NODE_ENV=production
      - PORT=10000
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASS=${SMTP_PASS}
    volumes:
      - ./server/data:/app/data
      - ./server/uploads:/app/uploads

  database:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=riziky_agendas
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 7.3 Configuration CI/CD
```yaml
# .github/workflows/deploy.yml
name: Deploy Application

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run build

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: railway-app/railway@v1
        with:
          command: up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## 8. MONITORING ET OBSERVABILITÉ

### 8.1 Logging et métriques
```javascript
// Configuration de monitoring
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Middleware de logging des requêtes
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  });
  
  next();
};

// Métriques applicatives
const metrics = {
  appointmentCreated: 0,
  userRegistrations: 0,
  apiErrors: 0,
  
  increment(metric) {
    this[metric]++;
    logger.info(`Metric ${metric} incremented to ${this[metric]}`);
  },
  
  getAll() {
    return { ...this };
  }
};

// Endpoint pour les métriques
app.get('/api/metrics', (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    metrics: metrics.getAll()
  });
});
```

Cette architecture technique complète fournit une base solide pour le développement, la maintenance et l'évolution de l'application Riziky-Agendas.