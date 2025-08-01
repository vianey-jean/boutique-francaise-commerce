# RIZIKY-AGENDAS - DOCUMENTATION DU CODE

## 1. STRUCTURE DU PROJET

### 1.1 Structure Frontend (src/)
```
src/
├── components/           # Composants React réutilisables
│   ├── ui/              # Composants UI de base (shadcn/ui)
│   ├── ActionButtons.tsx # Boutons d'action principaux
│   ├── AppointmentDetails.tsx # Affichage détaillé des RDV
│   ├── AppointmentForm.tsx    # Formulaire de création/édition
│   ├── AppointmentModal.tsx   # Modal de confirmation
│   ├── AppointmentSelector.tsx # Sélecteur de RDV
│   ├── AutoLogout.tsx         # Déconnexion automatique
│   ├── CalendarAppointment.tsx # RDV dans le calendrier
│   ├── CalendarDay.tsx        # Jour du calendrier
│   ├── CalendarDayHeader.tsx  # En-tête jour
│   ├── CalendarHeader.tsx     # En-tête calendrier
│   ├── DashboardCalendar.tsx  # Calendrier principal
│   ├── Footer.tsx             # Pied de page
│   ├── Navbar.tsx             # Navigation
│   ├── PasswordStrengthIndicator.tsx # Indicateur force MDP
│   ├── SearchAppointmentForm.tsx     # Formulaire recherche
│   └── Weekcalendar.tsx       # Vue calendrier hebdomadaire
├── hooks/               # Hooks personnalisés
├── lib/                 # Utilitaires et helpers
├── pages/               # Pages de l'application
├── services/            # Couche de services (API calls)
└── main.tsx            # Point d'entrée React
```

### 1.2 Structure Backend (server/)
```
server/
├── data/               # Stockage JSON (mock database)
│   ├── appointments.json # Données des rendez-vous
│   └── users.json       # Données des utilisateurs
├── middlewares/        # Middlewares Express
│   ├── authMiddleware.js # Vérification authentification
│   └── uploadMiddleware.js # Gestion uploads (future)
├── models/             # Modèles de données
│   ├── Appointment.js  # Modèle rendez-vous
│   ├── Contact.js      # Modèle contact
│   └── User.js         # Modèle utilisateur
├── routes/             # Routes Express
│   ├── appointements.js # Routes rendez-vous
│   ├── contact.js      # Routes contact
│   └── users.js        # Routes utilisateurs
├── uploads/            # Dossier fichiers uploadés
└── server.js           # Point d'entrée serveur
```

## 2. COMPOSANTS FRONTEND DÉTAILLÉS

### 2.1 App.tsx - Composant racine
```typescript
// Point d'entrée principal de l'application
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        {/* Système de notifications */}
        <Toaster />
        <Sonner />
        
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/a-propos" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/connexion" element={<LoginPage />} />
              <Route path="/inscription" element={<RegisterPage />} />
              <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} />
              <Route path="/tableau-de-bord" element={<DashboardPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        
        {/* Déconnexion automatique */}
        <AutoLogout />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
```

**Responsabilités :**
- Configuration globale (React Query, Router, Tooltips)
- Layout principal avec navigation et footer
- Système de notifications global
- Gestion de la déconnexion automatique

### 2.2 AuthService.ts - Service d'authentification
```typescript
export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  password: string;
  genre: string;
  adresse: string;
  phone: string;
}

// Variable globale pour l'utilisateur connecté
let loggedInUser: User | null = null;

export const AuthService = {
  // Connexion utilisateur
  login: async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/users/login', { email, password });
      if (response.data.user) {
        loggedInUser = response.data.user;
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success(`Bienvenue ${response.data.user.genre === 'homme' ? 'M.' : 'Mme'} ${response.data.user.nom}`);
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Email ou mot de passe erroné");
      return false;
    }
  },

  // Inscription utilisateur
  register: async (user: Omit<User, 'id'>): Promise<boolean> => {
    // Validation et envoi des données
  },

  // Récupération utilisateur actuel
  getCurrentUser: (): User | null => {
    if (loggedInUser) return loggedInUser;
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      loggedInUser = JSON.parse(storedUser);
      return loggedInUser;
    }
    
    return null;
  },

  // Déconnexion
  logout: (): void => {
    loggedInUser = null;
    localStorage.removeItem('user');
    toast.info("Vous êtes déconnecté");
  }
};
```

**Fonctionnalités clés :**
- Persistance avec localStorage
- Gestion centralisée de l'état de connexion
- Messages personnalisés selon le genre
- Validation et gestion d'erreurs

