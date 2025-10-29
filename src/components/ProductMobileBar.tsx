'use client';

import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Smoothie } from '@/lib/types';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function ProductMobileBar({ product }: { product: Smoothie }) {
  const pathname = usePathname();
  const isProductPage = pathname.startsWith('/shop/');

  if (!isProductPage) {
    return null;
  }

  return (
    <div className={cn(
        "sm:hidden fixed bottom-20 left-0 right-0 h-20 bg-white/80 backdrop-blur-lg border-t border-gray-200/80 flex items-center justify-between px-4 gap-3 z-40",
        "transition-transform duration-300",
        isProductPage ? "translate-y-0" : "translate-y-full"
    )}>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-12 w-12 text-gray-500 hover:text-red-500">
            <Heart className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="h-12 w-12 text-gray-500">
            <ShoppingCart className="h-6 w-6" />
        </Button>
      </div>
      <div className='flex-grow'>
        <Button size="lg" className="w-full h-12 rounded-full">
            Buy Now
        </Button>
      </div>
    </div>
  );
}
