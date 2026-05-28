import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// This tells Clerk: "DO NOT block requests going to our webhook path!"
const isPublicRoute = createRouteMatcher(['/api/webhooks(.*)']);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Runs middleware on all paths except static assets
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always runs middleware for API routes
    '/(api|trpc)(.*)',
  ],
};