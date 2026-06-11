'use client';
import { useEffect, useRef } from 'react';

// Definimos los tipos de sonido que tenemos
type SoundType = 'add' | 'remove' | 'select' | 'close' | 'open-card' | 'demon' | 'confirm';

export const useSound = () => {
  // Usamos un objeto useRef para mantener los objetos Audio cargados en memoria
  const audioCache = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    // Lista de todos los sonidos posibles
    const sounds: SoundType[] = ['add', 'remove', 'select', 'close', 'open-card', 'demon', 'confirm'];
    
    sounds.forEach((type) => {
      const fileName = (type === 'close' || type === 'open-card' || type === 'demon' || type === 'confirm') 
        ? `${type}.mp3` 
        : `${type}-slip.mp3`;
      
      const audio = new Audio(`/sounds/${fileName}`);
      audio.load(); // Forzamos la precarga aquí
      audioCache.current[type] = audio;
    });
  }, []);

  const playSound = (soundType: SoundType) => {
    const audio = audioCache.current[soundType];
    if (audio) {
      // Reiniciamos el tiempo al inicio si ya se estaba reproduciendo
      audio.currentTime = 0;
      audio.volume = 0.4;
      audio.play().catch((err) => console.log("Playback failed:", err));
    }
  };

  return { playSound };
};