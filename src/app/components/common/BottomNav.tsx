'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Ticket, ShoppingBag, User, Scroll } from 'lucide-react';
import { useUser } from '@clerk/nextjs'; // Import Clerk hook

const navItems = [
  { name: 'Slips', href: '/slips', icon: Scroll },
  { name: 'Legs', href: '/legs', icon: Ticket },
  { name: 'Feed', href: '/home', icon: Home },
  { name: 'Shop', href: '/shop', icon: ShoppingBag },
  { name: 'Avatar', href: '/avatar', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  // Define las variables de color dependiendo del estado de autenticación
  const themeColor = isSignedIn ? 'text-iron-volt' : 'text-iron-red';
  const glowColor = isSignedIn ? 'bg-iron-volt/10' : 'bg-iron-red/10';
  const dotColor = isSignedIn ? 'bg-iron-volt' : 'bg-iron-red';

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[100] w-[100%] max-w-2xl">
      <div className="flex items-center justify-around bg-zinc-900/80 backdrop-blur-xl border-t border-white/5 p-2 shadow-xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative p-1 group flex flex-col items-center justify-center min-w-[56px]"
            >
              {/* RESPLANDOR ESTÁTICO INSTANTÁNEO CON CSS NATIVO */}
              {isActive && (
                <div className={`absolute inset-0 blur-md rounded-xl pointer-events-none transition-opacity duration-150 ${glowColor}`} />
              )}

              {/* CONTENEDOR DEL ELEMENTO */}
              <div className="relative flex flex-col items-center z-10">
                <item.icon
                  className={`w-4 h-4 transition-colors duration-200 ${
                    isActive ? themeColor : 'text-zinc-500'
                  }`}
                />
                <span
                  className={`text-[7px] mt-1 font-mono uppercase tracking-tighter transition-colors duration-200 ${
                    isActive ? themeColor : 'text-zinc-500'
                  }`}
                >
                  {item.name}
                </span>

                {/* PUNTO DE ESTADO INMEDIATO SIN RENDERS ADICIONALES */}
                {isActive && (
                  <div className={`h-[2px] w-1 mt-0.5 rounded-full ${dotColor}`} />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}