import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { createClient } from '@supabase/supabase-js';

// 🟢 RUTAS PÚBLICAS BLINDADAS: Abrimos sign-in, sign-up y tu laboratorio de avatares
const isPublicRoute = createRouteMatcher([
  '/', 
  '/legs(.*)', 
  '/home', 
  '/studio(.*)', 
  '/avatar(.*)', 
  '/sign-in(.*)', 
  '/sign-up(.*)'
]);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      }
    })
  : null;

export default clerkMiddleware(async (auth, request) => {
  // 1. Proteger rutas privadas
  if (!isPublicRoute(request)) {
    const fallbackUrl = new URL('/home', request.url).toString();
    
    await auth.protect({
      unauthenticatedUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || fallbackUrl,
    });
  }

  // 2. Sincronización en segundo plano Clerk ──> Supabase
  const authObject = await auth();
  const userId = authObject?.userId;
  const sessionClaims = authObject?.sessionClaims;

  if (userId && supabase) {
    // 🟢 EXTRACCIÓN SEGURO DEL EMAIL: Primero busca en el token personalizado de Clerk, 
    // si no, intenta con los metadatos estándar del fallback.
    const email = (sessionClaims?.email as string) || "";
    
    try {
      const { error } = await supabase
        .from('users')
        .upsert(
          { 
            id: userId, 
            email: email, // ⚡️ Ahora llegará lleno gracias al ajuste en el dashboard de Clerk
            avatar_skin: '/models/avatar.glb' // Aseguramos que herede su monito base
          },
          { onConflict: 'id' }
        );

      if (error) {
        console.error("⚠️ Supabase Sync Error Object:", error);
      }
    } catch (e) {
      console.error("⚠️ Background Middleware Sync Failed Exception:", e);
    }
  } else if (userId && !supabase) {
    console.error("❌ Supabase client was not initialized. Missing environment variables.");
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};