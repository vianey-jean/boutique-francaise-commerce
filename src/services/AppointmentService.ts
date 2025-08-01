
import api from './api';
import { format, parseISO, addDays, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { AuthService } from './AuthService';
import { ReactNode } from 'react';

/**
 * Interface pour les rendez-vous
 * Représente les données d'un rendez-vous dans l'application
 */
export interface Appointment {
  lieu: ReactNode;
  id: number;
  userId: number;
  statut?: string;
  nom?: string;
  prenom?: string;
  dateNaissance?: string;
  telephone?: string;
  titre: string;
  description: string;
  date: string;
  heure: string;
  duree: number;
  location: string;
}

/**
 * Service de gestion des rendez-vous
 * Centralise toute la logique métier liée aux rendez-vous
 */
export const AppointmentService = {
  /**
   * Récupère tous les rendez-vous validés de l'utilisateur connecté
   * @returns Promise<Appointment[]> Liste des rendez-vous validés
   */
  getAll: async (): Promise<Appointment[]> => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) return [];

      const response = await api.get('/appointments', {
        headers: { 'user-id': currentUser.id.toString() }
      });

      // Filtrer seulement les rendez-vous validés pour l'affichage du calendrier
      const appointments = response.data.appointments || [];
      return appointments.filter((appointment: Appointment) => appointment.statut === 'validé');
    } catch (error) {
      // En cas d'erreur, retourner un array vide plutôt que de faire planter l'app
      return [];
    }
  },

  /**
   * Récupère tous les rendez-vous (tous statuts) de l'utilisateur connecté
   * Utilisé pour la recherche qui doit inclure les rendez-vous annulés
   * @returns Promise<Appointment[]> Liste complète des rendez-vous
   */
  getAllWithStatus: async (): Promise<Appointment[]> => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) return [];

      const response = await api.get('/appointments', {
        headers: { 'user-id': currentUser.id.toString() }
      });

      // Retourner tous les rendez-vous (validés et annulés) pour la recherche
      return response.data.appointments || [];
    } catch (error) {
      return [];
    }
  },

  /**
   * Récupère un rendez-vous par son ID
   * @param id - ID du rendez-vous
   * @returns Promise<Appointment | undefined>
   */
  getById: async (id: number): Promise<Appointment | undefined> => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) return undefined;

      const response = await api.get(`/appointments/${id}`, {
        headers: { 'user-id': currentUser.id.toString() }
      });

      return response.data.appointment;
    } catch (error) {
      return undefined;
    }
  },

  /**
   * Recherche des rendez-vous selon une requête
   * La recherche nécessite au minimum 3 caractères pour éviter trop de résultats
   * @param query - Terme de recherche
   * @returns Promise<Appointment[]> Résultats de la recherche
   */
  search: async (query: string): Promise<Appointment[]> => {
    if (query.length < 3) return [];

    try {
      // Utiliser getAllWithStatus pour obtenir tous les rendez-vous
      const allAppointments = await AppointmentService.getAllWithStatus();
      
      // Filtrer localement pour inclure tous les champs
      const filteredAppointments = allAppointments.filter(appointment => {
        const searchableFields = [
          appointment.titre?.toLowerCase() || '',
          appointment.description?.toLowerCase() || '',
          appointment.location?.toLowerCase() || '',
          appointment.nom?.toLowerCase() || '',
          appointment.prenom?.toLowerCase() || '',
          appointment.telephone || '',
          appointment.dateNaissance || '',
          appointment.date || '',
          appointment.heure || ''
        ];
        
        const searchTerm = query.toLowerCase();
        
        return searchableFields.some(field => 
          field.includes(searchTerm)
        );
      });

      return filteredAppointments;
    } catch (error) {
      return [];
    }
  },

  /**
   * Crée un nouveau rendez-vous
   * @param appointment - Données du rendez-vous (sans ID)
   * @returns Promise<Appointment | null> Rendez-vous créé ou null si erreur
   */
  add: async (appointment: Omit<Appointment, 'id'>): Promise<Appointment | null> => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) {
        toast.error('Vous devez être connecté pour ajouter un rendez-vous', {
          className: "bg-indigo-700 text-white border-indigo-600"
        });
        return null;
      }

      const response = await api.post('/appointments', appointment, {
        headers: { 'user-id': currentUser.id.toString() }
      });

      toast.success('Rendez-vous ajouté avec succès', {
        className: "bg-indigo-700 text-white border-indigo-600"
      });
      return response.data.appointment;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erreur lors de l\'ajout du rendez-vous', {
        className: "bg-indigo-700 text-white border-indigo-600"
      });
      return null;
    }
  },

  /**
   * Met à jour un rendez-vous existant
   * @param appointment - Données complètes du rendez-vous
   * @returns Promise<boolean> True si succès, false sinon
   */
  update: async (appointment: Appointment): Promise<boolean> => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) {
        toast.error('Vous devez être connecté pour modifier un rendez-vous', {
          className: "bg-indigo-700 text-white border-indigo-600"
        });
        return false;
      }

      await api.put(`/appointments/${appointment.id}`, appointment, {
        headers: { 'user-id': currentUser.id.toString() }
      });

      toast.success('Rendez-vous mis à jour avec succès', {
        className: "bg-indigo-700 text-white border-indigo-600"
      });
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erreur lors de la mise à jour du rendez-vous', {
        className: "bg-indigo-700 text-white border-indigo-600"
      });
      return false;
    }
  },

  /**
   * Supprime un rendez-vous
   * @param id - ID du rendez-vous à supprimer
   * @returns Promise<boolean> True si succès, false sinon
   */
  delete: async (id: number): Promise<boolean> => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) {
        toast.error('Vous devez être connecté pour supprimer un rendez-vous', {
          className: "bg-indigo-700 text-white border-indigo-600"
        });
        return false;
      }

      await api.delete(`/appointments/${id}`, {
        headers: { 'user-id': currentUser.id.toString() }
      });

      toast.success('Rendez-vous supprimé avec succès', {
        className: "bg-indigo-700 text-white border-indigo-600"
      });
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erreur lors de la suppression du rendez-vous', {
        className: "bg-indigo-700 text-white border-indigo-600"
      });
      return false;
    }
  },

  /**
   * Récupère les rendez-vous de la semaine courante
   * @param userId - ID utilisateur (optionnel)
   * @returns Promise<Appointment[]> Rendez-vous de la semaine
   */
  getCurrentWeekAppointments: async (userId?: number): Promise<Appointment[]> => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser && !userId) return [];

      const today = new Date();
      const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
      const endOfCurrentWeek = addDays(startOfCurrentWeek, 6);

      const startDateStr = format(startOfCurrentWeek, 'yyyy-MM-dd');
      const endDateStr = format(endOfCurrentWeek, 'yyyy-MM-dd');

      const response = await api.get(`/appointments/week/${startDateStr}/${endDateStr}`, {
        headers: { 'user-id': (userId || currentUser?.id || 0).toString() }
      });

      // Filtrer seulement les rendez-vous validés pour l'affichage du calendrier
      const appointments = response.data.appointments || [];
      return appointments.filter((appointment: Appointment) => appointment.statut === 'validé');
    } catch (error) {
      return [];
    }
  },

  /**
   * Génère les jours de la semaine courante pour l'affichage calendrier
   * Fonction pure qui ne dépend que de la date courante
   * @returns Array des jours avec métadonnées
   */
  getWeekDays: () => {
    const today = new Date();
    const monday = startOfWeek(today, { weekStartsOn: 1 });

    return Array(7)
      .fill(null)
      .map((_, index) => {
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

  /**
   * Génère les heures de travail (7h à 20h)
   * Fonction pure qui retourne toujours la même liste
   * @returns Array des heures
   */
  getHours: () => {
    return Array(14)
      .fill(null)
      .map((_, index) => {
        const hour = index + 7;
        return `${hour}:00`;
      });
  }
};
