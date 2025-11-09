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
                    <p className="text-xl font-black text-[#1a1815] mt-2">₹{product.price.toFixed(2)}</p>
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
        className="relative group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
        whileHover={{ y: -8 }}
        data-smooth-cursor-hover
      >
        {/* Image Container */}
        <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <Image
            src={product.image.imageUrl}
            alt={product.name}
            fill
            className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Floating Add to Cart Button */}
          <motion.div
            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
          >
            <Button size="icon" className="rounded-full bg-green-600 hover:bg-green-700 shadow-lg">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-base text-gray-900 line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-green-600">
              ₹{product.price.toFixed(2)}
            </p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
