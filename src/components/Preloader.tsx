'use client';

import { motion } from 'framer-motion';

const text = "maeorganics";
const letters = text.split("");

const containerVariants = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.04 * i },
  }),
};

const childVariants = {
    hidden: {
        opacity: 0,
        y: 20,
        x: '50%',
        transition: {
            type: 'spring',
            damping: 12,
            stiffness: 100,
        },
    },
    visible: {
        opacity: 1,
        y: 0,
        x: '50%',
        transition: {
            type: 'spring',
            damping: 12,
            stiffness: 100,
        },
    },
};

export const Preloader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#fdf8e8]"
    >
      <motion.div
        className="font-headline text-3xl md:text-5xl font-bold text-[#4a4844] flex"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {letters.map((letter, index) => (
          <motion.span key={index} variants={childVariants} style={{ position: 'relative', display: 'inline-block' }}>
            {letter}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
};
