
import { ReactNode } from 'react';

export interface Appointment {
  lieu?: string;
  id: number;
  userId: number | string;
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
