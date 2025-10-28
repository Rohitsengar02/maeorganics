'use client';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function BackgroundImage() {
  const { scrollYProgress } = useScroll();

  // Animate from behind Marquee to WhyChooseUs section
  // Y position: Start at top of FeaturedProducts, end in WhyChooseUs
  const y = useTransform(scrollYProgress, [0.1, 0.7], ['-50vh', '250vh']); 
  const rotate = useTransform(scrollYProgress, [0.1, 0.7], [-15, 15]);
  const scale = useTransform(scrollYProgress, [0.1, 0.7], [0.8, 1.2]);
  
  // Z-index: Start behind, then move to front
  const zIndex = useTransform(scrollYProgress, (pos) => {
    return pos > 0.15 && pos < 0.75 ? 40 : 0;
  });

  return (
    <motion.div 
        className="absolute right-[-10%] top-0 w-[500px] h-[700px] mt-[130vh]"
        style={{ y, rotate, scale, zIndex }}
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
