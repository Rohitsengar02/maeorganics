'use client';
import FeaturedProducts from '@/components/FeaturedProducts';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fdf8e8]">
      <main>
        <Hero />
        <Marquee />
        <FeaturedProducts />
      </main>
    </div>
  );
}
