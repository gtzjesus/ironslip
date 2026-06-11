'use client';
import { useRef } from 'react';

type SoundType = 'add' | 'remove' | 'select' | 'close' | 'open-card' | 'demon' | 'confirm';

export const useSound = () => {
  // Solo guardamos los audios una vez que se han usado
  const audioCache = useRef<Record<string, HTMLAudioElement>>({});

  const playSound = (soundType: SoundType) => {
    // Si no está en caché, lo creamos y cargamos en ese instante
    if (!audioCache.current[soundType]) {
      const fileName = (soundType === 'close' || soundType === 'open-card' || soundType === 'demon' || soundType === 'confirm') 
        ? `${soundType}.mp3` 
        : `${soundType}-slip.mp3`;
      
      const audio = new Audio(`/sounds/${fileName}`);
      audioCache.current[soundType] = audio;
    }

    const audio = audioCache.current[soundType];
    
    // Reproducción robusta
    audio.currentTime = 0;
    audio.volume = 0.4;
    
    // Play es asíncrono, si ya se está reproduciendo, lo resetamos
    audio.play().catch((err) => console.log("Playback failed:", err));
  };

  return { playSound };
};