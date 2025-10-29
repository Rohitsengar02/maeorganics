
'use client';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { RefObject } from 'react';

export function BackgroundImage2({ startRef, endRef }: { startRef: RefObject<HTMLDivElement>, endRef: RefObject<HTMLDivElement> }) {
  const { scrollYProgress } = useScroll({
    target: startRef,
    offset: ['start end', 'end start'],
  });

  const { scrollYProgress: endScrollYProgress } = useScroll({
    target: endRef,
    offset: ['start end', 'center center'],
  });

  const x = useTransform(scrollYProgress, [0.3, 1], ['-40vw', '50vw']);
  const y = useTransform(scrollYProgress, [0.3, 1], ['0vh', '468vh']);
  
  const finalY = useTransform(endScrollYProgress, [0, 1], [y.get(), 100]);
  const finalX = useTransform(endScrollYProgress, [0, 1], [x.get(), 20]);


  const opacity = useTransform(scrollYProgress, [0.3, 0.4, 0.9, 1], [0, 1, 1, 0]);
  const rotate = useTransform(scrollYProgress, [0.3, 1], [-15, 15]);

  return (
    <motion.div 
        className="absolute left-0 top-1/2 w-[300px] h-[500px] z-20"
        style={{ 
          y: scrollYProgress.get() < 1 ? y : finalY,
          x: scrollYProgress.get() < 1 ? x : finalX,
          opacity,
          rotate
        }}
    >
        <Image
            src="https://res.cloudinary.com/ds1wiqrdb/image/upload/v1761643874/ChatGPT_Image_Oct_28_2025_02_57_54_PM_1_tys6ek.png"
            alt="Smoothie Bottle"
            fill
            className="object-contain drop-shadow-2xl"
        />
    </motion.div>
  );
}
