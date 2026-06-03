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

  // Si no está firmado, pantalla negra simple de bloqueo
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
      
      {/* EL AVATAR DINÁMICO FLOTANDO EN EL ESPACIO */}
      {/* Le pasamos la ruta real de Supabase como prop */}
      <AvatarCanvas avatarUrl={avatarSkin} />
    </main>
  );
}