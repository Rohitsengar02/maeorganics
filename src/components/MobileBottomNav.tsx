'use client';

import { Home, ShoppingBag, User, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '#search', icon: Search, label: 'Search' },
  { href: '#cart', icon: ShoppingBag, label: 'Cart' },
  { href: '#profile', icon: User, label: 'Profile' },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-lg border-t border-gray-200/80 flex justify-around items-center z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link href={item.href} key={item.label}>
            <motion.div
              className="flex flex-col items-center gap-1 text-gray-600"
              whileTap={{ scale: 0.9 }}
            >
              <item.icon
                className={cn(
                  'h-6 w-6 transition-colors',
                  isActive ? 'text-yellow-500' : 'text-gray-400'
                )}
              />
              <span
                className={cn(
                  'text-xs font-medium transition-colors',
                  isActive ? 'text-yellow-600' : 'text-gray-500'
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="h-1 w-1 bg-yellow-500 rounded-full"
                />
              )}
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}
