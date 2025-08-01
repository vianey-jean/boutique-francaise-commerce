# RIZIKY-AGENDAS - RÉSUMÉ DU PROJET

## Vue d'ensemble
**Riziky-Agendas** est une application web Full Stack de gestion de rendez-vous développée avec une architecture moderne React/Node.js. L'application permet aux utilisateurs de créer, consulter, modifier et supprimer leurs rendez-vous via une interface utilisateur intuitive et responsive.

## Informations générales
- **Nom du projet** : Riziky-Agendas
- **Version** : 2.7.0 (Frontend) / 2.1.0 (Backend)
- **Type** : Application web Full Stack
- **Domaine** : Gestion de rendez-vous / Planification
- **Statut** : En développement actif

## Technologies principales

### Frontend (React)
- **Framework** : React 18.3.1 avec TypeScript
- **Build Tool** : Vite 5.4.1
- **UI Framework** : Tailwind CSS + shadcn/ui
- **Router** : React Router DOM 6.26.2
- **State Management** : React Query (TanStack Query) 5.56.2
- **Formulaires** : React Hook Form 7.53.0 + Zod validation
- **Dates** : date-fns 3.6.0
- **Icônes** : Lucide React 0.462.0
- **Notifications** : Sonner 1.5.0

### Backend (Node.js)
- **Runtime** : Node.js
- **Framework** : Express.js 4.18.2
- **Storage** : Système de fichiers JSON (mock database)
- **Emails** : Nodemailer 6.9.7
- **Upload** : Multer 1.4.5
- **CORS** : cors 2.8.5
- **Environment** : dotenv 16.3.1

## Objectifs du projet
1. **Gestion complète des rendez-vous** : CRUD complet avec validation
2. **Interface utilisateur moderne** : Design responsive et accessible
3. **Système d'authentification** : Connexion/inscription sécurisée
4. **Notifications** : Alertes en temps réel et emails automatiques
5. **Recherche avancée** : Recherche de rendez-vous par mots-clés
6. **Calendrier interactif** : Vue hebdomadaire des rendez-vous
7. **Auto-logout** : Déconnexion automatique après inactivité

## Architecture globale
```
Frontend (React/TypeScript)
     ↕ HTTP/REST API
Backend (Node.js/Express)
     ↕ File System
JSON Files (Data Storage)
```

## Fonctionnalités principales

### Authentification
- Inscription avec validation complète
- Connexion sécurisée
- Réinitialisation de mot de passe
- Déconnexion automatique après 5 minutes d'inactivité
- Vérification d'email unique

### Gestion des rendez-vous
- Création avec formulaire validé (titre, description, date, heure, durée, lieu)
- Modification en temps réel
- Suppression avec confirmation
- Vue calendrier hebdomadaire
- Recherche instantanée (minimum 3 caractères)
- Notifications email automatiques

### Interface utilisateur
- Design responsive (mobile-first)
- Mode sombre/clair
- Navigation intuitive avec navbar
- Composants réutilisables
- Animations et transitions fluides
- Notifications toast en temps réel

### Sécurité
- Validation côté client et serveur
- Authentification par headers HTTP
- Contrôle d'accès aux données utilisateur
- Protection contre les erreurs communes

## Public cible
- **Utilisateurs primaires** : Professionnels ayant besoin de gérer leurs rendez-vous
- **Secteurs** : Services, consultation, médical, formation, etc.
- **Niveau technique** : Utilisateurs finaux sans compétences techniques particulières

## Déploiement
- **Frontend** : Compatible avec tout hébergeur statique (Vercel, Netlify, etc.)
- **Backend** : Serveur Node.js (Heroku, Railway, VPS, etc.)
- **Port par défaut** : 10000 (configurable via variable d'environnement)

## Évolutions futures possibles
- Intégration base de données relationnelle (PostgreSQL/MySQL)
- Système de rôles et permissions
- Calendrier multi-utilisateurs
- Synchronisation avec calendriers externes (Google Calendar, Outlook)
- Application mobile (React Native)
- API webhooks
- Rappels automatiques
- Gestion des fuseaux horaires
- Export/import de données