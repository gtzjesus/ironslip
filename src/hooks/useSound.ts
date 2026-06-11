'use client';

export const useSound = () => {
  const playSound = (soundType: 'add' | 'remove' | 'select' | 'close' | 'open-card' | 'demon' | 'confirm') => {
    const fileName = (soundType === 'close' || soundType === 'open-card' || soundType === 'demon' || soundType === 'confirm') 
      ? `${soundType}.mp3` 
      : `${soundType}-slip.mp3`;
    
    // Creamos una nueva instancia cada vez para evitar que se solapen o se corten
    const audio = new Audio(`/sounds/${fileName}`);
    audio.volume = 0.5; // Un poco más fuerte para que se note
    
    // Intentar reproducir
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log("Audio playback prevented:", error);
      });
    }
  };
  return { playSound };
};