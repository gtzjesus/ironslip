'use client';
import { usePathname } from 'next/navigation';
import { Home, Ticket, ShoppingBag, User, Scroll } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

const navItems = [
  { name: 'Slips', href: '/slips', icon: Scroll },
  { name: 'Legs', href: '/legs', icon: Ticket },
  { name: 'Feed', href: '/', icon: Home },
  { name: 'Shop', href: '/shop', icon: ShoppingBag },
  { name: 'Avatar', href: '/avatar', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  const themeColor = isSignedIn ? 'text-iron-volt' : 'text-iron-red';
  const glowColor = isSignedIn ? 'bg-iron-volt/10' : 'bg-iron-red/10';
  const dotColor = isSignedIn ? 'bg-iron-volt' : 'bg-iron-red';

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Si ya estamos en la misma ruta, no recargamos a lo tonto
    if (pathname === href) {
      e.preventDefault();
      return;
    }

    // 🚀 RECARGA LIMPIA TOTAL: Mata el contexto de WebGL corrupto y arranca fresco
    e.preventDefault();
    window.location.href = href;
  };

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[100] w-[100%] max-w-2xl">
      <div className="flex items-center justify-around bg-zinc-900/90 backdrop-blur-xl border-t border-white/10 p-2 shadow-2xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavigation(e, item.href)}
              className="relative p-1 group flex flex-col items-center justify-center min-w-[56px] cursor-pointer"
            >
              {isActive && (
                <div className={`absolute inset-0 blur-md rounded-xl pointer-events-none transition-opacity duration-150 ${glowColor}`} />
              )}

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

                {isActive && (
                  <div className={`h-[2px] w-1 mt-0.5 rounded-full ${dotColor}`} />
                )}
              </div>
            </a>
          );
        })}
      </div>
    </nav>
  );
}