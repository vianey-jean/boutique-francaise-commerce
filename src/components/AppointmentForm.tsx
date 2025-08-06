import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Calendar as CalendarIcon,
  Clock,
  Crown,
  Star,
  Sparkles,
  User,
  Phone,
  Cake,
  CheckCircle,
  Reply,
  Edit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import DateOfBirthInput from './DateOfBirthInput';

import { AppointmentService, Appointment } from '@/services/AppointmentService';
import { ClientService } from '@/services/ClientService';
import { AuthService } from '@/services/AuthService';
import { toast } from 'sonner';

/**
 * Schéma de validation (zod)
 * date est une string 'yyyy-MM-dd' pour compatibilité API.
 */
const formSchema = z.object({
  statut: z.enum(['validé', 'annulé'], {
    required_error: "Veuillez sélectionner un statut.",
  }),
  nom: z.string().optional(),
  prenom: z.string().optional(),
  dateNaissance: z.string().optional(),
  telephone: z.string().optional(),
  titre: z.string().min(2, {
    message: "Le titre doit contenir au moins 2 caractères.",
  }),
  description: z.string().min(5, {
    message: "La description doit contenir au moins 5 caractères.",
  }),
  date: z.string().min(1, { message: "La date est requise (format YYYY-MM-DD)." }),
  heure: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Format d'heure invalide (HH:MM).",
  }),
  duree: z.number().min(15, {
    message: "La durée minimale est de 15 minutes.",
  }).max(480, {
    message: "La durée maximale est de 480 minutes.",
  }),
  location: z.string().min(3, {
    message: "Le lieu doit contenir au moins 3 caractères.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  appointment?: Appointment;
  onSuccess: (updatedAppointment?: Appointment) => void;
  onCancel: () => void;
  disableDate?: boolean;
  mode?: 'add' | 'edit';
  selectedDate?: Date | null;
};

const AppointmentForm = ({
  appointment,
  onSuccess,
  onCancel,
  disableDate = false,
  mode = 'add',
  selectedDate = null,
}: Props) => {
  const isEditing = !!appointment;
  const currentUser = AuthService.getCurrentUser();

  const getDefaultDate = () => {
    if (appointment && appointment.date) return appointment.date;
    if (selectedDate) return format(selectedDate, 'yyyy-MM-dd');
    return format(new Date(), 'yyyy-MM-dd');
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      statut: (appointment?.statut || 'validé') as 'validé' | 'annulé',
      nom: appointment?.nom || '',
      prenom: appointment?.prenom || '',
      dateNaissance: appointment?.dateNaissance || '',
      telephone: appointment?.telephone || '',
      titre: appointment?.titre || '',
      description: appointment?.description || '',
      date: getDefaultDate(),
      heure: appointment?.heure || '09:00',
      duree: appointment?.duree ?? 60,
      location: appointment?.location || appointment?.lieu || '',
    },
  });

  const [isAvailable, setIsAvailable] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableHours, setAvailableHours] = useState<string[]>([]);

  const checkAvailability = async (dateStr: string, currentHeure?: string) => {
    try {
      const dateObj = parseISO(dateStr);
      const dateFormatted = format(dateObj, 'yyyy-MM-dd');
      const appointments = await AppointmentService.getCurrentWeekAppointments();
      const dayAppointments = appointments.filter(a => a.date === dateFormatted);

      const allHours: string[] = [];
      for (let hour = 6; hour <= 20; hour++) {
        for (let min = 0; min < 60; min += 10) {
          allHours.push(`${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
        }
      }

      const unavailableHours = new Set<string>();

      dayAppointments.forEach(app => {
        if (isEditing && appointment && app.id === appointment.id) return;

        const [appH, appM] = app.heure.split(':').map(Number);
        const appStart = appH * 60 + appM;
        const appEnd = appStart + (app.duree || 0);

        allHours.forEach(time => {
          const [h, m] = time.split(':').map(Number);
          const t = h * 60 + m;
          if (t >= appStart && t < appEnd) {
            unavailableHours.add(time);
          }
        });
      });

      const available = allHours.filter(h => !unavailableHours.has(h));
      if (currentHeure && !available.includes(currentHeure)) available.push(currentHeure);
      available.sort();

      setAvailableHours(available);
      return available.length > 0;
    } catch (err) {
      console.error('Erreur checkAvailability', err);
      setAvailableHours([]);
      return false;
    }
  };

  const watchedDate = form.watch('date');
  const watchedHeure = form.watch('heure');

  useEffect(() => {
    if (!watchedDate) return;
    checkAvailability(watchedDate, isEditing ? watchedHeure : undefined)
      .then(available => setIsAvailable(available));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedDate, isEditing]);

  const checkAndAddClient = async (values: FormValues) => {
    const clientNom = (values.nom || '').trim();
    const clientPrenom = (values.prenom || '').trim();
    const clientTelephone = (values.telephone || '').trim();
    const clientAdresse = (values.location || '').trim();

    if (!clientNom || !clientPrenom) return;

    try {
      const existingClients = await ClientService.getAllClients();
      const clientExists = existingClients.some(client =>
        client.nom?.toLowerCase() === clientNom.toLowerCase() &&
        client.prenom?.toLowerCase() === clientPrenom.toLowerCase()
      );

      if (!clientExists) {
        const newClientData = {
          nom: clientNom,
          prenom: clientPrenom,
          email: '',
          telephone: clientTelephone,
          adresse: clientAdresse,
          dateNaissance: values.dateNaissance || undefined,
          notes: `Client ajouté automatiquement via rendez-vous: ${values.titre}`,
        };

        await ClientService.addClient(newClientData);
        console.log('Nouveau client ajouté automatiquement:', newClientData);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification/ajout du client:', error);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!currentUser) {
      toast.error("Vous devez être connecté pour ajouter/modifier un rendez-vous");
      return;
    }

    setIsSubmitting(true);
    try {
      // debug utile si besoin:
      // console.log('Données envoyées:', values);

      await checkAndAddClient(values);

      if (isEditing && appointment) {
        const updatedAppointment: Appointment = {
          ...appointment,
          nom: values.nom,
          prenom: values.prenom,
          dateNaissance: values.dateNaissance,
          telephone: values.telephone,
          titre: values.titre,
          description: values.description,
          date: values.date,
          heure: values.heure,
          duree: values.duree,
          location: values.location,
          lieu: values.location,
          statut: values.statut,
        };

        const success = await AppointmentService.update(updatedAppointment);
        if (success) {
          toast.success("Rendez-vous modifié avec succès");
          onSuccess(updatedAppointment);
        } else {
          toast.error("Échec de la modification du rendez-vous");
        }
      } else {
        const newAppointmentData: Omit<Appointment, 'id'> & { userId: string } = {
          userId: currentUser.id,
          nom: values.nom,
          prenom: values.prenom,
          dateNaissance: values.dateNaissance,
          telephone: values.telephone,
          titre: values.titre,
          description: values.description,
          date: values.date,
          heure: values.heure,
          duree: values.duree,
          location: values.location,
          lieu: values.location,
          statut: values.statut,
        };

        const newAppointment = await AppointmentService.add(newAppointmentData);
        if (newAppointment) {
          toast.success("Rendez-vous ajouté avec succès");
          onSuccess(newAppointment);
        } else {
          toast.error("Échec de la création du rendez-vous");
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du rendez-vous:', error);
      toast.error("Une erreur est survenue lors de l'enregistrement du rendez-vous");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDateForCalendar = (dateStr?: string) => {
    try {
      if (!dateStr) return null;
      return parseISO(dateStr);
    } catch {
      return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 max-h-[80vh] overflow-y-auto border border-gray-100">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Statut */}
          <FormField
            control={form.control}
            name="statut"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-bold text-primary flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Action
                </FormLabel>

                {/* === Correction importante: use value (contrôlé) au lieu de defaultValue === */}
                <Select onValueChange={(v) => field.onChange(v)} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-gray-50/50 rounded-xl border-2 border-gray-200 focus:border-primary/60 h-12 text-base font-medium hover:bg-gray-50">
                      <SelectValue placeholder="Sélectionner le statut" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white border border-gray-200">
                    <SelectItem value="validé" className="bg-green-50 text-green-800 font-medium hover:bg-green-100">Validé</SelectItem>
                    <SelectItem value="annulé" className="bg-red-50 text-red-800 font-medium hover:bg-red-100">Annulé</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Titre */}
          <FormField
            control={form.control}
            name="titre"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-bold text-primary flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Titre du rendez-vous
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Rendez-vous avec..."
                    className="bg-gray-50/50 rounded-xl border-2 border-gray-200 focus:border-primary/60 h-12 text-base font-medium hover:bg-gray-50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nom / Prénom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold text-primary flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nom (facultatif)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nom de famille"
                      className="bg-gray-50/50 rounded-xl border-2 border-gray-200 focus:border-primary/60 h-12 text-base font-medium hover:bg-gray-50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prenom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold text-primary flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Prénom (facultatif)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Prénom"
                      className="bg-gray-50/50 rounded-xl border-2 border-gray-200 focus:border-primary/60 h-12 text-base font-medium hover:bg-gray-50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* DateNaissance / Telephone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="dateNaissance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold text-primary flex items-center gap-2">
                    <Cake className="w-4 h-4" />
                    Date de naissance (facultatif)
                  </FormLabel>
                  <FormControl>
                    <DateOfBirthInput
                      value={field.value || ''}
                      onChange={field.onChange}
                      className="bg-gray-50/50 rounded-xl border-2 border-gray-200 focus:border-primary/60 h-12 text-base font-medium hover:bg-gray-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold text-primary flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Numéro de téléphone (facultatif)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="06 XX XX XX XX"
                      className="bg-gray-50/50 rounded-xl border-2 border-gray-200 focus:border-primary/60 h-12 text-base font-medium hover:bg-gray-50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Date / Heure */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className=" font-bold text-primary flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          disabled={disableDate}
                          className={`pl-4 text-black font-medium h-12 rounded-xl border-2 border-gray-200 hover:border-primary/40 ${!field.value ? "text-muted-foreground" : ""} ${disableDate ? "opacity-60 cursor-not-allowed bg-gray-100" : "bg-gray-50/50 hover:bg-white hover:text-black"}`}
                        >
                          {field.value ? (
                            ((): string => {
                              try {
                                return format(parseISO(field.value), "EEEE d MMMM yyyy", { locale: fr });
                              } catch {
                                return field.value;
                              }
                            })()
                          ) : (
                            <span>Sélectionner une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    {!disableDate && (
                      <PopoverContent className="w-auto p-0 bg-white border border-gray-200 premium-shadow-lg" align="start">
                        <Calendar
                          mode="single"
                          selected={getDateForCalendar(field.value) || undefined}
                          onSelect={(d: Date) => {
                            if (d) {
                              field.onChange(format(d, 'yyyy-MM-dd'));
                            }
                          }}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                          className="rounded-2xl bg-white"
                        />
                      </PopoverContent>
                    )}
                  </Popover>

                  {disableDate && (
                    <div className="flex items-center gap-2 text-sm text-primary bg-blue-50 rounded-lg p-2">
                      <Star className="w-4 h-4" />
                      <span>Date fixée suite au déplacement du rendez-vous</span>
                    </div>
                  )}
                  {selectedDate && !disableDate && (
                    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-2">
                      <Star className="w-4 h-4" />
                      <span>Date sélectionnée dans le calendrier</span>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="heure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold text-primary flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Heure
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50/50 focus:border-primary/60 h-12 text-base font-medium hover:bg-gray-50"
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        disabled={!isAvailable || availableHours.length === 0}
                      >
                        {availableHours.length === 0 ? (
                          <option value="">Aucun horaire disponible</option>
                        ) : (
                          availableHours.map(hour => (
                            <option key={hour} value={hour}>
                              {hour}
                            </option>
                          ))
                        )}
                      </select>
                      <Clock className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 opacity-50 text-primary" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Durée */}
          <FormField
            control={form.control}
            name="duree"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-bold text-primary flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Durée (minutes)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={15}
                    max={480}
                    step={15}
                    className="bg-gray-50/50 rounded-xl border-2 border-gray-200 focus:border-primary/60 h-12 text-base font-medium hover:bg-gray-50"
                    {...field}
                    onChange={e => {
                      const val = parseInt(e.target.value || '0', 10);
                      field.onChange(Number.isNaN(val) ? 0 : val);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-bold text-primary flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Lieu
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Adresse du rendez-vous"
                    className="bg-gray-50/50 rounded-xl border-2 border-gray-200 focus:border-primary/60 h-12 text-base font-medium hover:bg-gray-50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-bold text-primary flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Détails du rendez-vous..."
                    className="bg-gray-50/50 rounded-xl border-2 border-gray-200 focus:border-primary/60 min-h-[120px] text-base font-medium resize-none hover:bg-gray-50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isAvailable && availableHours.length === 0 && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-800 p-4 rounded-xl border-2 border-yellow-200 premium-shadow">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-600" />
                <span className="font-bold">Aucun horaire n'est disponible pour cette date. Veuillez sélectionner une autre date.</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-8 py-3 text-black border-2 border-red-500 luxury-card hover:border-red-600 font-semibold rounded-2xl premium-hover"
              disabled={isSubmitting}
            >
              <Reply className="mr-2 h-4 w-4 text-black" />
              Annuler
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || (!isAvailable && availableHours.length === 0)}
              className="px-8 py-3 btn-premium premium-shadow-lg font-semibold rounded-2xl premium-hover"
            >
              <Edit className="h-4 w-4 mr-2" />
              {isSubmitting
                ? (isEditing ? 'Modification...' : 'Création...')
                : (isEditing ? 'Modifier le rendez-vous' : 'Ajouter le rendez-vous')}
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AppointmentForm;
