import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { createClient } from '@supabase/supabase-js';

// 🟢 AGREGADO: '/studio(.*)' para que Clerk no bloquee el acceso a Sanity
const isPublicRoute = createRouteMatcher(['/', '/legs(.*)', '/home', '/studio(.*)']);

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
  if (!isPublicRoute(request)) {
    const fallbackUrl = new URL('/home', request.url).toString();
    
    await auth.protect({
      unauthenticatedUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || fallbackUrl,
    });
  }

  const authObject = await auth();
  const userId = authObject?.userId;
  const sessionClaims = authObject?.sessionClaims;

  if (userId && supabase) {
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