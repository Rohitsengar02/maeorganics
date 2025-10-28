'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { smoothieCategories } from '@/lib/data';

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
  return (
    <section className="py-24 bg-[#fdf8e8] overflow-hidden">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-headline font-black text-[#2d2b28]">Explore Our Categories</h2>
        <p className="max-w-2xl mx-auto mt-4 text-[#5a5854]">
          Find the perfect blend to match your mood and health goals.
        </p>
      </div>
      <div className="w-full overflow-hidden">
        <motion.div
          className="flex gap-8"
          variants={carouselVariants}
          animate="animate"
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
