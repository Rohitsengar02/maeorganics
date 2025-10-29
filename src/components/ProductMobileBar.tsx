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
        "sm:hidden fixed bottom-20 left-0 right-0 h-20 bg-white/80 backdrop-blur-lg border-t border-gray-200/80 flex items-center justify-between px-4 gap-4 z-40",
        "transition-transform duration-300",
        isProductPage ? "translate-y-0" : "translate-y-full"
    )}>
      <div className="flex flex-col items-start">
        <p className="text-sm text-gray-500">Price</p>
        <p className="text-xl font-bold text-gray-800">${product.price.toFixed(2)}</p>
      </div>
      <div className='flex-grow'>
        <Button size="lg" className="w-full h-12 rounded-full">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
        </Button>
      </div>
    </div>
  );
}
