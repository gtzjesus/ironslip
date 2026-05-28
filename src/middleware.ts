import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { createClient } from '@supabase/supabase-js';

// 1. `/home` es tu landing/login pública. Quitamos `/avatar` por completo.
const isPublicRoute = createRouteMatcher(['/', '/legs(.*)', '/home']);

// Initialize Supabase right inside the middleware environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default clerkMiddleware(async (auth, request) => {
  // 2. Protegemos las rutas privadas y mandamos a `/home` si no hay sesión
  if (!isPublicRoute(request)) {
    await auth.protect({
      unauthenticatedUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/home',
    });
  }

  // 3. Capturamos la sesión en el backend
  const { userId, sessionClaims } = await auth();

  if (userId) {
    const email = (sessionClaims?.email as string) || "";
    
    // 4. Sincronización directa y limpia a Supabase
    try {
      await supabase
        .from('users')
        .upsert(
          { id: userId, email: email },
          { onConflict: 'id' }
        );
    } catch (e) {
      console.error("⚠️ Background Middleware Sync Failed:", e);
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};