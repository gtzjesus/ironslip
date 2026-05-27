import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Esto le dice a Clerk que ignore por completo la seguridad en la ruta del webhook
const isPublicRoute = createRouteMatcher(['/api/webhooks(.*)']);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Ejecuta el middleware en todas las páginas, excepto archivos estáticos
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Siempre ejecuta el middleware para rutas de API
    '/(api|trpc)(.*)',
  ],
};