### 2.3 AppointmentService.ts - Service des rendez-vous
```typescript
export interface Appointment {
  id: number;
  userId: number;
  titre: string;
  description: string;
  date: string; // Format YYYY-MM-DD
  heure: string; // Format HH:MM
  duree: number; // Minutes
  location: string;
}

export const AppointmentService = {
  // Récupération de tous les rendez-vous
  getAll: async (): Promise<Appointment[]> => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) return [];

    const response = await api.get('/appointments', {
      headers: { 'user-id': currentUser.id.toString() }
    });

    return response.data.appointments || [];
  },

  // Recherche avec minimum 3 caractères
  search: async (query: string): Promise<Appointment[]> => {
    if (query.length < 3) return [];
    
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) return [];

    const response = await api.get(`/appointments/search/${query}`, {
      headers: { 'user-id': currentUser.id.toString() }
    });

    return response.data.appointments || [];
  },

  // Création avec notifications
  add: async (appointment: Omit<Appointment, 'id'>): Promise<Appointment | null> => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      toast.error('Vous devez être connecté pour ajouter un rendez-vous');
      return null;
    }

    const response = await api.post('/appointments', appointment, {
      headers: { 'user-id': currentUser.id.toString() }
    });

    toast.success('Rendez-vous ajouté avec succès');
    return response.data.appointment;
  },

  // Helpers pour le calendrier
  getWeekDays: () => {
    const today = new Date();
    const monday = startOfWeek(today, { weekStartsOn: 1 });

    return Array(7).fill(null).map((_, index) => {
      const date = addDays(monday, index);
      return {
        fullDate: date,
        dayName: format(date, 'EEEE'),
        dayNumber: format(date, 'd'),
        month: format(date, 'MMMM'),
        isToday: format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
      };
    });
  },

  getHours: () => Array(14).fill(null).map((_, index) => `${index + 7}:00`)
};
```

**Fonctionnalités principales :**
- CRUD complet avec authentification
- Recherche intelligente avec seuil
- Helpers pour vue calendrier
- Gestion d'erreurs et notifications

### 2.4 AppointmentForm.tsx - Formulaire principal
```typescript
// Schema de validation Zod
const appointmentSchema = z.object({
  titre: z.string().min(1, "Le titre est obligatoire").max(100, "Titre trop long"),
  description: z.string().min(1, "La description est obligatoire"),
  date: z.string().min(1, "La date est obligatoire"),
  heure: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format d'heure invalide"),
  duree: z.number().min(15, "Durée minimum 15 minutes").max(480, "Durée maximum 8 heures"),
  location: z.string().min(1, "Le lieu est obligatoire")
});

const AppointmentForm = ({ appointment, onClose, onSuccess }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: appointment ? {
      titre: appointment.titre,
      description: appointment.description,
      date: appointment.date,
      heure: appointment.heure,
      duree: appointment.duree,
      location: appointment.location
    } : {
      duree: 60 // Valeur par défaut
    }
  });

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      if (appointment) {
        // Mode édition
        const success = await AppointmentService.update({ ...appointment, ...data });
        if (success) {
          onSuccess?.();
          onClose();
        }
      } else {
        // Mode création
        const newAppointment = await AppointmentService.add(data);
        if (newAppointment) {
          onSuccess?.();
          onClose();
        }
      }
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Champ titre */}
      <div className="space-y-2">
        <Label htmlFor="titre">Titre du rendez-vous</Label>
        <Input
          {...register("titre")}
          placeholder="Ex: Réunion équipe, Consultation médecin..."
          className="w-full"
        />
        {errors.titre && (
          <p className="text-destructive text-sm">{errors.titre.message}</p>
        )}
      </div>

      {/* Sélecteur de date avec calendrier */}
      <div className="space-y-2">
        <Label>Date du rendez-vous</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {watchedDate ? format(parseISO(watchedDate), 'PPP', { locale: fr }) : "Sélectionner une date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={watchedDate ? parseISO(watchedDate) : undefined}
              onSelect={(date) => setValue("date", format(date!, 'yyyy-MM-dd'))}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.date && (
          <p className="text-destructive text-sm">{errors.date.message}</p>
        )}
      </div>

      {/* Autres champs... */}
    </form>
  );
};
```

**Caractéristiques techniques :**
- Validation avec Zod et React Hook Form
- Calendrier interactif avec date-fns
- Mode création/édition unifié
- Interface accessible et responsive

### 2.5 AutoLogout.tsx - Déconnexion automatique
```typescript
const TIMEOUT_DURATION = 5 * 60 * 1000; // 5 minutes

const AutoLogout = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const resetTimer = () => {
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
          AuthService.logout();
          navigate('/connexion');
          toast.info('Session expirée. Veuillez vous reconnecter.', {
            duration: 5000,
          });
        }
      }, TIMEOUT_DURATION);
    };
    
    // Événements qui réinitialisent le timer
    const events = ['mousedown', 'keydown', 'scroll', 'mousemove'];
    events.forEach(event => document.addEventListener(event, resetTimer));
    
    resetTimer(); // Initialiser
    
    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => document.removeEventListener(event, resetTimer));
    };
  }, [navigate]);
  
  return null; // Composant invisible
};
```

