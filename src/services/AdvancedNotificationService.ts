
import { toast } from 'sonner';
import { Bell, Clock, Calendar, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { AppointmentService, Appointment } from './AppointmentService';
import { format, isToday, isTomorrow, addMinutes, differenceInMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface NotificationSettings {
  reminders: {
    enabled: boolean;
    times: number[]; // minutes before appointment
  };
  email: {
    enabled: boolean;
    confirmations: boolean;
    reminders: boolean;
  };
  desktop: {
    enabled: boolean;
    sound: boolean;
  };
  sms: {
    enabled: boolean;
    phoneNumber: string;
  };
}

export class AdvancedNotificationService {
  private static settings: NotificationSettings = {
    reminders: {
      enabled: true,
      times: [120, 60, 30, 15] // 2h, 1h, 30min, 15min avant
    },
    email: {
      enabled: true,
      confirmations: true,
      reminders: true
    },
    desktop: {
      enabled: true,
      sound: true
    },
    sms: {
      enabled: true,
      phoneNumber: '00262692842370'
    }
  };

  private static timers = new Map<string, NodeJS.Timeout>();

  static initializeNotifications() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    this.scheduleUpcomingReminders();
  }

  static async scheduleUpcomingReminders() {
    try {
      const appointments = await AppointmentService.getAll();
      this.clearAllTimers();
      
      appointments.forEach(appointment => {
        this.scheduleAppointmentReminders(appointment);
      });
    } catch (error) {
      console.error('Erreur lors de la planification des rappels:', error);
    }
  }

  private static scheduleAppointmentReminders(appointment: Appointment) {
    const appointmentDateTime = new Date(`${appointment.date} ${appointment.heure}`);
    const now = new Date();

    this.settings.reminders.times.forEach(minutesBefore => {
      const reminderTime = addMinutes(appointmentDateTime, -minutesBefore);
      
      if (reminderTime > now) {
        const timerId = `${appointment.id}-${minutesBefore}`;
        const timeoutMs = differenceInMinutes(reminderTime, now) * 60 * 1000;
        
        const timer = setTimeout(() => {
          this.showReminder(appointment, minutesBefore);
          
          // Envoyer SMS si c'est 2h avant
          if (minutesBefore === 120) {
            this.sendSMSReminder(appointment);
          }
        }, timeoutMs);
        
        this.timers.set(timerId, timer);
      }
    });
  }

  private static showReminder(appointment: Appointment, minutesBefore: number) {
    const message = `🔔 Rappel: ${appointment.titre} dans ${minutesBefore} minutes`;
    
    // Toast notification avec background bleu-violet
    toast.info(message, {
      description: `${appointment.location} - ${appointment.heure}`,
      duration: 10000,
      className: "bg-indigo-700 text-white border-indigo-600",
      action: {
        label: 'Voir détails',
        onClick: () => console.log('Voir rendez-vous:', appointment.id)
      }
    });

    // Desktop notification
    if (this.settings.desktop.enabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(message, {
        body: `${appointment.location} - ${appointment.heure}`,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    }
  }

  private static async sendSMSReminder(appointment: Appointment) {
    if (!this.settings.sms.enabled || !this.settings.sms.phoneNumber) return;

    try {
      const message = `Rappel: Vous avez un rendez-vous "${appointment.titre}" le ${format(new Date(appointment.date), 'dd/MM/yyyy', { locale: fr })} à ${appointment.heure} au ${appointment.location}. N'oubliez pas!`;
      
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: this.settings.sms.phoneNumber,
          message: message,
          appointmentId: appointment.id
        })
      });

      if (response.ok) {
        console.log('SMS envoyé avec succès');
        toast.success('SMS de rappel envoyé', {
          className: "bg-indigo-700 text-white border-indigo-600"
        });
      } else {
        console.error('Erreur lors de l\'envoi du SMS');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du SMS:', error);
    }
  }

  static showAppointmentCreated(appointment: Appointment) {
    toast.success('Rendez-vous créé avec succès !', {
      description: `${appointment.titre} - ${format(new Date(appointment.date), 'dd/MM/yyyy', { locale: fr })} à ${appointment.heure}`,
      duration: 5000,
      className: "bg-indigo-700 text-white border-indigo-600"
    });
  }

  static showAppointmentUpdated(appointment: Appointment) {
    toast.success('Rendez-vous modifié avec succès !', {
      description: `${appointment.titre} - ${format(new Date(appointment.date), 'dd/MM/yyyy', { locale: fr })} à ${appointment.heure}`,
      duration: 5000,
      className: "bg-indigo-700 text-white border-indigo-600"
    });
  }

  static showAppointmentDeleted(title: string) {
    toast.error('Rendez-vous supprimé', {
      description: `"${title}" a été supprimé définitivement`,
      duration: 5000,
      className: "bg-indigo-700 text-white border-indigo-600"
    });
  }

  static showConflictWarning(appointment: Appointment, conflictingAppointments: Appointment[]) {
    toast.warning('Conflit de rendez-vous détecté !', {
      description: `${conflictingAppointments.length} autre(s) rendez-vous à la même heure`,
      duration: 8000,
      className: "bg-indigo-700 text-white border-indigo-600",
      action: {
        label: 'Voir conflits',
        onClick: () => console.log('Conflits:', conflictingAppointments)
      }
    });
  }

  static showUpcomingToday(appointments: Appointment[]) {
    if (appointments.length > 0) {
      toast.info(`${appointments.length} rendez-vous aujourd'hui`, {
        description: `Prochain: ${appointments[0].titre} à ${appointments[0].heure}`,
        duration: 8000,
        className: "bg-indigo-700 text-white border-indigo-600"
      });
    }
  }

  static clearAllTimers() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
  }

  static updateSettings(newSettings: Partial<NotificationSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem('notificationSettings', JSON.stringify(this.settings));
    this.scheduleUpcomingReminders();
  }

  static getSettings(): NotificationSettings {
    const saved = localStorage.getItem('notificationSettings');
    if (saved) {
      this.settings = JSON.parse(saved);
    }
    return this.settings;
  }
}
