'use client';

import { LayoutDashboard, ShoppingCart, Users, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/admin/customers', icon: Users, label: 'Customers' },
  { href: '/admin/analytics', icon: BarChart, label: 'Analytics' },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-lg border-t z-50 flex justify-around items-center">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link href={item.href} key={item.label}>
            <motion.div
              className="flex flex-col items-center gap-1 text-muted-foreground"
              whileTap={{ scale: 0.9 }}
            >
              <item.icon
                className={cn(
                  'h-6 w-6 transition-colors',
                  isActive ? 'text-primary' : ''
                )}
              />
              <span
                className={cn(
                  'text-xs font-medium transition-colors',
                  isActive ? 'text-primary' : ''
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="admin-active-indicator"
                  className="h-1 w-1 bg-primary rounded-full"
                />
              )}
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}
