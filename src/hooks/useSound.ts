'use client';
import { useRef, useEffect } from 'react';

type SoundType = 'add' | 'remove' | 'select' | 'close' | 'open-card' | 'demon' | 'confirm';

export const useSound = () => {
  const audioContext = useRef<AudioContext | null>(null);
  const audioBuffers = useRef<Record<string, AudioBuffer>>({});

  useEffect(() => {
    // Inicializar el contexto de audio
    audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
  }, []);

  const playSound = async (soundType: SoundType) => {
    if (!audioContext.current) return;

    // Si no tenemos el buffer, lo cargamos una sola vez
    if (!audioBuffers.current[soundType]) {
      const fileName = (soundType === 'close' || soundType === 'open-card' || soundType === 'demon' || soundType === 'confirm') 
        ? `${soundType}.mp3` 
        : `${soundType}-slip.mp3`;

      const response = await fetch(`/sounds/${fileName}`);
      const arrayBuffer = await response.arrayBuffer();
      // Decodificamos el audio fuera del hilo principal
      const audioBuffer = await audioContext.current.decodeAudioData(arrayBuffer);
      audioBuffers.current[soundType] = audioBuffer;
    }

    // Reproducción ultra ligera
    const source = audioContext.current.createBufferSource();
    source.buffer = audioBuffers.current[soundType];
    
    // Crear un nodo de ganancia para controlar el volumen sin interferir
    const gainNode = audioContext.current.createGain();
    gainNode.gain.value = 0.4;
    
    source.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    source.start(0);
  };

  return { playSound };
};