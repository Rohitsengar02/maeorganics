'use client';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

export function BackgroundImage() {
  const { scrollYProgress } = useScroll();
  const isMobile = useIsMobile();

  const y = useTransform(scrollYProgress, [0.15, 0.6], isMobile ? ['-20vh', '100vh'] : ['-150vh', '150vh']);
  const x = useTransform(
    scrollYProgress, 
    [0.1, 0.7], 
    isMobile ? ['0%', '0%'] : ['-10%', '-200%']
  );
  const rotate = useTransform(scrollYProgress, [0.1, 0.7], [-5, 5]);
  const scale = useTransform(scrollYProgress, [0.1, 0.7], [1.2, 0.8]);
  const opacity = useTransform(scrollYProgress, [0.1, 0.2], [0, 1]);
  
  const mobileMarginTop = '100vh';
  const desktopMarginTop = '230vh';

  const mobileClassName = "absolute left-1/2 -translate-x-1/2 top-0 w-[300px] h-[500px] z-0";
  const desktopClassName = "absolute right-[-10%] top-0 w-[300px] h-[500px] md:w-[400px] md:h-[700px] z-0";

  return (
    <motion.div 
        className={isMobile ? mobileClassName : desktopClassName}
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
