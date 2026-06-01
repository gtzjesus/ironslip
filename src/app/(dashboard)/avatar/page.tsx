'use client';

import AvatarCanvas from '@/components/dashboard/avatar/AvatarCanvas';
import { useUser } from '@clerk/nextjs';

export default function AvatarPage() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

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
      
      {/* NOMAS EL AVATAR FLOTANDO EN EL ESPACIO */}
      <AvatarCanvas />
    </main>
  );
}