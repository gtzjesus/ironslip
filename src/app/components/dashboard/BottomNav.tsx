'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Ticket, ShoppingBag, User } from 'lucide-react'; // Install lucide-react

const navItems = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'Slips', href: '/slips', icon: Ticket },
  { name: 'Shop', href: '/shop', icon: ShoppingBag },
  { name: 'Account', href: '/account', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md">
      <div className="flex items-center justify-around bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl">
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
                  className={`w-6 h-6 transition-colors ${isActive ? 'text-iron-volt' : 'text-zinc-500 group-hover:text-white'}`}
                />
                <span
                  className={`text-[10px] mt-1 font-mono uppercase tracking-tighter ${isActive ? 'text-iron-volt' : 'text-zinc-500'}`}
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
