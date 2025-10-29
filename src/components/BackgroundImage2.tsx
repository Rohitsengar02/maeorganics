
'use client';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { RefObject } from 'react';

export function BackgroundImage2({ scrollRef }: { scrollRef: RefObject<HTMLDivElement> }) {
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0.2, 0.7], ['-100%', '50%']);
  const y = useTransform(scrollYProgress, [0.2, 0.7], ['-10vh', '10vh']);
  const opacity = useTransform(scrollYProgress, [0.2, 0.3, 0.6, 0.7], [0, 1, 1, 0]);
  const rotate = useTransform(scrollYProgress, [0.2, 0.7], [-15, 15]);

  return (
    <motion.div 
        className="absolute left-0 top-1/2 w-[300px] h-[500px] z-20"
        style={{ y, x, opacity, rotate }}
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
