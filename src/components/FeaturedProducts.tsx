'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useTransform, useScroll } from 'framer-motion';
import { featuredSmoothies } from '@/lib/data';
import { Star } from 'lucide-react';

const SmoothieCard = ({ smoothie }: { smoothie: any }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-210, 210], [10, -10]);
  const rotateY = useTransform(mouseX, [-150, 150], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }}
      className="relative flex-shrink-0 w-[300px] h-[420px] rounded-3xl bg-white/90 p-6 shadow-lg backdrop-blur-lg"
    >
      <div style={{ transform: 'translateZ(75px)' }} className="absolute inset-4 flex flex-col items-center text-center">
        <motion.div
            whileHover={{ rotate: 0, scale: 1.1 }}
            style={{ transform: 'translateZ(80px)', rotate: '30deg' }}
            className="relative w-36 h-52 drop-shadow-2xl transition-transform duration-300"
        >
          <Image
            src={smoothie.image.imageUrl}
            alt={smoothie.name}
            fill
            className="object-contain"
          />
        </motion.div>
        
        <h3 className="text-2xl font-bold mt-4 text-[#2d2b28]" style={{ transform: 'translateZ(60px)' }}>{smoothie.name}</h3>
        
        <div className="flex items-center gap-2 mt-2" style={{ transform: 'translateZ(50px)' }}>
            <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} fill={i < smoothie.rating ? 'currentColor' : 'none'} strokeWidth={1} className="w-5 h-5"/>
                ))}
            </div>
            <span className="text-sm text-foreground/70 font-medium">{smoothie.ratingCount.toFixed(1)}</span>
        </div>

        <p className="text-3xl font-black text-[#1a1815] mt-4" style={{ transform: 'translateZ(40px)' }}>
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

  const x = useTransform(scrollYProgress, [0.1, 0.8], ['5%', '-30%']);

  return (
    <section ref={targetRef} className="relative h-[150vh] py-0" id="featured-products">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4 absolute top-24 left-1/2 -translate-x-1/2 z-10">
           <h2 className="text-4xl font-headline font-black text-[#2d2b28]">Featured Smoothies</h2>
        </div>
        <motion.div style={{ x }} className="flex gap-8 pl-[20%] mt-36">
            {featuredSmoothies.map((smoothie) => (
              <SmoothieCard key={smoothie.id} smoothie={smoothie} />
            ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
