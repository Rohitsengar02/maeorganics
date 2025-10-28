'use client';
import { Star, Leaf, FlaskConical, CircleCheck } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Star className="w-8 h-8 text-yellow-500" />,
    title: 'Best Quality Ingredients',
    description: 'Sourced from the best farms to ensure freshness and taste.',
    align: 'text-right'
  },
    {
    icon: <Leaf className="w-8 h-8 text-green-500" />,
    title: 'Sustainable Practices',
    description: 'We prioritize sustainability in every step, from sourcing to packaging.',
    align: 'text-right'
  },
  {
    icon: <FlaskConical className="w-8 h-8 text-blue-500" />,
    title: 'Advanced Blends',
    description: 'Unique formulas designed for flavor and health benefits.',
    align: 'text-left'
  },

  {
    icon: <CircleCheck className="w-8 h-8 text-purple-500" />,
    title: 'Full Transparency',
    description: 'Know exactly what you\'re drinking with our clear labeling and sourcing.',
    align: 'text-left'
  }
];

const WhyChooseUs = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  
  const leftItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const rightItemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  };

  const centerItemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };


  return (
    <section className="py-2 mt-[-18rem] lg:mt-[1rem] sm:py-[-10rem] bg-[#fdf8e8] overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4">
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={itemVariants}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-headline font-black text-[#2d2b28]">Why Choose Our Smoothies?</h2>
          <p className="max-w-2xl mx-auto mt-4 text-[#5a5854]">
            Your self-care ritual in a bottle! It has branched-chain amino acids, is whatever & further has shatavari, an adaptogen that is prized.
          </p>
        </motion.div>

        {/* Desktop Layout */}
        <motion.div 
          className="hidden md:grid grid-cols-1 md:grid-cols-3 items-center gap-y-12 md:gap-x-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.div 
            className="space-y-12"
            variants={leftItemVariants}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className={features[0].align}>
              {features[0].icon}
              <h3 className="text-xl font-bold text-[#2d2b28] mt-2">{features[0].title}</h3>
              <p className="text-[#5a5854] mt-1">{features[0].description}</p>
            </div>
            <div className={features[1].align}>
              {features[1].icon}
              <h3 className="text-xl font-bold text-[#2d2b28] mt-2">{features[1].title}</h3>
              <p className="text-[#5a5854] mt-1">{features[1].description}</p>
            </div>
          </motion.div>

          <motion.div 
            className="flex flex-col items-center justify-center order-first md:order-none"
            variants={centerItemVariants}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="relative w-full h-96">
                {/* Intentionally empty on desktop */}
            </div>
          </motion.div>

          <motion.div 
            className="space-y-12"
            variants={rightItemVariants}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className={features[2].align}>
              {features[2].icon}
              <h3 className="text-xl font-bold text-[#2d2b28] mt-2">{features[2].title}</h3>
              <p className="text-[#5a5854] mt-1">{features[2].description}</p>
            </div>
            <div className={features[3].align}>
              {features[3].icon}
              <h3 className="text-xl font-bold text-[#2d2b28] mt-2">{features[3].title}</h3>
              <p className="text-[#5a5854] mt-1">{features[3].description}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Mobile Layout */}
        <motion.div 
          className="md:hidden flex flex-col items-center gap-y-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            className="relative w-64 h-96"
          >
            <Image
                src="https://res.cloudinary.com/ds1wiqrdb/image/upload/v1761643874/ChatGPT_Image_Oct_28_2025_02_57_54_PM_1_tys6ek.png"
                alt="Smoothie Bottle"
                fill
                className="object-contain drop-shadow-2xl"
                data-ai-hint="orange smoothie bottle"
            />
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-x-8 gap-y-12"
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div key={index} className="text-center flex flex-col items-center" variants={itemVariants}>
                {feature.icon}
                <h3 className="text-lg font-bold text-[#2d2b28] mt-2">{feature.title}</h3>
                <p className="text-[#5a5854] mt-1 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