**Fonctionnement :**
- Timer de 5 minutes d'inactivité
- Détection d'activité (souris, clavier, scroll)
- Déconnexion automatique avec redirection
- Nettoyage approprié des listeners

## 3. BACKEND DÉTAILLÉ

### 3.1 server.js - Serveur principal
```javascript
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();

// Middlewares globaux
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir les fichiers uploadés
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// Routes
const usersRoutes = require('./routes/users');
const appointmentsRoutes = require('./routes/appointements');
const contactRoutes = require('./routes/contact');

app.use('/api/users', usersRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/contact', contactRoutes);

// Route de santé
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API de Riziky-Agendas' });
});

// Gestion 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
```

### 3.2 models/Appointment.js - Modèle rendez-vous
```javascript
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/appointments.json');

class Appointment {
  // Sauvegarde des données dans le fichier JSON
  static saveData(data) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  }

  // Chargement des données depuis le fichier
  static loadData() {
    try {
      if (fs.existsSync(dataPath)) {
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error('Erreur lecture appointments:', error);
      return [];
    }
  }

  // Créer un nouvel ID
  static generateId() {
    const appointments = this.loadData();
    return appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1;
  }

  // Sauvegarder un rendez-vous
  static save(appointmentData) {
    try {
      const appointments = this.loadData();
      
      // Vérifier les conflits d'horaire
      const hasConflict = appointments.some(existing => 
        existing.userId === appointmentData.userId &&
        existing.date === appointmentData.date &&
        existing.heure === appointmentData.heure &&
        existing.id !== appointmentData.id
      );

      if (hasConflict) {
        return { 
          success: false, 
          message: 'Un rendez-vous existe déjà à cette date et heure' 
        };
      }

      const newAppointment = {
        id: this.generateId(),
        ...appointmentData,
        createdAt: new Date().toISOString()
      };

      appointments.push(newAppointment);
      this.saveData(appointments);

      return { success: true, appointment: newAppointment };
    } catch (error) {
      return { success: false, message: 'Erreur lors de la sauvegarde' };
    }
  }

  // Récupérer les rendez-vous d'un utilisateur
  static getByUserId(userId) {
    const appointments = this.loadData();
    return appointments.filter(appointment => appointment.userId === parseInt(userId));
  }

  // Recherche textuelle
  static search(query, userId) {
    const appointments = this.getByUserId(userId);
    const searchTerm = query.toLowerCase();

    return appointments.filter(appointment =>
      appointment.titre.toLowerCase().includes(searchTerm) ||
      appointment.description.toLowerCase().includes(searchTerm) ||
      appointment.location.toLowerCase().includes(searchTerm)
    );
  }

  // Récupérer les rendez-vous d'une semaine
  static getByWeek(startDate, endDate, userId) {
    const appointments = this.getByUserId(userId);
    
    return appointments.filter(appointment => {
      const appointmentDate = appointment.date;
      return appointmentDate >= startDate && appointmentDate <= endDate;
    });
  }

  // Mettre à jour un rendez-vous
  static update(id, updateData) {
    try {
      const appointments = this.loadData();
      const index = appointments.findIndex(a => a.id === parseInt(id));

      if (index === -1) {
        return { success: false, message: 'Rendez-vous non trouvé' };
      }

      // Vérifier les conflits (exclure le rendez-vous actuel)
      const hasConflict = appointments.some(existing => 
        existing.userId === updateData.userId &&
        existing.date === (updateData.date || appointments[index].date) &&
        existing.heure === (updateData.heure || appointments[index].heure) &&
        existing.id !== parseInt(id)
      );

      if (hasConflict) {
        return { 
          success: false, 
          message: 'Un rendez-vous existe déjà à cette date et heure' 
        };
      }

      appointments[index] = {
        ...appointments[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      this.saveData(appointments);
      return { success: true, appointment: appointments[index] };
    } catch (error) {
      return { success: false, message: 'Erreur lors de la mise à jour' };
    }
  }

  // Supprimer un rendez-vous
  static delete(id) {
    try {
      const appointments = this.loadData();
      const filteredAppointments = appointments.filter(a => a.id !== parseInt(id));

      if (appointments.length === filteredAppointments.length) {
        return { success: false, message: 'Rendez-vous non trouvé' };
      }

      this.saveData(filteredAppointments);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Erreur lors de la suppression' };
    }
  }
}

module.exports = Appointment;
```

**Fonctionnalités clés :**
- CRUD complet avec persistance JSON
- Vérification des conflits d'horaire
- Recherche textuelle multi-critères
- Filtrage par utilisateur et période
- Gestion d'erreurs robuste

