import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { createClient } from '@supabase/supabase-js';

// 1. Rutas públicas
const isPublicRoute = createRouteMatcher(['/', '/legs(.*)', '/home']);

// 2. Inicialización segura de Supabase (Previene crashes por variables faltantes en producción)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Inicializamos el cliente condicionalmente solo si las variables existen
const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false, // Obligatorio para entornos Edge/Serverless
      }
    })
  : null;

export default clerkMiddleware(async (auth, request) => {
  // 3. Protegemos las rutas privadas primero
  if (!isPublicRoute(request)) {
    await auth.protect({
      unauthenticatedUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/home',
    });
  }

  // 4. Capturamos la sesión en el backend de forma segura
  const authObject = await auth();
  const userId = authObject?.userId;
  const sessionClaims = authObject?.sessionClaims;

  // 5. Sincronización a Supabase
  if (userId && supabase) {
    // Si usas Clerk y no has mapeado el email en los JWT claims personalizados, 
    // a veces viene en 'primary_email_address' o dentro del objeto primaryEmail
    const email = (sessionClaims?.email as string) || "";
    
    try {
      const { error } = await supabase
        .from('users')
        .upsert(
          { id: userId, email: email },
          { onConflict: 'id' }
        );

      if (error) {
        console.error("⚠️ Supabase Sync Error Object:", error);
      }
    } catch (e) {
      console.error("⚠️ Background Middleware Sync Failed Exception:", e);
    }
  } else if (userId && !supabase) {
    console.error("❌ Supabase client was not initialized. Missing environment variables in production.");
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};