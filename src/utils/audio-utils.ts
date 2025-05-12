
// File for audio utilities

/**
 * Play a sound file
 * @param soundFile - Path to the sound file
 * @param loop - Whether to loop the sound (default: false)
 * @returns The audio element
 */
export const playSound = (soundFile: string, loop = false): HTMLAudioElement => {
  const audio = new Audio(soundFile);
  audio.loop = loop;
  
  const playPromise = audio.play();
  
  if (playPromise !== undefined) {
    playPromise.catch((error) => {
      console.error("Error playing sound:", error);
    });
  }
  
  return audio;
};

/**
 * Stop an audio element from playing
 * @param audio - The audio element to stop
 */
export const stopSound = (audio: HTMLAudioElement | null) => {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
};

/**
 * Create an audio context to analyze audio
 */
export const createAudioAnalyzer = async (stream: MediaStream) => {
  const audioContext = new AudioContext();
  const audioSource = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  
  audioSource.connect(analyser);
  
  return {
    audioContext,
    audioSource,
    analyser
  };
};

// Export types
export type AudioAnalyzer = {
  audioContext: AudioContext;
  audioSource: MediaStreamAudioSourceNode;
  analyser: AnalyserNode;
};
