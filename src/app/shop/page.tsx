import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import { Header } from '@/components/header';

export default function ShopPage() {
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

        {/* Product Grid */}
        <div className="py-4">
          <ProductGrid />
        </div>
      </main>
      <Footer />
    </div>
  );
}
