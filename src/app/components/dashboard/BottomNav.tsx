'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Ticket, ShoppingBag, User } from 'lucide-react'; // Install lucide-react

const navItems = [
  { name: 'Feed', href: '/home', icon: Home },
  { name: 'Slips', href: '/slips', icon: Ticket },
  { name: 'Shop', href: '/shop', icon: ShoppingBag },
  { name: 'Account', href: '/account', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[100] w-[100%] max-w-2xl">
      <div className="flex items-center justify-around bg-zinc-900/80 backdrop-blur-xl  border-white/10 p-2  shadow-xl">
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
                  className="absolute inset-0 bg-iron-volt/10 blur-md rounded-xl"
                />
              )}
              <div className="relative flex flex-col items-center">
                <item.icon
                  className={`w-4 h-4 transition-colors ${isActive ? 'text-iron-volt' : 'text-zinc-500 group-hover:text-white'}`}
                />
                <span
                  className={`text-[8px] mt-1 font-mono uppercase tracking-tighter ${isActive ? 'text-iron-volt' : 'text-zinc-500'}`}
                >
                  {item.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
