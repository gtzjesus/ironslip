'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Ticket, ShoppingBag, User } from 'lucide-react';
import { useUser } from '@clerk/nextjs'; // Import Clerk hook

const navItems = [
  { name: 'Feed', href: '/home', icon: Home },
  { name: 'Slips', href: '/slips', icon: Ticket },
  { name: 'Shop', href: '/shop', icon: ShoppingBag },
  { name: 'Account', href: '/account', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  // Define the theme color based on auth status
  const themeColor = isSignedIn ? 'text-iron-volt' : 'text-iron-red';
  const glowColor = isSignedIn ? 'bg-iron-volt/10' : 'bg-iron-red/10';

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[100] w-[100%] max-w-2xl">
      <div className="flex items-center justify-around bg-zinc-900/80 backdrop-blur-xl  border-white/5 p-2 shadow-xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative p-3 group"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-glow"
                  // Dynamic background color for the glow
                  className={`absolute inset-0 blur-md rounded-xl ${glowColor}`}
                  transition={{ type: 'spring', duration: 0.5 }}
                />
              )}

              <div className="relative flex flex-col items-center">
                <item.icon
                  className={`w-4 h-4 transition-colors duration-300 ${
                    isActive
                      ? themeColor
                      : 'text-zinc-500 group-hover:text-white'
                  }`}
                />
                <span
                  className={`text-[8px] mt-1 font-mono uppercase tracking-tighter transition-colors duration-300 ${
                    isActive ? themeColor : 'text-zinc-500'
                  }`}
                >
                  {item.name}
                </span>

                {/* Optional: Small status dot under active item */}
                {isActive && (
                  <motion.div
                    layoutId="active-dot"
                    className={`h-[2px] w-1 mt-1 rounded-full ${isSignedIn ? 'bg-iron-volt' : 'bg-iron-red'}`}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
