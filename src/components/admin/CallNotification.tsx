
import React, { useEffect, useRef } from 'react';
import { useVideoCall } from '@/contexts/VideoCallContext';
import { 
  PhoneCall,
  PhoneOff,
  Video,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

// Utilisons un fichier audio statique au lieu d'un base64 problématique
// Une sonnerie simple en MP3 ou WAV serait idéale, mais nous utiliserons un son de notification du navigateur pour l'instant
const CallNotification = () => {
  const { incomingCall, acceptCall, rejectCall } = useVideoCall();
  
  // Utiliser l'API de notification native du navigateur pour le son
  useEffect(() => {
    if (incomingCall) {
      // Demander la permission pour les notifications si nécessaire
      if ("Notification" in window && Notification.permission !== "denied") {
        Notification.requestPermission();
      }
      
      // Créer une notification avec son
      if ("Notification" in window && Notification.permission === "granted") {
        const notification = new Notification("Appel entrant", {
          icon: "/favicon.ico",
          body: `Appel ${incomingCall.isVideo ? 'vidéo' : 'audio'} de ${incomingCall.name}`,
          silent: false, // Utiliser le son de notification du navigateur
          tag: "incoming-call", // Empêche les notifications multiples
        });
        
        // Fermer la notification quand l'utilisateur répond ou rejette l'appel
        return () => {
          notification.close();
        };
      }
    }
  }, [incomingCall]);
  
  // Handle accept call with error handling
  const handleAcceptCall = async () => {
    try {
      await acceptCall();
    } catch (error) {
      console.error("Error accepting call:", error);
      toast.error("Impossible d'accepter l'appel. Vérifiez vos permissions de microphone et caméra.");
    }
  };
  
  if (!incomingCall) return null;
  
  return (
    <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 border z-50 w-80 animate-in fade-in slide-in-from-top-5 duration-300" role="alertdialog" aria-labelledby="incoming-call-title" aria-describedby="incoming-call-desc">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-red-800 text-white rounded-full flex items-center justify-center mr-4">
          <User className="h-6 w-6" />
        </div>
        <div>
          <h3 id="incoming-call-title" className="font-medium">{incomingCall.name}</h3>
          <p id="incoming-call-desc" className="text-sm text-muted-foreground">
            {incomingCall.isVideo ? "Appel vidéo entrant" : "Appel audio entrant"}
          </p>
        </div>
        {incomingCall.isVideo ? <Video className="ml-auto h-5 w-5" /> : <PhoneCall className="ml-auto h-5 w-5" />}
      </div>
      
      <div className="flex space-x-2 justify-center">
        <Button
          onClick={rejectCall}
          className="bg-red-600 hover:bg-red-700 text-white"
          size="sm"
        >
          <PhoneOff className="h-4 w-4 mr-2" />
          Refuser
        </Button>
        <Button
          onClick={handleAcceptCall}
          className="bg-green-600 hover:bg-green-700 text-white"
          size="sm"
        >
          <PhoneCall className="h-4 w-4 mr-2" />
          Répondre
        </Button>
      </div>
    </div>
  );
};

export default CallNotification;
