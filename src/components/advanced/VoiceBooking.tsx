import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceCommand {
  text: string;
  confidence: number;
  timestamp: Date;
}

export function VoiceBooking() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [commands, setCommands] = useState<VoiceCommand[]>([]);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'fr-FR';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);

        if (finalTranscript) {
          const command: VoiceCommand = {
            text: finalTranscript,
            confidence: event.results[event.results.length - 1][0].confidence,
            timestamp: new Date()
          };
          setCommands(prev => [...prev, command]);
          processVoiceCommand(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Erreur de reconnaissance vocale');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const processVoiceCommand = async (command: string) => {
    setIsProcessing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('rendez-vous') || lowerCommand.includes('rendez vous')) {
      speak('Je traite votre demande de rendez-vous. Puis-je avoir plus de détails ?');
      toast.success('🎤 Commande vocale: Nouveau rendez-vous détecté', {
        className: "bg-indigo-700 text-white border-indigo-600"
      });
    } else if (lowerCommand.includes('annuler')) {
      speak('Voulez-vous annuler un rendez-vous existant ?');
      toast.info('🎤 Commande vocale: Annulation détectée', {
        className: "bg-indigo-700 text-white border-indigo-600"
      });
    } else if (lowerCommand.includes('planning') || lowerCommand.includes('calendrier')) {
      speak('Affichage du planning en cours...');
      toast.info('🎤 Commande vocale: Affichage du planning', {
        className: "bg-indigo-700 text-white border-indigo-600"
      });
    } else {
      speak('Je n\'ai pas compris votre demande. Pouvez-vous répéter ?');
    }
    
    setIsProcessing(false);
  };

  const speak = (text: string) => {
    if (!speechEnabled) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setIsListening(true);
      recognitionRef.current.start();
      speak('Je vous écoute...');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const clearCommands = () => {
    setCommands([]);
    setTranscript('');
  };

  return (
    <div className="space-y-6">
      <Card className="luxury-card premium-shadow-lg">
        <CardHeader>
          <CardTitle className="luxury-text-gradient flex items-center gap-2">
            <Mic className="h-6 w-6" />
            Assistant Vocal Intelligent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Voice Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              onClick={isListening ? stopListening : startListening}
              size="lg"
              className={`relative h-20 w-20 rounded-full premium-gradient text-white border-0 ${
                isListening ? 'glow-effect' : ''
              }`}
              disabled={isProcessing}
            >
              {isListening ? (
                <MicOff className="h-8 w-8" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
              {isListening && (
                <div className="absolute inset-0 rounded-full animate-ping bg-blue-400/20"></div>
              )}
            </Button>
            
            <div className="flex flex-col space-y-2">
              <Button
                onClick={() => setSpeechEnabled(!speechEnabled)}
                variant="outline"
                size="sm"
                className="luxury-card"
              >
                {speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              
              <Button
                onClick={clearCommands}
                variant="outline"
                size="sm"
                className="luxury-card"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Status */}
          <div className="text-center space-y-2">
            {isListening && (
              <Badge className="premium-gradient text-white">
                🎤 En écoute...
              </Badge>
            )}
            {isProcessing && (
              <Badge className="premium-gradient text-white">
                🧠 Traitement en cours...
              </Badge>
            )}
          </div>

          {/* Live Transcript */}
          {transcript && (
            <Card className="luxury-card">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Transcription en direct:</h4>
                <p className="text-sm bg-blue-50 p-3 rounded-lg">{transcript}</p>
              </CardContent>
            </Card>
          )}

          {/* Command History */}
          {commands.length > 0 && (
            <Card className="luxury-card">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Historique des commandes:</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto premium-scroll">
                  {commands.slice(-5).reverse().map((command, index) => (
                    <div key={index} className="flex items-start space-x-2 p-2 bg-blue-50 rounded-lg">
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(command.confidence * 100)}%
                      </Badge>
                      <p className="text-sm flex-1">{command.text}</p>
                      <span className="text-xs text-gray-500">
                        {command.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Voice Commands Help */}
          <Card className="luxury-card">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Commandes vocales disponibles:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>• "Prendre un rendez-vous"</div>
                <div>• "Annuler un rendez-vous"</div>
                <div>• "Voir mon planning"</div>
                <div>• "Prochain rendez-vous"</div>
                <div>• "Créer un mémo"</div>
                <div>• "Partager le planning"</div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}