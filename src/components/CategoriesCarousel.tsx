'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getCategories } from '@/lib/categories-api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CARD_WIDTH = 300;
const CARD_GAP = 32;
const SCROLL_STEP = CARD_WIDTH + CARD_GAP;

const CategoriesCarousel = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const recalculateBounds = useCallback(() => {
    if (!isDesktop) {
      setOffset(0);
      setMaxOffset(0);
      return;
    }

    if (!carouselRef.current) return;

    const containerWidth = carouselRef.current.offsetWidth;
    const totalWidth = categories.length * CARD_WIDTH + Math.max(0, categories.length - 1) * CARD_GAP;
    const max = Math.min(0, containerWidth - totalWidth);

    setMaxOffset(max);
    setOffset((prev) => {
      if (prev < max) return max;
      if (prev > 0) return 0;
      return prev;
    });
  }, [categories, isDesktop]);

  useEffect(() => {
    if (categories.length === 0) return;
    recalculateBounds();
  }, [categories, recalculateBounds]);

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

  return (
    <section className="py-24 px-4 bg-[#fdf8e8] overflow-hidden relative z-30">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-headline font-black text-[#2d2b28]">Explore Our Categories</h2>
        <p className="max-w-2xl mx-auto mt-4 text-[#5a5854]">
          Find the perfect blend to match your mood and health goals.
        </p>
      </div>
      <div className="relative">
        <div
          ref={carouselRef}
          className="w-full overflow-x-auto lg:overflow-hidden touch-pan-x"
        >
          <motion.div
            className="flex gap-8"
            animate={isDesktop ? { x: offset } : { x: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          >
            {categories.map((category) => (
              <Link href={`/category/${category.slug}`} key={category._id} passHref>
                <div
                className="relative flex-shrink-0 w-[300px] h-[400px] rounded-3xl overflow-hidden group"
                data-smooth-cursor-hover
                >
                <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    data-ai-hint={category.hint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-2xl font-bold text-white tracking-wide">
                    {category.name}
                    </h3>
                </div>
                </div>
            </Link>
            ))}
          </motion.div>
        </div>

        {isDesktop && categories.length * CARD_WIDTH > (carouselRef.current?.offsetWidth ?? 0) && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              disabled={isPrevDisabled}
              className={`hidden lg:flex items-center justify-center absolute left-8 top-1/2 -translate-y-1/2 -translate-x-6 h-12 w-12 rounded-full shadow-lg border bg-white transition-all ${isPrevDisabled ? 'opacity-40 cursor-default' : 'hover:bg-green-600 hover:text-white'}`}
              aria-label="Scroll categories backward"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={isNextDisabled}
              className={`hidden lg:flex items-center justify-center absolute right-8 top-1/2 -translate-y-1/2 translate-x-6 h-12 w-12 rounded-full shadow-lg border bg-white transition-all ${isNextDisabled ? 'opacity-40 cursor-default' : 'hover:bg-green-600 hover:text-white'}`}
              aria-label="Scroll categories forward"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default CategoriesCarousel;
