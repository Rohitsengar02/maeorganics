'use client';
import FeaturedProducts from '@/components/FeaturedProducts';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import WhyChooseUs from '@/components/WhyChooseUs';
import { BackgroundImage } from '@/components/BackgroundImage';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fdf8e8]">
      <main className="relative">
        <Hero />
        <Marquee />
        <div className="relative z-0">
          <BackgroundImage />
          <FeaturedProducts />
        </div>
        <WhyChooseUs />
      </main>
    </div>
  );
}
