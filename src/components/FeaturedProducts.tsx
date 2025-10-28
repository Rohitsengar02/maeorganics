'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useTransform, useScroll, useAnimate } from 'framer-motion';
import { featuredSmoothies } from '@/lib/data';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const SmoothieCard = ({ smoothie }: { smoothie: any }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [scope, animate] = useAnimate();
  
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

  const handleMouseEnter = () => {
    setIsHovered(true);
    animate(scope.current, { backgroundColor: 'hsl(var(--primary))' }, { duration: 0.3 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    animate(scope.current, { backgroundColor: 'rgb(255 255 255 / 0.9)' }, { duration: 0.3 });
  };

  return (
    <motion.div
      ref={scope}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
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
      data-smooth-cursor-hover
    >
      <div style={{ transform: 'translateZ(75px)' }} className={cn("absolute inset-4 flex flex-col items-center text-center transition-colors duration-300", isHovered && "text-primary-foreground")}>
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
        
        <h3 className={cn("text-2xl font-bold mt-4 text-[#2d2b28] transition-colors duration-300", isHovered && "text-primary-foreground")} style={{ transform: 'translateZ(60px)' }}>{smoothie.name}</h3>
        
        <div className="flex items-center gap-2 mt-2" style={{ transform: 'translateZ(50px)' }}>
            <div className={cn("flex text-yellow-400 transition-colors duration-300", isHovered && "text-white/80")}>
                {[...Array(5)].map((_, i) => (
                    <Star key={i} fill={i < smoothie.rating ? 'currentColor' : 'none'} strokeWidth={1} className="w-5 h-5"/>
                ))}
            </div>
            <span className={cn("text-sm text-foreground/70 font-medium transition-colors duration-300", isHovered && "text-primary-foreground/70")}>{smoothie.ratingCount.toFixed(1)}</span>
        </div>

        <p className={cn("text-3xl font-black text-[#1a1815] mt-4 transition-colors duration-300", isHovered && "text-white")} style={{ transform: 'translateZ(40px)' }}>
            ${smoothie.price.toFixed(2)}
        </p>
      </div>
    </motion.div>
  );
};

const FeaturedProducts = () => {
  const isMobile = useIsMobile();
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(
    scrollYProgress, 
    isMobile ? [0.2, 0.9] : [0.1, 0.8], 
    isMobile ? ['15%', '-105%'] : ['5%', '-30%']
  );
  
  const sectionHeight = isMobile ? '130vh' : '150vh';

  return (
    <section ref={targetRef} className="relative py-0" style={{ height: sectionHeight }} id="featured-products">
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