### 3.3 middlewares/authMiddleware.js - Authentification
```javascript
const User = require('../models/User');

// Middleware pour vérifier l'authentification
const isAuthenticated = (req, res, next) => {
  const userId = req.headers['user-id'];

  if (!userId) {
    return res.status(401).json({ error: 'Token d\'authentification requis' });
  }

  const user = User.getById(parseInt(userId));

  if (!user) {
    return res.status(401).json({ error: 'Utilisateur non trouvé ou session expirée' });
  }

  // Attacher l'utilisateur à la requête
  req.user = user;
  next();
};

module.exports = { isAuthenticated };
```

**Sécurité :**
- Vérification systématique de l'utilisateur
- Blocage des requêtes non authentifiées
- Attachment de l'utilisateur au context de la requête

## 4. SYSTÈME DE NOTIFICATIONS EMAIL

### 4.1 Configuration SMTP
```javascript
// Dans routes/appointements.js
const sendAppointmentNotification = async (action, appointment, user) => {
  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    let subject, html;
    
    switch (action) {
      case 'create':
        subject = `[Riziky-Agendas] Nouveau rendez-vous: ${appointment.titre}`;
        html = `
          <h2>Nouveau rendez-vous créé</h2>
          <p>Bonjour ${user.prenom},</p>
          <p>Votre rendez-vous <strong>${appointment.titre}</strong> a été créé avec succès.</p>
          <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #4CAF50; background-color: #f8f8f8;">
            <p><strong>Date:</strong> ${appointment.date}</p>
            <p><strong>Heure:</strong> ${appointment.heure}</p>
            <p><strong>Durée:</strong> ${appointment.duree} minutes</p>
            <p><strong>Lieu:</strong> ${appointment.location}</p>
            <p><strong>Description:</strong> ${appointment.description}</p>
          </div>
          <p>L'équipe Riziky-Agendas</p>
        `;
        break;
      // Autres cas...
    }

    await transporter.sendMail({
      from: `"Riziky-Agendas" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject,
      html,
    });

    return true;
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return false;
  }
};
```

**Fonctionnalités :**
- Templates HTML professionnels
- Support multi-actions (création, modification, suppression)
- Configuration flexible SMTP
- Gestion d'erreurs avec logs

## 5. UTILISATION DES HOOKS ET STATE MANAGEMENT

### 5.1 React Query pour le cache
```typescript
// Utilisation typique dans un composant
const {
  data: appointments,
  isLoading,
  error,
  refetch
} = useQuery({
  queryKey: ['appointments'],
  queryFn: AppointmentService.getAll,
  staleTime: 5 * 60 * 1000, // Cache 5 minutes
  cacheTime: 10 * 60 * 1000, // Garde en mémoire 10 minutes
});

// Mutation pour création/modification
const createMutation = useMutation({
  mutationFn: AppointmentService.add,
  onSuccess: () => {
    queryClient.invalidateQueries(['appointments']);
    toast.success('Rendez-vous créé !');
  },
  onError: (error) => {
    toast.error('Erreur création');
  }
});
```

### 5.2 State local avec useState
```typescript
// Gestion d'état des modales
const [isAddModalOpen, setIsAddModalOpen] = useState(false);
const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);

// État de recherche
const [searchQuery, setSearchQuery] = useState('');
const [searchResults, setSearchResults] = useState<Appointment[]>([]);

// Debounce pour la recherche
useEffect(() => {
  const timer = setTimeout(async () => {
    if (searchQuery.length >= 3) {
      const results = await AppointmentService.search(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, 300);

  return () => clearTimeout(timer);
}, [searchQuery]);
```

## 6. PATTERNS DE DÉVELOPPEMENT UTILISÉS

### 6.1 Composition de composants
```typescript
// Calendrier composé de sous-composants
<div className="calendar-container">
  <CalendarHeader onWeekChange={handleWeekChange} />
  <CalendarDayHeader days={weekDays} />
  <div className="calendar-grid">
    {weekDays.map(day => (
      <CalendarDay
        key={day.fullDate.toISOString()}
        day={day}
        appointments={getDayAppointments(day)}
        onAppointmentClick={handleAppointmentClick}
      />
    ))}
  </div>
</div>
```

### 6.2 Props drilling évité avec React Query
```typescript
// Pas besoin de passer les données en props
// Chaque composant accède directement aux données mises en cache
const AppointmentList = () => {
  const { data: appointments } = useQuery(['appointments'], AppointmentService.getAll);
  
  return (
    <div>
      {appointments?.map(appointment => 
        <AppointmentCard key={appointment.id} appointment={appointment} />
      )}
    </div>
  );
};
```

### 6.3 Error Boundaries pattern (à implémenter)
```typescript
class AppointmentErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Appointment Error:', error, errorInfo);
    // Envoyer vers service de monitoring
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Oops! Une erreur est survenue</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Réessayer
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```