'use client';
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { getCategories } from '@/lib/categories-api';


const carouselVariants = {
  animate: {
    x: ['0%', '-100%'],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: 'loop',
        duration: 20,
        ease: 'linear',
      },
    },
  },
};

const CategoriesCarousel = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const controls = useAnimation();
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

  useEffect(() => {
    if (categories.length > 0) {
      controls.start('animate');
    }
  }, [categories, controls]);

  const handleHoverStart = () => {
    controls.stop();
  };

  const handleHoverEnd = () => {
    controls.start('animate');
  };

  return (
    <section className="py-24 bg-[#fdf8e8] overflow-hidden relative z-30">
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
            left: -(300 * categories.length + (categories.length - 1) * 32),
            right: 0,
          }}
        >
          {[...categories, ...categories].map((category, index) => (
            <Link href={`/category/${category.slug}`} key={`${category._id}-${index}`} passHref>
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
    </section>
  );
};

export default CategoriesCarousel;
