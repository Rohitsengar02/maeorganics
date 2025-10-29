'use client';

import { useParams, notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { smoothieCategories, allProducts } from '@/lib/data';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const category = smoothieCategories.find((c) => c.slug === slug);
  const products = allProducts.slice(0, 8); // Mocking products for the category

  if (!category) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fdf8e8]">
      <Header />
      <main className="flex-grow">
        <div className="relative h-64 w-full">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <h1 className="text-5xl font-headline font-black">{category.name}</h1>
            <div className="mt-2 flex items-center text-sm font-medium">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <ChevronRight className="mx-1 h-4 w-4" />
              <Link href="/shop" className="hover:text-primary">
                Shop
              </Link>
              <ChevronRight className="mx-1 h-4 w-4" />
              <span>{category.name}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-12">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Showing {products.length} results</p>
            <Button variant="outline">Sort By</Button>
          </div>
          <ProductGrid />
        </div>
      </main>
      <Footer />
    </div>
  );
}
