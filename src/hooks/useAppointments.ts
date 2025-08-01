
/**
 * Hook personnalisé pour la gestion des rendez-vous
 * Centralise la logique d'état des rendez-vous
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppointmentService, Appointment } from '../services/AppointmentService';
import { toast } from 'sonner';

/**
 * Hook pour récupérer tous les rendez-vous
 * @returns Données des rendez-vous avec état de chargement
 */
export const useAppointments = () => {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: AppointmentService.getAll,
    staleTime: 5 * 60 * 1000, // Cache 5 minutes
    gcTime: 10 * 60 * 1000, // Garde en mémoire 10 minutes (remplace cacheTime)
  });
};

/**
 * Hook pour récupérer les rendez-vous de la semaine
 * @returns Données des rendez-vous de la semaine
 */
export const useWeekAppointments = () => {
  return useQuery({
    queryKey: ['appointments', 'week'],
    queryFn: () => AppointmentService.getCurrentWeekAppointments(), // Pas de paramètre userId
    staleTime: 2 * 60 * 1000, // Cache 2 minutes pour les données temps réel
  });
};

/**
 * Hook pour créer un nouveau rendez-vous
 * @returns Mutation function avec état
 */
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AppointmentService.add,
    onSuccess: () => {
      // Invalider le cache pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Rendez-vous créé avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la création du rendez-vous');
    }
  });
};

/**
 * Hook pour mettre à jour un rendez-vous
 * @returns Mutation function avec état
 */
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AppointmentService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Rendez-vous mis à jour avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour du rendez-vous');
    }
  });
};

/**
 * Hook pour supprimer un rendez-vous
 * @returns Mutation function avec état
 */
export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AppointmentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Rendez-vous supprimé avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression du rendez-vous');
    }
  });
};

/**
 * Hook pour la recherche de rendez-vous
 * @param query - Terme de recherche
 * @returns Résultats de recherche avec état
 */
export const useSearchAppointments = (query: string) => {
  return useQuery({
    queryKey: ['appointments', 'search', query],
    queryFn: () => AppointmentService.search(query),
    enabled: query.length >= 3, // N'exécuter que si au moins 3 caractères
    staleTime: 1 * 60 * 1000, // Cache 1 minute pour la recherche
  });
};
