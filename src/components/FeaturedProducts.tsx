'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { featuredSmoothies } from '@/lib/data';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

const SmoothieCard = ({ smoothie, index }: { smoothie: any; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(0, { stiffness: 300, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXVal = e.clientX - rect.left;
    const mouseYVal = e.clientY - rect.top;
    const xPct = mouseXVal / width - 0.5;
    const yPct = mouseYVal / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const rotateX = useTransform(y, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(x, [-0.5, 0.5], ['-10deg', '10deg']);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="relative flex-shrink-0 w-[300px] h-[420px] rounded-3xl bg-gradient-to-br from-white/20 to-white/10 p-6 shadow-lg backdrop-blur-lg"
    >
      <div style={{ transform: 'translateZ(75px)', transformStyle: 'preserve-3d' }} className="absolute inset-4 flex flex-col items-center text-center">
        <motion.div
            style={{ transform: 'translateZ(50px)' }}
            className="relative w-40 h-52 drop-shadow-2xl"
            id={index === 0 ? 'featured-product-image-0' : ''}
        >
          <Image
            src={smoothie.image.imageUrl}
            alt={smoothie.name}
            fill
            className="object-contain"
          />
        </motion.div>
        
        <h3 className="text-2xl font-bold mt-4 text-[#2d2b28]" style={{ transform: 'translateZ(50px)' }}>{smoothie.name}</h3>
        <p className="text-sm text-[#5a5854] mt-2" style={{ transform: 'translateZ(40px)' }}>{smoothie.description}</p>
        <p className="text-3xl font-black text-[#1a1815] mt-4" style={{ transform: 'translateZ(30px)' }}>
            ${smoothie.price.toFixed(2)}
        </p>
        <Button className="mt-4 rounded-full bg-[#f3b315] hover:bg-[#e0a30b] text-primary-foreground font-bold" style={{ transform: 'translateZ(20px)' }}>
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
};

const FeaturedProducts = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const currentCarouselRef = carouselRef.current;
    if (currentCarouselRef) {
        currentCarouselRef.addEventListener('scroll', handleScroll);
        handleScroll();
    }
    return () => {
        if (currentCarouselRef) {
            currentCarouselRef.removeEventListener('scroll', handleScroll);
        }
    };
  }, []);

  return (
    <section className="py-24" id="featured-products">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-headline font-black text-[#2d2b28]">Featured Smoothies</h2>
            <div className="flex items-center gap-2">
                <Button onClick={() => scroll('left')} variant="outline" size="icon" className="rounded-full" disabled={!canScrollLeft}>
                    <ArrowLeft />
                </Button>
                <Button onClick={() => scroll('right')} variant="outline" size="icon" className="rounded-full" disabled={!canScrollRight}>
                    <ArrowRight />
                </Button>
            </div>
        </div>

        <div className="relative">
          <div ref={carouselRef} className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide" style={{ perspective: '1000px' }}>
            {featuredSmoothies.map((smoothie, index) => (
              <SmoothieCard key={smoothie.id} smoothie={smoothie} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
