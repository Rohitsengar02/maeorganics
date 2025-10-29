'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import type { Smoothie } from '@/lib/types';
import { useState } from 'react';

interface ProductCardProps {
  product: Smoothie;
  isGridView?: boolean;
}

const ProductCard = ({ product, isGridView = true }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  if (!isGridView) {
    return (
        <Link href={`/shop/${product.id}`} className="block">
            <motion.div
                className="relative group bg-white/90 rounded-3xl p-4 overflow-hidden shadow-lg border border-transparent hover:border-primary/50 transition-colors flex gap-6"
                whileHover={{ y: -5 }}
                data-smooth-cursor-hover
            >
                <div className="relative w-40 h-40 flex-shrink-0">
                    <Image
                    src={product.image.imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain rounded-2xl"
                    />
                </div>
                <div className="flex flex-col justify-center">
                    <h3 className="font-bold text-xl text-[#2d2b28]">{product.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} fill={i < product.rating ? 'currentColor' : 'none'} strokeWidth={1} className="w-5 h-5 text-yellow-400"/>
                        ))}
                    </div>
                    <p className="text-xl font-black text-[#1a1815] mt-2">${product.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{product.description}</p>
                    <Button className="mt-4 w-fit">
                        <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-100/50 rounded-full"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsLiked(!isLiked); }}
                >
                    <Heart className={cn('h-5 w-5', isLiked && 'fill-red-500 text-red-500')} />
                </Button>
            </motion.div>
        </Link>
    )
  }

  return (
    <Link href={`/shop/${product.id}`} className="block">
      <motion.div
        className="relative group bg-white/90 rounded-3xl p-4 overflow-hidden shadow-lg border border-transparent hover:border-primary/50 transition-colors"
        whileHover={{ y: -5 }}
        data-smooth-cursor-hover
      >
        <div className="relative w-full h-[250px] md:h-auto md:aspect-[4/3] mb-4 bg-gray-100/50 rounded-2xl">
          <Image
            src={product.image.imageUrl}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform"
          />
        </div>

        <h3 className="font-bold text-lg text-[#2d2b28] truncate">{product.name}</h3>
        <div className="flex items-center gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
              <Star key={i} fill={i < product.rating ? 'currentColor' : 'none'} strokeWidth={1} className="w-4 h-4 text-yellow-400"/>
          ))}
          </div>
        <p className="text-xl font-black text-[#1a1815] mt-1">${product.price.toFixed(2)}</p>

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-100/50 rounded-full"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsLiked(!isLiked); }}
        >
          <Heart className={cn('h-5 w-5', isLiked && 'fill-red-500 text-red-500')} />
        </Button>

        <motion.div
          className="absolute bottom-4 right-4"
          initial={{ opacity: 0, x: 10 }}
          whileHover={{ opacity: 1, x: 0 }}
          animate={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.3 }}
        >
          <Button size="icon" className="rounded-full bg-primary hover:bg-primary/90">
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </motion.div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
