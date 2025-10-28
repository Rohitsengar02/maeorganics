'use client';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

export function BackgroundImage() {
  const { scrollYProgress } = useScroll();
  const isMobile = useIsMobile();

  const y = useTransform(scrollYProgress, [0.1, 0.7], ['-150vh', '150vh']);
  const x = useTransform(
    scrollYProgress, 
    [0.1, 0.7], 
    isMobile ? ['10%', '-100%'] : ['-10%', '-200%']
  );
  const rotate = useTransform(scrollYProgress, [0.1, 0.7], [-5, 5]);
  const scale = useTransform(scrollYProgress, [0.1, 0.7], [1.2, 0.8]);
  const opacity = useTransform(scrollYProgress, [0.05, 0.15], [0, 1]);
  
  const mobileMarginTop = '180vh';
  const desktopMarginTop = '230vh';

  return (
    <motion.div 
        className="absolute right-[-10%] top-0 w-[300px] h-[500px] md:w-[400px] md:h-[700px] z-0"
        style={{ 
          y, 
          x, 
          rotate, 
          scale, 
          opacity,
          marginTop: isMobile ? mobileMarginTop : desktopMarginTop
        }}
    >
    <Image
        src="https://res.cloudinary.com/ds1wiqrdb/image/upload/v1761643874/ChatGPT_Image_Oct_28_2025_02_57_54_PM_1_tys6ek.png"
        alt="Smoothie Bottle"
        fill
        className="object-contain drop-shadow-5xl"
    />
    </motion.div>
  );
}
