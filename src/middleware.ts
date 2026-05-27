import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// 1. Define which routes are strictly public
const isPublicRoute = createRouteMatcher([
  '/',                     
  '/account(.*)',          
  '/api/webhooks/clerk(.*)' 
]);

// 2. Run the Clerk authentication middleware checks
export default clerkMiddleware(async (auth, req) => {
  // If the user is trying to access a private route, enforce login protection
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

// Your existing config setup remains completely untouched and safe
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};