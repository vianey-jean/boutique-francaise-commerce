
import React, { useEffect, useRef, useState } from 'react';
import { useVideoCall } from '@/contexts/VideoCallContext';
import { 
  PhoneCall,
  PhoneOff,
  Video,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { createAudioBlobUrl } from '@/utils/audio-utils';

const CallNotification = () => {
  const { incomingCall, acceptCall, rejectCall } = useVideoCall();
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);
  const [ringtoneBlobUrl, setRingtoneBlobUrl] = useState<string | null>(null);
  
  // Créer le blob URL pour le son au chargement du composant
  useEffect(() => {
    const setupRingtone = async () => {
      try {
        // Créer un élément audio simple avec une fréquence comme solution de secours
        const audio = new Audio();
        audio.loop = true;
        audio.preload = 'auto';
        audio.volume = 0.7;
        
        // Essayer de créer un blob URL pour la sonnerie
        const blobUrl = createAudioBlobUrl();
        if (blobUrl) {
          setRingtoneBlobUrl(blobUrl);
          audio.src = blobUrl;
        } else {
          // Solution de secours: utiliser un fichier statique
          audio.src = `${import.meta.env.BASE_URL || ''}/sounds/ringtone.mp3`;
        }
        
        // Gérer les erreurs
        audio.addEventListener('error', (e) => {
          console.error("Ringtone error:", e);
          // Utiliser une notification comme solution de secours
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Appel entrant", {
              icon: "/favicon.ico",
              silent: false
            });
          }
        });
        
        ringtoneRef.current = audio;
      } catch (err) {
        console.error("Error setting up ringtone:", err);
      }
    };
    
    setupRingtone();
    
    // Nettoyer le blob URL à la destruction du composant
    return () => {
      if (ringtoneRef.current) {
        ringtoneRef.current.pause();
        ringtoneRef.current.src = '';
      }
      
      if (ringtoneBlobUrl) {
        URL.revokeObjectURL(ringtoneBlobUrl);
      }
    };
  }, []);
  
  // Jouer/arrêter la sonnerie quand incomingCall change
  useEffect(() => {
    if (incomingCall && ringtoneRef.current) {
      console.log("Playing ringtone for incoming call from:", incomingCall.name);
      
      const playPromise = ringtoneRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.error("Could not play ringtone:", err);
          
          // Demander la permission pour les notifications comme solution de secours
          if ("Notification" in window && Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
              if (permission === "granted") {
                new Notification("Appel entrant de " + incomingCall.name, {
                  icon: "/favicon.ico"
                });
              }
            });
          }
        });
      }
    } else if (ringtoneRef.current) {
      // Arrêter la sonnerie
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }
    
    // Nettoyage
    return () => {
      if (ringtoneRef.current) {
        ringtoneRef.current.pause();
        ringtoneRef.current.currentTime = 0;
      }
    };
  }, [incomingCall]);
  
  // Gérer l'acceptation de l'appel avec gestion des erreurs
  const handleAcceptCall = async () => {
    try {
      console.log("Accepting call from:", incomingCall?.name);
      
      // Arrêter la sonnerie avant d'accepter l'appel
      if (ringtoneRef.current) {
        ringtoneRef.current.pause();
        ringtoneRef.current.currentTime = 0;
      }
      
      await acceptCall();
    } catch (error) {
      console.error("Error accepting call:", error);
      toast.error("Impossible d'accepter l'appel. Vérifiez vos permissions de microphone et caméra.");
    }
  };
  
  if (!incomingCall) return null;
  
  return (
    <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 border z-50 w-80 animate-in fade-in slide-in-from-top-5 duration-300" role="alertdialog" aria-label="Appel entrant">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-red-800 text-white rounded-full flex items-center justify-center mr-4">
          <User className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-medium">{incomingCall.name}</h3>
          <p className="text-sm text-muted-foreground">
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
