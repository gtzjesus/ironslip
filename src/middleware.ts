import { clerkMiddleware, createRouteMatcher, createClerkClient } from "@clerk/nextjs/server";
import { createClient } from '@supabase/supabase-js';

// 🟢 RUTAS PÚBLICAS BLINDADAS
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

// Inicializamos el cliente de Clerk para consultas directas al backend
const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export default clerkMiddleware(async (auth, request) => {
  // 1. Proteger rutas privadas
  if (!isPublicRoute(request)) {
    const fallbackUrl = new URL('/home', request.url).toString();
    
    await auth.protect({
      unauthenticatedUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || fallbackUrl,
    });
  }

  // 2. Sincronización Clerk ──> Supabase
  const authObject = await auth();
  const userId = authObject?.userId;
  const sessionClaims = authObject?.sessionClaims;

  if (userId && supabase) {
    // Intentamos sacar el email del token de sesión primero
    let email = (sessionClaims?.email as string) || "";
    
    // 🛡️ BYPASS INFALIBLE: Si el token está vacío (por temas de caché en Dev Mode), 
    // hacemos un fetch directo al API de Clerk usando el userId en un milisegundo.
    if (!email) {
      try {
        console.log(`🔍 [Middleware] Email vacío en sesión para ${userId}. Extrayendo vía API...`);
        const user = await clerk.users.getUser(userId);
        email = user.emailAddresses?.[0]?.emailAddress || "";
      } catch (clerkError) {
        console.error("❌ Falló el fetch directo a Clerk API:", clerkError);
      }
    }
    
    try {
      const { error } = await supabase
        .from('users')
        .upsert(
          { 
            id: userId, 
            email: email, 
            avatar_skin: '/models/avatar.glb' 
          },
          { onConflict: 'id' }
        );

      if (error) {
        console.error("⚠️ Supabase Sync Error Object:", error);
      } else {
        console.log(`✅ Sync exitoso para: ${email || "SIN_EMAIL"}`);
      }
    } catch (e) {
      console.error("⚠️ Background Middleware Sync Failed Exception:", e);
    }
  } else if (userId && !supabase) {
    console.error("❌ Supabase client was not initialized.");
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};