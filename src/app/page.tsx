'use client';
import { useState, useEffect } from 'react';
import FeaturedProducts from '@/components/FeaturedProducts';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import WhyChooseUs from '@/components/WhyChooseUs';
import { BackgroundImage } from '@/components/BackgroundImage';
import { Preloader } from '@/components/Preloader';
import { AnimatePresence } from 'framer-motion';
import CategoriesCarousel from '@/components/CategoriesCarousel';
import ShopFeatures from '@/components/ShopFeatures';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.cursor = 'auto';
      window.scrollTo(0, 0);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#fdf8e8] overflow-hidden">
      <AnimatePresence mode="wait">
        {isLoading && <Preloader />}
      </AnimatePresence>

      {!isLoading && (
        <main className="relative">
          <Hero />
          <Marquee />
          <BackgroundImage />
          <FeaturedProducts />
          <WhyChooseUs />
          <CategoriesCarousel />
          <ShopFeatures />
        </main>
      )}
    </div>
  );
}
