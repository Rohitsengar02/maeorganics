'use client';

import { useState } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  ChevronRight,
  Minus,
  Plus,
  Star,
  Heart,
  ShoppingCart,
  Info,
  Truck,
  MessageSquare,
  Facebook,
  Twitter,
  Instagram,
} from 'lucide-react';
import Link from 'next/link';

import { allProducts, featuredSmoothies } from '@/lib/data';
import { Header } from '@/components/header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/ProductCard';
import { cn } from '@/lib/utils';
import ProductMobileBar from '@/components/ProductMobileBar';
import { useCart } from '@/hooks/use-cart';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = allProducts.find((p) => p.id === params.id);
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('Orange');

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const galleryImages = [
    product.image,
    ...featuredSmoothies.slice(1, 4).map(s => s.image)
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#fdf8e8]">
      <Header />
      <main className="flex-grow pb-24 sm:pb-0">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          {/* Breadcrumbs */}
          <div className="mb-6 flex items-center text-sm font-medium text-gray-500">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="mx-2 h-4 w-4" />
            <Link href="/shop" className="hover:text-primary">
              Shop
            </Link>
            <ChevronRight className="mx-2 h-4 w-4" />
            <span className="text-gray-800">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Image Gallery */}
            <div>
              <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl border bg-white/60">
                <Image
                  src={galleryImages[selectedImage].imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain p-8 transition-all duration-300"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {galleryImages.map((img, index) => (
                  <button
                    key={`${img.id}-${index}`}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'relative aspect-square w-full overflow-hidden rounded-lg border-2 transition-all',
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    )}
                  >
                    <Image
                      src={img.imageUrl}
                      alt={img.description}
                      fill
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <h1 className="font-headline text-4xl font-black text-[#2d2b28]">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      fill={i < product.rating ? 'currentColor' : 'none'}
                      strokeWidth={1.5}
                      className="h-5 w-5 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">({product.ratingCount.toFixed(1)} reviews)</span>
              </div>

              <p className="font-headline text-4xl font-black text-[#1a1815]">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-base text-gray-600">
                {product.description}
              </p>

              <Separator />

              {/* Color Options */}
              <div>
                <p className="mb-2 text-sm font-semibold">Color: <span className="font-normal text-gray-600">{selectedColor}</span></p>
                <div className="flex gap-2">
                    {['Orange', 'Green', 'Red'].map(color => (
                        <button key={color} onClick={() => setSelectedColor(color)} className={cn("h-8 w-8 rounded-full border-2 transition-all", selectedColor === color ? 'border-primary' : 'border-gray-300')} style={{backgroundColor: color.toLowerCase()}} />
                    ))}
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-12 items-center justify-between rounded-full border bg-white px-4">
                  <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-bold">{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button size="lg" className="h-12 flex-grow rounded-full" onClick={handleAddToCart}>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                </Button>
                 <Button variant="outline" size="lg" className="h-12 rounded-full">
                    <Heart className="mr-2 h-5 w-5" />
                    Add to Wishlist
                </Button>
              </div>

              <Separator />

              {/* Social Share */}
              <div className='flex items-center gap-4'>
                    <p className='text-sm font-semibold'>Share:</p>
                    <div className='flex gap-2'>
                        <Button variant="outline" size="icon" className='rounded-full'><Facebook className="h-4 w-4" /></Button>
                        <Button variant="outline" size="icon" className='rounded-full'><Twitter className="h-4 w-4" /></Button>
                        <Button variant="outline" size="icon" className='rounded-full'><Instagram className="h-4 w-4" /></Button>
                    </div>
              </div>

            </div>
          </div>

           {/* Details Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
                <TabsTrigger value="description"><Info className="mr-2 h-4 w-4"/>Description</TabsTrigger>
                <TabsTrigger value="delivery"><Truck className="mr-2 h-4 w-4"/>Delivery & Returns</TabsTrigger>
                <TabsTrigger value="reviews"><MessageSquare className="mr-2 h-4 w-4"/>Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-6 rounded-lg border bg-white/60 p-6 text-sm text-gray-600 leading-relaxed">
                Welcome a timeless design into your kitchen with the stove top whistling kettle from KitchenAid. The vibrantly coloured porcelain exterior is resistant to stains, chips and cracks, whilst the stainless steel handle and lid provide easy and safe handling. Simply remove the lid to fill, place on any hob including induction and, when boiled, a clear, audible whistle will sound. With a generous 1.9 litre capacity, use the thumb-press spout to a graceful contours and classic onyx black, almond cream and stainless steel, the graceful contours and classic appearance will make a welcome addition to any vintage or contemporary kitchen.
              </TabsContent>
              <TabsContent value="delivery" className="mt-6 rounded-lg border bg-white/60 p-6 text-sm text-gray-600 leading-relaxed">
                We offer free standard shipping on all orders over $50. Express shipping is available for an additional fee. Returns are accepted within 30 days of purchase, provided the item is in its original condition and packaging. Please visit our returns portal to initiate a return.
              </TabsContent>
              <TabsContent value="reviews" className="mt-6 rounded-lg border bg-white/60 p-6 text-sm text-gray-600 leading-relaxed">
                No reviews yet. Be the first to review {product.name}!
              </TabsContent>
            </Tabs>
          </div>

          {/* You Might Also Like */}
            <div className="mt-16">
                <h2 className="text-3xl font-headline font-black text-[#2d2b28] mb-8 text-center">You Might Also Like</h2>
                <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-4">
                {featuredSmoothies.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
                </div>
            </div>
        </div>
      </main>

      <ProductMobileBar product={product} />

      <Footer />
    </div>
  );
}
