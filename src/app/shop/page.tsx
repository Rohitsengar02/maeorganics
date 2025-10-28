'use client';

import { useState } from 'react';
import { ChevronRight, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
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

export default function ShopPage() {
  const [isGridView, setIsGridView] = useState(true);

  return (
    <div className="flex min-h-screen flex-col bg-[#fdf8e8]">
      <Header />
      <main className="flex-grow">
        {/* Page Header */}
        <div className="bg-white/50 py-8">
          <div className="container mx-auto max-w-7xl px-4 text-center">
            <h1 className="text-4xl font-headline font-black text-[#2d2b28]">
              Shop
            </h1>
            <div className="mt-2 flex items-center justify-center text-sm font-medium text-[#5a5854]">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <ChevronRight className="mx-1 h-4 w-4" />
              <span>Shop</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
              <ShopSidebar />
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
                    Showing 1-12 of 16 results
                  </p>
                </div>

                <div className="flex w-full items-center gap-4 sm:w-auto">
                  <Select defaultValue="alphabetical">
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alphabetical">Alphabetical, A-Z</SelectItem>
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
                            <ShopSidebar />
                        </div>
                    </DrawerContent>
                  </Drawer>
                </div>
              </div>

              {/* Product Grid */}
              <ProductGrid isGridView={isGridView} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
