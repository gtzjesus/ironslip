'use server';

import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// 🟢 Inicialización directa del servidor usando tus variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      }
    })
  : null;

/**
 * Recupera la ruta del modelo 3D (GLB) del usuario autenticado desde Supabase.
 */
export async function getUserAvatarSkin() {
  try {
    const { userId } = await auth();
    
    // Si no hay sesión o Supabase no se inicializó, fallback seguro
    if (!userId || !supabase) {
      return { success: false, avatarSkin: '/models/avatar.glb' };
    }

    const { data, error } = await supabase
      .from('users')
      .select('avatar_skin')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.error('❌ Error al consultar avatar_skin en servidor:', error?.message);
      return { success: false, avatarSkin: '/models/avatar.glb' };
    }

    // Retornamos el skin de la DB o el default
    return { 
      success: true, 
      avatarSkin: data.avatar_skin || '/models/avatar.glb' 
    };
  } catch (err) {
    console.error('💥 Crash catastrófico en getUserAvatarSkin:', err);
    return { success: false, avatarSkin: '/models/avatar.glb' };
  }
}