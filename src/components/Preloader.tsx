'use client';

import { motion } from 'framer-motion';

const text = "maeorganics";
const letters = Array.from(text);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.04 * i },
  }),
};

const childVariants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 100,
    },
  },
  hidden: {
    opacity: 0,
    y: 20,
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
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#fdf8e8]"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="font-headline text-5xl font-bold tracking-tighter text-[#4a4844] flex"
      >
        {letters.map((letter, index) => (
          <motion.span key={index} variants={childVariants}>
            {letter}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
};
