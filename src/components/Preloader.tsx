'use client';

import { motion } from 'framer-motion';

const text = "maeorganics";

const svgVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1, ease: 'easeInOut' },
  },
};

const pathVariants = {
  hidden: {
    pathLength: 0,
    fill: 'rgba(74, 72, 68, 0)',
  },
  visible: {
    pathLength: 1,
    fill: 'rgba(74, 72, 68, 1)',
    transition: {
      default: { duration: 2, ease: 'easeInOut' },
      fill: { duration: 1, ease: 'easeIn', delay: 1.8 },
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
      <motion.svg
        width="300"
        height="100"
        viewBox="0 0 300 100"
        variants={svgVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.text
          x="50%"
          y="50%"
          dy="15px"
          textAnchor="middle"
          fontFamily="Caprasimo"
          fontSize="3rem"
          stroke="#4a4844"
          strokeWidth="1px"
          variants={pathVariants}
        >
          {text}
        </motion.text>
      </motion.svg>
    </motion.div>
  );
};
