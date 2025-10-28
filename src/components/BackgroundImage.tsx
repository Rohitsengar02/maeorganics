'use client';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function BackgroundImage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [-15, 15]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1.2]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0">
        <motion.div 
            className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[500px] h-[700px] opacity-20"
            style={{ rotate, scale }}
        >
        <Image
            src="https://res.cloudinary.com/ds1wiqrdb/image/upload/v1761643874/ChatGPT_Image_Oct_28_2025_02_57_54_PM_1_tys6ek.png"
            alt="Smoothie Bottle"
            fill
            className="object-contain"
        />
        </motion.div>
    </div>
  );
}
