import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import WeekCalendar from '@/components/Weekcalendar';
import AppointmentForm from '@/components/AppointmentForm';
import AppointmentSelector from '@/components/AppointmentSelector';
import AppointmentDetails from '@/components/AppointmentDetails';
import { AppointmentService, Appointment } from '@/services/AppointmentService';
import ActionButtons from '@/components/ActionButtons';
import AppointmentModal from '@/components/AppointmentModal';
import SearchAppointmentForm from '@/components/SearchAppointmentForm';
import AppointmentStatsDisplay from '@/components/AppointmentStatsDisplay';
import { Calendar, Sparkles, Zap, Star, Crown, Diamond } from 'lucide-react';

/**
 * Page du tableau de bord
 * Centre de gestion des rendez-vous avec calendrier et actions CRUD
 */
const DashboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // États pour gérer les rendez-vous et les différentes modales
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
  const [originalAppointment, setOriginalAppointment] = useState<Appointment | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Gérer le paramètre edit de l'URL
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      const appointmentId = parseInt(editId, 10);
      if (!isNaN(appointmentId)) {
        // Charger le rendez-vous à modifier
        AppointmentService.getById(appointmentId).then(appointment => {
          if (appointment) {
            setActiveAppointment(appointment);
            setIsAddModalOpen(true);
            // Nettoyer le paramètre URL
            setSearchParams(params => {
              params.delete('edit');
              return params;
            });
          }
        }).catch(error => {
          console.error('Erreur lors du chargement du rendez-vous:', error);
        });
      }
    }
  }, [searchParams, setSearchParams]);

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleOpenAdd = () => {
    console.log('Opening add modal');
    setActiveAppointment(null);
    setOriginalAppointment(null);
    setSelectedDate(null);
    setShowAppointmentDetails(false);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (appointment?: Appointment) => {
    console.log('Opening edit modal', appointment);
    if (appointment) {
      setActiveAppointment(appointment);
      // Si c'est un drag and drop, marquer comme tel pour fixer la date
      if ((appointment as any)._isDragAndDrop) {
        setOriginalAppointment(appointment);
      } else {
        setOriginalAppointment(null);
      }
      setSelectedDate(null);
      setIsEditModalOpen(false);
      setShowAppointmentDetails(false);
      setIsAddModalOpen(true);
    } else {
      setIsEditModalOpen(true);
    }
  };

  const handleOpenDelete = () => {
    console.log('Opening delete modal');
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (appointment: Appointment) => {
    console.log('Confirming delete for appointment:', appointment);
    setActiveAppointment(appointment);
    setIsDeleteModalOpen(false);
    setIsConfirmDeleteOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!activeAppointment) return;
    
    try {
      const success = await AppointmentService.delete(activeAppointment.id);
      if (success) {
        setIsConfirmDeleteOpen(false);
        setActiveAppointment(null);
        refreshData();
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const handleOpenSearch = () => {
    console.log('Opening search modal');
    setIsSearchModalOpen(true);
  };

  const handleViewAppointment = (appointment: Appointment) => {
    console.log('Viewing appointment', appointment);
    setActiveAppointment(appointment);
    setOriginalAppointment(null);
    setSelectedDate(null);
    setShowAppointmentDetails(true);
    setIsSearchModalOpen(false);
  };

  // Nouvelle fonction pour gérer l'ajout d'un rendez-vous avec date sélectionnée
  const handleAddAppointment = (date: Date) => {
    console.log('Adding appointment for date:', date);
    setSelectedDate(date);
    setActiveAppointment(null);
    setOriginalAppointment(null);
    setShowAppointmentDetails(false);
    setIsAddModalOpen(true);
  };

  const handleFormSuccess = () => {
    console.log('Form success, closing modals');
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsSearchModalOpen(false);
    setShowAppointmentDetails(false);
    setActiveAppointment(null);
    setOriginalAppointment(null);
    setSelectedDate(null);
    refreshData();
  };

  const handleCloseModals = () => {
    console.log('Closing all modals');
    
    if (originalAppointment && activeAppointment) {
      console.log('Restoring original appointment after cancel');
      refreshData();
    }
    
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsSearchModalOpen(false);
    setShowAppointmentDetails(false);
    setActiveAppointment(null);
    setOriginalAppointment(null);
    setSelectedDate(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden mt-[80px] px-2 sm:px-4 lg:px-6">
      {/* Enhanced luxury background - plus clair */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-2xl floating-animation delay-500"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-full blur-xl floating-animation delay-700"></div>
      </div>

      <div className="container mx-auto py-6 sm:py-8 lg:py-12 relative z-10">
        {/* En-tête premium du tableau de bord */}
        <div className="mb-8 lg:mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 sm:w-24 lg:w-28 h-20 sm:h-24 lg:h-28 premium-gradient rounded-2xl lg:rounded-3xl premium-shadow-xl mb-6 lg:mb-8 relative overflow-hidden floating-animation">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl lg:rounded-3xl"></div>
            <Calendar className="w-8 sm:w-10 lg:w-14 h-8 sm:h-10 lg:h-14 text-white relative z-10" />
            <div className="absolute -top-2 -right-2 lg:-top-3 lg:-right-3 w-6 sm:w-8 lg:w-10 h-6 sm:h-8 lg:h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center premium-shadow">
              <Crown className="w-3 sm:w-4 lg:w-5 h-3 sm:h-4 lg:h-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -left-1 lg:-bottom-2 lg:-left-2 w-5 sm:w-6 lg:w-8 h-5 sm:h-6 lg:h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
              <Star className="w-3 sm:w-4 lg:w-4 h-3 sm:h-4 lg:h-4 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold luxury-text-gradient mb-3 lg:mb-4">
            Tableau de bord Premium
          </h1>
          <div className="flex items-center justify-center gap-2 sm:gap-3 max-w-xl lg:max-w-2xl mx-auto px-4">
            <Diamond className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0" />
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground font-medium text-center">
              Gérez vos rendez-vous avec élégance et sophistication
            </p>
            <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-primary animate-pulse flex-shrink-0" />
          </div>
        </div>

        {/* Statistiques des rendez-vous */}
        <AppointmentStatsDisplay refreshTrigger={refreshTrigger} />

        {/* Boutons d'action premium */}
        <div className="mb-6 lg:mb-8">
          <ActionButtons 
            onAdd={handleOpenAdd}
            onEdit={() => handleOpenEdit()}
            onDelete={handleOpenDelete}
            onSearch={handleOpenSearch}
          />
        </div>

        {/* Calendrier hebdomadaire avec effet ultra premium */}
        <div className="calendar-luxury rounded-2xl lg:rounded-3xl premium-shadow-xl border-0 overflow-hidden relative glow-effect">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-primary/5 to-purple-500/10"></div>
          <div className="absolute top-4 lg:top-6 right-4 lg:right-6 flex items-center gap-2 lg:gap-3 z-10">
            <div className="flex items-center gap-1 lg:gap-2 bg-white/20 backdrop-blur-sm rounded-full px-2 sm:px-3 lg:px-4 py-1 lg:py-2 border border-white/30">
              <div className="w-2 lg:w-3 h-2 lg:h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs lg:text-sm text-primary font-bold">En direct</span>
            </div>
            <Crown className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 text-primary floating-animation" />
          </div>
          <div className="relative z-10 p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-3 lg:gap-4 mb-6 lg:mb-8">
              <div className="w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 premium-gradient rounded-xl lg:rounded-2xl flex items-center justify-center">
                <Zap className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold luxury-text-gradient">
                  Calendrier Intelligent Premium
                </h2>
                <p className="text-sm lg:text-base text-muted-foreground font-medium">Excellence dans la gestion du temps</p>
              </div>
              <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
                <Star className="w-4 lg:w-5 h-4 lg:h-5 text-yellow-400" />
                <Diamond className="w-3 lg:w-4 h-3 lg:h-4 text-primary" />
                <Sparkles className="w-4 lg:w-5 h-4 lg:h-5 text-primary animate-pulse" />
              </div>
            </div>
            <WeekCalendar 
              key={`calendar-${refreshTrigger}`} 
              onAppointmentClick={handleViewAppointment}
              onAddAppointment={handleAddAppointment}
              onEditAppointment={handleOpenEdit}
            />
          </div>
        </div>

        {/* Modal pour ajouter/modifier un rendez-vous */}
        {isAddModalOpen && (
          <AppointmentModal 
            isOpen={isAddModalOpen}
            onClose={handleCloseModals}
            title={activeAppointment ? "Modifier le rendez-vous" : "Ajouter un rendez-vous"}
            mode={activeAppointment ? "edit" : "add"}
            appointment={activeAppointment || undefined}
            onSuccess={handleFormSuccess}
          >
            <AppointmentForm 
              appointment={activeAppointment || undefined}
              onSuccess={handleFormSuccess}
              onCancel={handleCloseModals}
              disableDate={!!activeAppointment && !!originalAppointment}
              selectedDate={selectedDate}
            />
          </AppointmentModal>
        )}

        {isEditModalOpen && (
          <AppointmentModal 
            isOpen={isEditModalOpen}
            onClose={handleCloseModals}
            title="Sélectionner un rendez-vous à modifier"
            mode="select"
            onSuccess={handleFormSuccess}
            onSelect={(appointment) => handleOpenEdit(appointment)}
          >
            <AppointmentSelector 
              onSelect={(appointment) => handleOpenEdit(appointment)}
              onCancel={handleCloseModals}
              mode="edit"
            />
          </AppointmentModal>
        )}

        {isDeleteModalOpen && (
          <AppointmentModal 
            isOpen={isDeleteModalOpen}
            onClose={handleCloseModals}
            title="Sélectionner un rendez-vous à supprimer"
            mode="delete"
            onSuccess={handleFormSuccess}
          >
            <AppointmentSelector 
              onSelect={handleConfirmDelete}
              onCancel={handleCloseModals}
              mode="delete"
            />
          </AppointmentModal>
        )}

        {/* Modal de confirmation de suppression */}
        {isConfirmDeleteOpen && activeAppointment && (
          <AppointmentModal 
            isOpen={isConfirmDeleteOpen}
            onClose={handleCloseModals}
            title="Confirmer la suppression"
            mode="delete"
            appointment={activeAppointment}
            onSuccess={handleFormSuccess}
          >
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200/50 rounded-2xl p-6 premium-shadow">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-red-800 mb-2">
                    Êtes-vous sûr de vouloir supprimer ce rendez-vous ?
                  </h3>
                  <div className="bg-white/80 rounded-lg p-4 mb-4">
                    <p className="font-semibold text-gray-800">{activeAppointment.titre}</p>
                    <p className="text-gray-600">{activeAppointment.date} à {activeAppointment.heure}</p>
                    <p className="text-gray-600">{activeAppointment.location}</p>
                  </div>
                  <p className="text-red-600 font-medium">
                    Cette action est définitive et ne peut pas être annulée.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                <button 
                  onClick={handleCloseModals}
                  className="order-2 sm:order-1 px-6 py-3 bg-white border-2 border-gray-300 text-black hover:bg-gray-50 hover:border-gray-400 font-semibold rounded-2xl transition-all duration-200"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleDeleteConfirmed}
                  className="order-1 sm:order-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 premium-shadow-lg font-semibold rounded-2xl transition-all duration-200"
                >
                  Oui, supprimer
                </button>
              </div>
            </div>
          </AppointmentModal>
        )}

        {isSearchModalOpen && (
          <AppointmentModal 
            isOpen={isSearchModalOpen}
            onClose={handleCloseModals}
            title="Rechercher un rendez-vous"
            mode="search"
            onSuccess={handleFormSuccess}
          >
            <SearchAppointmentForm onSelect={handleViewAppointment} />
          </AppointmentModal>
        )}

        {activeAppointment && showAppointmentDetails && (
          <AppointmentDetails
            appointment={activeAppointment}
            open={showAppointmentDetails}
            onOpenChange={setShowAppointmentDetails}
            onEdit={() => handleOpenEdit(activeAppointment)}
            onDelete={handleFormSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
