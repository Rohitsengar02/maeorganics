'use client';

import { Search, Star } from 'lucide-react';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { featuredSmoothies, smoothieCategories } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';

const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
const tags = [
  'Black', 'Blue', 'Fiber', 'Gold', 'Grass', 'Green',
  'L', 'Leather', 'M', 'Magenta', 'Maroon', 'Metal',
  'S', 'Silver', 'White', 'XL', 'XXL'
];
const colors = [
  '#000000', '#FF0000', '#0000FF', '#FFFF00',
  '#FFC0CB', '#008000', '#800080', '#FFA500',
  '#FFFFFF', '#808080', '#A52A2A', '#800000'
];


const ShopSidebar = () => {
  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg">Search</h3>
        <div className="relative">
          <Input placeholder="Search our store" className="pr-10" />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <Separator />

      {/* Top Rated */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg">Top Rated Products</h3>
        <div className="space-y-4">
          {featuredSmoothies.slice(0, 3).map((product) => (
            <div key={product.id} className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-md bg-gray-100/50 flex-shrink-0">
                <Image src={product.image.imageUrl} alt={product.name} fill className="object-contain p-2" />
              </div>
              <div>
                <p className="font-semibold text-sm">{product.name}</p>
                <div className="flex items-center gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} fill={i < product.rating ? 'currentColor' : 'none'} strokeWidth={1.5} className="w-3.5 h-3.5 text-yellow-400"/>
                    ))}
                </div>
                <p className="font-bold text-base mt-1">${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Categories */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg">Categories</h3>
        <ul className="space-y-2 text-sm">
          {smoothieCategories.map((cat) => (
            <li key={cat.id} className="flex justify-between items-center">
              <Link href={`/category/${cat.slug}`} className="hover:text-primary transition-colors">{cat.name}</Link>
              <span className="text-gray-400">({Math.floor(Math.random() * 10)})</span>
            </li>
          ))}
        </ul>
      </div>

      <Separator />

      {/* Size Filter */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg">Size</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <Button key={size} variant="outline" size="sm" className="w-12">
              {size}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Tags Filter */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Button key={tag} variant="outline" size="sm" className="rounded-full">
              {tag}
            </Button>
          ))}
        </div>
      </div>
      
      <Separator />

      {/* Color Filter */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg">Color</h3>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color}
              className="h-8 w-8 rounded-full border-2 border-transparent focus:border-primary transition-all"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default ShopSidebar;
