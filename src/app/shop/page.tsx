'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import ShopSidebar from '@/components/ShopSidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getProducts } from '@/lib/products-api';

export default function ShopPage() {
  const [isGridView, setIsGridView] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filters, setFilters] = useState<{
    search?: string;
    priceMin?: number | null;
    priceMax?: number | null;
    categorySlug?: string | null;
    minRating?: number | null;
    tags?: string[];
    sort?: 'all' | 'price-asc' | 'price-desc' | 'date-desc' | 'alphabetical';
  }>({ sort: 'all', tags: [] });

  // Load product count for display
  useEffect(() => {
    const loadProductCount = async () => {
      try {
        const response = await getProducts({ limit: 1 });
        if (response.success) {
          // For now, just show what we have. In a real app, you'd get total count from API
          setTotalProducts(response.data.length);
        }
      } catch (error) {
        console.error('Error loading product count:', error);
      }
    };

    loadProductCount();
  }, []);

  const displayCount = Math.min(totalProducts, 20); // Show up to 20 for now

  return (
    <div className="flex min-h-screen flex-col bg-[#fdf8e8]">
      <Header />
      <main className="flex-grow">
        {/* Page Header */}
        <div className="relative h-64 w-full">
          <Image
            src="https://t4.ftcdn.net/jpg/08/15/42/15/360_F_815421533_7wb1K0sqW5dG8yQVtd9T9tYDLP4qLzwj.jpg"
            alt="Fresh ingredients for smoothies"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <h1 className="text-5xl font-headline font-black">
              Shop
            </h1>
            <div className="mt-2 flex items-center text-sm font-medium">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <ChevronRight className="mx-1 h-4 w-4" />
              <span>Shop</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
              <ShopSidebar value={filters} onChange={setFilters} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Toolbar */}
              <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-lg border bg-white/60 p-4 sm:flex-row">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isGridView ? 'secondary' : 'ghost'}
                      size="icon"
                      onClick={() => setIsGridView(true)}
                    >
                      <LayoutGrid className="h-5 w-5" />
                    </Button>
                    <Button
                      variant={!isGridView ? 'secondary' : 'ghost'}
                      size="icon"
                      onClick={() => setIsGridView(false)}
                    >
                      <List className="h-5 w-5" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Showing 1-{displayCount} of {totalProducts} results
                  </p>
                </div>

                <div className="flex w-full items-center gap-4 sm:w-auto">
                  <Select value={filters.sort || 'all'} onValueChange={(v) => setFilters((f) => ({ ...f, sort: v as any }))}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alphabetical">Alphabetical, A-Z</SelectItem>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="price-asc">Price, low to high</SelectItem>
                      <SelectItem value="price-desc">Price, high to low</SelectItem>
                      <SelectItem value="date-desc">Date, new to old</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Mobile Filter Button */}
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        Filter
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="h-[85vh] bg-[#fdf8e8]">
                        <div className="overflow-auto p-4">
                            <ShopSidebar value={filters} onChange={setFilters} />
                        </div>
                    </DrawerContent>
                  </Drawer>
                </div>
              </div>

              {/* Product Grid */}
              <ProductGrid isGridView={isGridView} filters={filters} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
