'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { featuredSmoothies } from '@/lib/data';

const SmoothieCard = ({ smoothie }: { smoothie: any }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={cardRef}
      className="relative flex-shrink-0 w-[300px] h-[420px] rounded-3xl bg-gradient-to-br from-white/20 to-white/10 p-6 shadow-lg backdrop-blur-lg"
    >
      <div style={{ transform: 'translateZ(75px)', transformStyle: 'preserve-3d' }} className="absolute inset-4 flex flex-col items-center text-center">
        <motion.div
            style={{ transform: 'translateZ(50px)' }}
            className="relative w-40 h-52 drop-shadow-2xl"
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
      </div>
    </motion.div>
  );
};

const FeaturedProducts = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['5%', '-95%']);

  return (
    <section ref={targetRef} className="relative h-[150vh] py-24" id="featured-products">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4 mb-12">
           <h2 className="text-4xl font-headline font-black text-[#2d2b28]">Featured Smoothies</h2>
        </div>
        <motion.div style={{ x }} className="flex gap-8">
            {featuredSmoothies.map((smoothie) => (
              <SmoothieCard key={smoothie.id} smoothie={smoothie} />
            ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
