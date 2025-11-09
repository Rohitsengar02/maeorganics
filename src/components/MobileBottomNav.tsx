'use client';

import { Home, ShoppingBag, User, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/shop', icon: Store, label: 'Shop' },
  { href: '#cart', icon: ShoppingBag, label: 'Cart' },
  { href: '/account', icon: User, label: 'Profile' },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { openCart, cartCount } = useCart();
  const isProductPage = pathname.startsWith('/shop/');

  return (
    <nav className={cn(
        "sm:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-lg border-t border-gray-200/80 flex justify-around items-center z-50",
        isProductPage
    )}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const isCart = item.label === 'Cart';

        if (isCart) {
            return (
                <button
                    key={item.label}
                    onClick={openCart}
                    className="flex flex-col items-center gap-1 text-gray-600 relative"
                >
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                            {cartCount}
                        </span>
                    )}
                    <item.icon className='h-6 w-6 text-gray-400' />
                    <span className='text-xs font-medium text-gray-500'>
                        {item.label}
                    </span>
                </button>
            )
        }

        return (
          <Link href={item.href} key={item.label}>
            <motion.div
              className="flex flex-col items-center gap-1 text-gray-600"
              whileTap={{ scale: 0.9 }}
            >
              <item.icon
                className={cn(
                  'h-6 w-6 transition-colors',
                  isActive ? 'text-primary' : 'text-gray-400'
                )}
              />
              <span
                className={cn(
                  'text-xs font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-gray-500'
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
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
