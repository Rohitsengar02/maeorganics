'use client';

import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import type { Smoothie } from '@/lib/types';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';

export default function ProductMobileBar({ product }: { product: Smoothie }) {
  const pathname = usePathname();
  const { addToCart } = useCart();
  const isProductPage = pathname.startsWith('/shop/');

  if (!isProductPage) {
    return null;
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1);
    }
  };

  return (
    <div
      className={cn(
        'sm:hidden fixed bottom-16 left-0 right-0 h-20 bg-white/80 backdrop-blur-lg border-t border-gray-200/80 flex items-center justify-between p-4 gap-4 z-40',
        'transition-transform duration-300',
        isProductPage ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <div className="flex flex-col items-start">
        <p className="text-xs text-gray-500">Price</p>
        <p className="text-lg font-bold text-gray-800">
          ${product.price.toFixed(2)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="rounded-full h-12 w-12 flex-shrink-0">
          <Heart className="h-6 w-6" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full h-12 w-12 flex-shrink-0" onClick={handleAddToCart}>
          <ShoppingCart className="h-6 w-6" />
        </Button>
        <Button size="lg" className="h-12 rounded-full flex-grow whitespace-nowrap">
          Buy Now
        </Button>
      </div>
    </div>
  );
}
