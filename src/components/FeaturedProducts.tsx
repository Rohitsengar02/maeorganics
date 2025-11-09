
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getHomePageSettings } from '@/lib/homepage-settings-api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CARD_WIDTH = 300;
const CARD_GAP = 32;
const SCROLL_STEP = CARD_WIDTH + CARD_GAP;

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const [isTouching, setIsTouching] = useState(false);

  const recalculateBounds = useCallback(() => {
    if (!isDesktop) {
      setOffset(0);
      setMaxOffset(0);
      return;
    }

    if (!carouselRef.current) return;

    const containerWidth = carouselRef.current.offsetWidth;
    const totalWidth = featuredProducts.length * CARD_WIDTH + Math.max(0, featuredProducts.length - 1) * CARD_GAP;
    const max = Math.min(0, containerWidth - totalWidth);

    setMaxOffset(max);
    setOffset((prev) => {
      if (prev < max) return max;
      if (prev > 0) return 0;
      return prev;
    });
  }, [featuredProducts, isDesktop]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await getHomePageSettings();
        if (response.success && response.data) {
          setFeaturedProducts(response.data.featuredProducts || []);
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    if (featuredProducts.length === 0) return;
    recalculateBounds();
  }, [featuredProducts, recalculateBounds]);

  useEffect(() => {
    const updateBreakpoint = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  useEffect(() => {
    recalculateBounds();
  }, [isDesktop, recalculateBounds]);

  const handleNext = () => {
    setOffset((prev) => Math.max(prev - SCROLL_STEP, maxOffset));
  };

  const handlePrev = () => {
    setOffset((prev) => Math.min(prev + SCROLL_STEP, 0));
  };

  const isPrevDisabled = offset === 0;
  const isNextDisabled = offset === maxOffset;

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isDesktop) return;
    setIsTouching(true);
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDesktop || !isTouching) return;
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const deltaX = Math.abs(touchX - touchStartX.current);
    const deltaY = Math.abs(touchY - touchStartY.current);
    
    // If horizontal scroll is more pronounced than vertical, prevent page scroll
    if (deltaX > deltaY && deltaX > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    setIsTouching(false);
  };

  if (loading) {
    return (
      <section className="relative py-24 z-30">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-headline font-black text-[#2d2b28]">Featured Smoothies</h2>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-[300px] h-[400px] rounded-3xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return null; // Don't render section if there are no featured products
  }

  return (
    <>
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <section className="relative py-24 z-30 overflow-hidden" id="featured-products">
        <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-headline font-black text-[#2d2b28]">Featured Products</h2>
            <p className="text-[#5a5854] mt-2">Hand-picked bestsellers curated for you</p>
          </div>

          {isDesktop && featuredProducts.length > 3 && (
            <div className="hidden lg:flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrev}
                disabled={isPrevDisabled}
                className={`h-12 w-12 rounded-full border bg-white shadow-md flex items-center justify-center transition-colors ${isPrevDisabled ? 'opacity-40 cursor-default' : 'hover:bg-green-600 hover:text-white'}`}
                aria-label="Scroll featured backward"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={isNextDisabled}
                className={`h-12 w-12 rounded-full border bg-white shadow-md flex items-center justify-center transition-colors ${isNextDisabled ? 'opacity-40 cursor-default' : 'hover:bg-green-600 hover:text-white'}`}
                aria-label="Scroll featured forward"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <div
            ref={carouselRef}
            className="w-full overflow-x-auto lg:overflow-hidden scrollbar-hide"
            style={{ 
              touchAction: 'pan-x',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <motion.div
              className="flex gap-8"
              animate={isDesktop ? { x: offset } : { x: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            >
              {featuredProducts.map((product: any) => (
                <Link href={`/shop/${product._id}`} key={product._id}>
                  <div
                    className="relative flex-shrink-0 w-[300px] h-[400px] rounded-3xl overflow-hidden group"
                    data-smooth-cursor-hover
                  >
                    <div className="absolute inset-0 p-8">
                      <div className="relative h-full w-full rounded-3xl overflow-hidden">
                        <Image
                          src={product.images?.[0] || '/placeholder-product.png'}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                        />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-sm uppercase tracking-wide text-white/80">Signature Blend</p>
                      <h3 className="text-2xl font-bold text-white mt-2 line-clamp-2">
                        {product.name}
                      </h3>
                    
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>
          </div>

          {isDesktop && featuredProducts.length * CARD_WIDTH > (carouselRef.current?.offsetWidth ?? 0) && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                disabled={isPrevDisabled}
                className={`hidden lg:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 h-12 w-12 rounded-full shadow-lg border bg-white transition-all ${isPrevDisabled ? 'opacity-40 cursor-default' : 'hover:bg-green-600 hover:text-white'}`}
                aria-label="Scroll featured backward"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={isNextDisabled}
                className={`hidden lg:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 h-12 w-12 rounded-full shadow-lg border bg-white transition-all ${isNextDisabled ? 'opacity-40 cursor-default' : 'hover:bg-green-600 hover:text-white'}`}
                aria-label="Scroll featured forward"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
    </>
  );
};

export default FeaturedProducts;
