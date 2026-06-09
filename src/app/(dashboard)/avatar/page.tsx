'use client';

import { useState, useEffect } from 'react';
import AvatarCanvas from '@/components/dashboard/avatar/AvatarCanvas';
import { useUser } from '@clerk/nextjs';

// Importamos la acción limpia que creamos en su propio archivo
import { getUserAvatarSkin } from '@/actions/supabase/avatar';

export default function AvatarPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [avatarSkin, setAvatarSkin] = useState<string>('/models/avatar.glb');
  const [loadingSkin, setLoadingSkin] = useState<boolean>(true);
  
  // 🟢 ESTADO PARA CONTROLAR LA ANIMACIÓN ACTUAL
  const [currentAnimation, setCurrentAnimation] = useState<string>('breathingidle');

  useEffect(() => {
    async function fetchUserSkin() {
      if (isLoaded && isSignedIn) {
        try {
          const res = await getUserAvatarSkin();
          setAvatarSkin(res.avatarSkin);
        } catch (error) {
          console.error('❌ Failed to fetch dynamic avatar skin:', error);
        } finally {
          setLoadingSkin(false);
        }
      }
    }
    fetchUserSkin();
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || loadingSkin) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <p className="text-zinc-500 font-mono text-[10px] animate-pulse tracking-[0.3em]">
          INITIALIZING_AVATAR_DATA...
        </p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-zinc-700 font-mono text-xs uppercase tracking-widest">
        Access_Denied
      </div>
    );
  }

  return (
    <main className="w-screen h-screen bg-black relative overflow-hidden">
      <meta name="theme-color" content="#000000" />
      
      {/* EL AVATAR DINÁMICO CON LA PROP DE ANIMACIÓN */}
      <AvatarCanvas avatarUrl={avatarSkin} activeAnimation={currentAnimation} />

      {/* 🟢 BOTONERA FLOTANTE PARA PASAR EL TEST EN CALIENTE */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex gap-4 bg-zinc-950/80 border border-zinc-800 p-2 rounded-lg backdrop-blur-md">
        <button 
          onClick={() => setCurrentAnimation('breathingidle')}
          className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all rounded ${
            currentAnimation === 'breathingidle' 
              ? 'bg-white text-black font-bold' 
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Respirar (Idle)
        </button>
        <button 
          onClick={() => setCurrentAnimation('deadlift')}
          className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all rounded ${
            currentAnimation === 'deadlift' 
              ? 'bg-red-600 text-white font-bold shadow-[0_0_15px_rgba(220,38,38,0.5)]' 
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Peso Muerto (deadlift)
        </button>
      </div>
    </main>
  );
}