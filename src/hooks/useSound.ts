'use client';
import { useRef, useEffect } from 'react';

type SoundType = 'add' | 'remove' | 'select' | 'close' | 'open-card' | 'demon' | 'confirm';
/* shadow-copy de tu useSound blindado */
export const useSound = () => {
  const audioContext = useRef<AudioContext | null>(null);
  const audioBuffers = useRef<Record<string, AudioBuffer>>({});

  useEffect(() => {
    audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
  }, []);

  const playSound = async (soundType: SoundType) => {
    if (!audioContext.current) return;

    // Rescatar el contexto si el navegador lo suspendió por políticas de autoplay
    if (audioContext.current.state === 'suspended') {
      await audioContext.current.resume();
    }

    if (!audioBuffers.current[soundType]) {
      const fileName = (soundType === 'close' || soundType === 'open-card' || soundType === 'demon' || soundType === 'confirm') 
        ? `${soundType}.mp3` 
        : `${soundType}-slip.mp3`;

      try {
        const response = await fetch(`/sounds/${fileName}`);
        
        // Si el archivo no existe (404), detenemos la ejecución antes de romper el decoder
        if (!response.ok) {
          console.warn(`⚠️ Sound file not found: /sounds/${fileName}`);
          return;
        }

        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.current.decodeAudioData(arrayBuffer);
        audioBuffers.current[soundType] = audioBuffer;
      } catch (error) {
        console.error(`❌ Error decoding audio for ${soundType}:`, error);
        return; // Salida limpia sin romper el runtime de la UI
      }
    }

    // Ejecución segura del nodo de audio
    if (audioBuffers.current[soundType]) {
      const source = audioContext.current.createBufferSource();
      source.buffer = audioBuffers.current[soundType];
      
      const gainNode = audioContext.current.createGain();
      gainNode.gain.value = 0.4;
      
      source.connect(gainNode);
      gainNode.connect(audioContext.current.destination);
      source.start(0);
    }
  };

  return { playSound };
};