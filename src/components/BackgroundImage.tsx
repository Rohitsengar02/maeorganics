'use client';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

export function BackgroundImage() {
  const { scrollYProgress } = useScroll();

  // Animate from behind Marquee to WhyChooseUs section
  const y = useTransform(scrollYProgress, [0.15, 0.8], ['-300vh', '300vh']);
  const x = useTransform(scrollYProgress, [0.15, 0.8], ['-10%', '-465%']);
  const rotate = useTransform(scrollYProgress, [0.15, 0.8], [-5, 5]);
  const scale = useTransform(scrollYProgress, [0.15, 0.8], [1.2, 0.8]);
  const opacity = useTransform(scrollYProgress, [0.15, 0.2], [0, 1]);
  
  return (
    <motion.div 
        className="absolute right-[-10%] top-0 w-[400px] h-[700px] mt-[430vh] z-0"
        style={{ y, x, rotate, scale, opacity }}
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
