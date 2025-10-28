'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import type { Smoothie } from '@/lib/types';
import { useState } from 'react';

interface ProductCardProps {
  product: Smoothie;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      className="relative group bg-white/90 rounded-3xl p-4 overflow-hidden shadow-lg border border-transparent hover:border-primary/50 transition-colors"
      whileHover={{ y: -5 }}
      data-smooth-cursor-hover
    >
      <div className="relative w-full aspect-[3/4] mb-4">
        <Image
          src={product.image.imageUrl}
          alt={product.name}
          fill
          className="object-contain"
        />
      </div>

      <h3 className="font-bold text-lg text-[#2d2b28] truncate">{product.name}</h3>
      <p className="text-xl font-black text-[#1a1815] mt-1">${product.price.toFixed(2)}</p>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-100/50 rounded-full"
        onClick={() => setIsLiked(!isLiked)}
      >
        <Heart className={cn('h-5 w-5', isLiked && 'fill-red-500 text-red-500')} />
      </Button>

      <motion.div
        className="absolute bottom-4 right-4"
        initial={{ opacity: 0, x: 10 }}
        whileHover={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button size="icon" className="rounded-full bg-primary hover:bg-primary/90">
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
