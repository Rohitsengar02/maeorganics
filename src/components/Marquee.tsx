'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Marquee = () => {
  const marqueeRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: marqueeRef,
    offset: ['start end', 'end start'],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);
  const x2 = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);

  return (
    <section ref={marqueeRef} className="py-0 bg-[#fdf8e8]">
      <div className="relative flex flex-col overflow-hidden py-8 px-4 gap-4">
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          style={{ x: x1 }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="text-3xl font-headline font-semibold text-[#2d2b28]">
              Pure Herbal Freshness 🌿
            </span>
          ))}
        </motion.div>
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          style={{ x: x2 }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="text-3xl font-headline font-semibold text-[#b8884d]">
              Aloe & Mint Powered Cleanse 🍃
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Marquee;
