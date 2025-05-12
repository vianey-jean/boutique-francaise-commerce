
/**
 * Audio utilities for the application
 * Simple ringtone in base64 format
 */

// Une sonnerie simple en base64 (format MP3 valide)
const RINGTONE_BASE64 = "SUQzAwAAAAAAJlRQRTEAAAAcAAAAU291bmRKYXkuY29tIFNvdW5kIEVmZmVjdHMA//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAKAAAIiAASEhISEhISGRkZGRkZGSAgICAgICAoKCgoKCgoLy8vLy8vLzY2NjY2Njg8PDw8PDw8RERERERERERERERE//uQxAAAAg0SxRDAKvBdGCRNYPu0EERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERf/7kMQAAAwEAfhAAALgAAA0gAAABERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERER//uQxAAAAAABpAAAACAAADSAAAAEREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREQ==";

/**
 * Creates a blob URL for the ringtone audio
 * @returns A blob URL for the ringtone audio or null if there was an error
 */
export const createAudioBlobUrl = (): string | null => {
  try {
    // Nous utilisons un atob sécurisé pour décoder le base64
    const byteCharacters = Buffer.from(RINGTONE_BASE64, 'base64').toString('binary');
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'audio/mpeg' });
    
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error creating audio blob URL:", error);
    
    // Solution de secours: utiliser une sonnerie statique si disponible
    try {
      // Créer un blob audio simple comme solution de secours
      const oscillator = new window.AudioContext().createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = 440; // La note A4
      
      const destinationStream = oscillator.connect(new window.AudioContext().createMediaStreamDestination());
      const audioTrack = destinationStream.stream.getAudioTracks()[0];
      const stream = new MediaStream([audioTrack]);
      
      return URL.createObjectURL(stream);
    } catch (fallbackError) {
      console.error("Fallback audio creation failed:", fallbackError);
      return null;
    }
  }
};
