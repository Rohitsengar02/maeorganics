'use client';

import { motion } from 'framer-motion';

const marqueeVariants = {
  animate: {
    x: [0, -1000],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: 'loop',
        duration: 20,
        ease: 'linear',
      },
    },
  },
};

const Marquee = () => {
  return (
    <section className="py-0">
      <div className="relative flex overflow-hidden py-8 px-4 bg-black text-white">
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          variants={marqueeVariants}
          animate="animate"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="text-3xl font-headline font-semibold">
              Pure Herbal Freshness 🌿
            </span>
          ))}
        </motion.div>
      </div>
       <div className="relative flex overflow-hidden py-8 px-4 bg-white text-black">
        <motion.div
          className="flex gap-8 whitespace-nowrap"
           variants={marqueeVariants}
           animate="animate"
           style={{x: '-1000px'}}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="text-3xl font-headline font-semibold">
              Aloe & Mint Powered Cleanse 🍃
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Marquee;
