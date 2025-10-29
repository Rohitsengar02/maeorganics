'use client';
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';
import { smoothieCategories } from '@/lib/data';
import { useEffect, useRef } from 'react';

const duplicatedCategories = [...smoothieCategories, ...smoothieCategories];

const carouselVariants = {
  animate: {
    x: ['0%', '-100%'],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: 'loop',
        duration: 30,
        ease: 'linear',
      },
    },
  },
};

const CategoriesCarousel = () => {
  const controls = useAnimation();
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    controls.start('animate');
  }, [controls]);

  const handleHoverStart = () => {
    controls.stop();
  };

  const handleHoverEnd = () => {
    controls.start('animate');
  };

  return (
    <section className="py-24 bg-[#fdf8e8] overflow-hidden relative z-10">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-headline font-black text-[#2d2b28]">Explore Our Categories</h2>
        <p className="max-w-2xl mx-auto mt-4 text-[#5a5854]">
          Find the perfect blend to match your mood and health goals.
        </p>
      </div>
      <div 
        ref={carouselRef}
        className="w-full overflow-hidden cursor-grab" 
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
      >
        <motion.div
          className="flex gap-8"
          variants={carouselVariants}
          animate={controls}
          drag="x"
          dragConstraints={{
            left: -(2 * 300 * smoothieCategories.length + (smoothieCategories.length * 2 * 32) - (carouselRef.current?.clientWidth || 0)),
            right: 0
          }}
        >
          {duplicatedCategories.map((category, index) => (
            <div
              key={index}
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
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesCarousel;
