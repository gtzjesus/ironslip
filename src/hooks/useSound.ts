/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useRef, useEffect } from 'react';

type SoundType =
  | 'add'
  | 'remove'
  | 'select'
  | 'close'
  | 'open-card'
  | 'demon'
  | 'confirm';

// 🔒 INSTANCIA ÚNICA GLOBAL: Fuera del hook para que no se duplique en memoria jamás
let globalAudioContext: AudioContext | null = null;
const globalAudioBuffers: Record<string, AudioBuffer> = {};

export const useSound = () => {
  useEffect(() => {
    // Solo se inicializa una vez en todo el ciclo de vida de la app
    if (!globalAudioContext && typeof window !== 'undefined') {
      globalAudioContext = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }
  }, []);

  const playSound = async (soundType: SoundType) => {
    if (!globalAudioContext) return;

    if (globalAudioContext.state === 'suspended') {
      await globalAudioContext.resume();
    }

    // Si el sonido no está en caché, lo descargamos (Lazy Load)
    if (!globalAudioBuffers[soundType]) {
      const fileName = ['close', 'open-card', 'demon', 'confirm'].includes(
        soundType,
      )
        ? `${soundType}.mp3`
        : `${soundType}-slip.mp3`;

      try {
        const response = await fetch(`/sounds/${fileName}`, {
          cache: 'force-cache',
        }); // ⚡️ Fuerza la caché del navegador
        if (!response.ok) return;

        const arrayBuffer = await response.arrayBuffer();
        // Usamos la sintaxis moderna basada en promesas para decodificar más rápido
        const audioBuffer =
          await globalAudioContext.decodeAudioData(arrayBuffer);
        globalAudioBuffers[soundType] = audioBuffer;
      } catch (error) {
        console.error(`❌ Error decoding audio for ${soundType}:`, error);
        return;
      }
    }

    // Reproducción limpia
    if (globalAudioBuffers[soundType]) {
      const source = globalAudioContext.createBufferSource();
      source.buffer = globalAudioBuffers[soundType];

      const gainNode = globalAudioContext.createGain();
      gainNode.gain.value = 0.25; // 🔋 Bajamos levemente el volumen para evitar distorsión en bocinas de papa

      source.connect(gainNode);
      gainNode.connect(globalAudioContext.destination);
      source.start(0);
    }
  };

  return { playSound };
};
