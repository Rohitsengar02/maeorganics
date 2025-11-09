'use client';
import { useState, useEffect, useRef } from 'react';
import FeaturedProducts from '@/components/FeaturedProducts';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import WhyChooseUs from '@/components/WhyChooseUs';
import { Preloader } from '@/components/Preloader';
import { AnimatePresence } from 'framer-motion';
import CategoriesCarousel from '@/components/CategoriesCarousel';
import ShopFeatures from '@/components/ShopFeatures';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';
import { BackgroundImage } from '@/components/BackgroundImage';
import CombosCarousel from '@/components/CombosCarousel';
import PromoBanner from '@/components/PromoBanner';
import { BackgroundImage2 } from '@/components/BackgroundImage2';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const productGridRef = useRef<HTMLDivElement>(null);
  const promoBannerRef = useRef<HTMLDivElement>(null);

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
          <BackgroundImage />
          <BackgroundImage2 startRef={productGridRef} endRef={promoBannerRef} />
          <Marquee />
          <FeaturedProducts />
          <WhyChooseUs />
          <CategoriesCarousel />
          <CombosCarousel />
          <section className="py-24 bg-[#fdf8e8] relative ">
            <div className="container mx-auto max-w-7xl px-4 ">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-headline font-black text-[#2d2b28]">
                  Our Collection
                </h2>
                <p className="max-w-2xl mx-auto mt-4 text-[#5a5854]">
                  Discover our full range of delicious and healthy smoothies, crafted with the finest ingredients.
                </p>
              </div>
              <ProductGrid ref={productGridRef} />
            </div>
          </section>
          
          <PromoBanner ref={promoBannerRef} />
          <Footer />
        </main>
      )}
    </div>
  );
}
