import { clerkMiddleware, createRouteMatcher, createClerkClient } from "@clerk/nextjs/server";
import { createClient } from '@supabase/supabase-js';

// 🟢 RUTAS PÚBLICAS BLINDADAS (Quitamos /home porque ya vive en /)
const isPublicRoute = createRouteMatcher([
  '/', 
  '/legs(.*)', 
  '/studio(.*)', 
  '/avatar(.*)', 
  '/sign-in(.*)', 
  '/sign-up(.*)'
]);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    })
  : null;

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export default clerkMiddleware(async (auth, request) => {
  // 1. Proteger rutas privadas (si no es pública, redirige al root)
  if (!isPublicRoute(request)) {
    const fallbackUrl = new URL('/', request.url).toString();
    
    await auth.protect({
      unauthenticatedUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || fallbackUrl,
    });
  }

  // 2. Sincronización Clerk ──> Supabase
  const authObject = await auth();
  const userId = authObject?.userId;
  const sessionClaims = authObject?.sessionClaims;

  if (userId && supabase) {
    let email = (sessionClaims?.email as string) || "";
    
    if (!email) {
      try {
        const user = await clerk.users.getUser(userId);
        email = user.emailAddresses?.[0]?.emailAddress || "";
      } catch (clerkError) {
        console.error("❌ Falló el fetch directo a Clerk API:", clerkError);
      }
    }
    
    try {
      await supabase
        .from('users')
        .upsert(
          { id: userId, email: email, avatar_skin: '/models/avatar.glb' },
          { onConflict: 'id' }
        );
    } catch (e) {
      console.error("⚠️ Background Middleware Sync Failed Exception:", e);
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};