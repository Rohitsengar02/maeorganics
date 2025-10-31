
'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useTransform, useScroll, useAnimate } from 'framer-motion';
import { Star } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { getHomePageSettings } from '@/lib/homepage-settings-api';

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
      className="relative flex-shrink-0 w-[300px] h-[320px] rounded-3xl bg-white/90 p-6 shadow-lg backdrop-blur-lg"
      data-smooth-cursor-hover
    >
      <div style={{ transform: 'translateZ(75px)' }} className={cn("absolute inset-4 flex flex-col items-center text-center transition-colors duration-300", isHovered && "text-primary-foreground")}>
        <motion.div
            whileHover={{ rotate: 0, scale: 1.1 }}
            style={{ transform: 'translateZ(100px)', rotate: '30deg' }}
            className="absolute -top-16 w-48 h-64 drop-shadow-2xl transition-transform duration-300"
        >
          <Image
            src={smoothie.images[0]}
            alt={smoothie.name}
            fill
            className="object-contain"
          />
        </motion.div>
        
        <h3 className={cn("text-2xl font-bold mt-48 text-[#2d2b28] transition-colors duration-300", isHovered && "text-primary-foreground")} style={{ transform: 'translateZ(60px)' }}>{smoothie.name}</h3>
        
       

      
      </div>
    </motion.div>
  );
};

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

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

  if (loading) {
    return (
      <section className="relative py-24 z-30">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-headline font-black text-[#2d2b28]">Featured Smoothies</h2>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-[300px] h-[420px] rounded-3xl bg-gray-200 animate-pulse" />
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
    <section ref={targetRef} className="relative py-0 z-30" style={{ height: sectionHeight }} id="featured-products">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4 absolute top-24 left-1/2 -translate-x-1/2 z-10">
           <h2 className="text-4xl font-headline font-black text-[#2d2b28]">Featured Products</h2>
        </div>
        <motion.div 
            style={{ x }} 
            className="flex gap-8 pl-[20%] mt-36 cursor-grab"
            drag="x"
            dragConstraints={{
                left: -(300 * featuredProducts.length + (featuredProducts.length * 32)),
                right: 0
            }}
        >
            {featuredProducts.map((smoothie) => (
              <Link href={`/shop/${smoothie._id}`} key={smoothie._id}>
                <SmoothieCard smoothie={smoothie} />
              </Link>
            ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
