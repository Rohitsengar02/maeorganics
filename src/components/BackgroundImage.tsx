'use client';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function BackgroundImage() {
  const { scrollYProgress } = useScroll();

  // Animate from behind Marquee to WhyChooseUs section
  const y = useTransform(scrollYProgress, [0.3, 0.8], ['-50vh', '230vh']);
  const x = useTransform(scrollYProgress, [0.3, 0.8], ['-10%', '-155%']);
  const rotate = useTransform(scrollYProgress, [0.3, 0.8], [-5, 5]);
  const scale = useTransform(scrollYProgress, [0.3, 0.8], [1.2, 0.8]);
  
  // Z-index: Start behind, then move to front
  const zIndex = useTransform(scrollYProgress, (pos) => {
    return pos > 0.35 && pos < 0.78 ? 40 : 0;
  });

  return (
    <motion.div 
        className="absolute right-[-10%] top-0 w-[400px] h-[700px] mt-[70vh]"
        style={{ y, x, rotate, scale, zIndex }}
    >
    <Image
        src="https://res.cloudinary.com/ds1wiqrdb/image/upload/v1761643874/ChatGPT_Image_Oct_28_2025_02_57_54_PM_1_tys6ek.png"
        alt="Smoothie Bottle"
        fill
        className="object-contain"
    />
    </motion.div>
  );
}
