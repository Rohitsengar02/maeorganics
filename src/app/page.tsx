'use client';
import FeaturedProducts from '@/components/FeaturedProducts';
import Hero from '@/components/Hero';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fdf8e8]">
      <main>
        <Hero />
        <FeaturedProducts />
      </main>
    </div>
  );
}
