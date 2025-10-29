'use client';

import { Truck, Undo2, ShieldCheck, Headset, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Truck className="h-10 w-10 text-primary" />,
    title: 'Free Shipping',
    description: 'For all orders over Rs.499',
  },
  {
    icon: <Undo2 className="h-10 w-10 text-primary" />,
    title: '1 & 1 Returns',
    description: 'Cancellation after 1 day',
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: '100% Secure Payment',
    description: 'Guarantee secure payments',
  },
  {
    icon: <Headset className="h-10 w-10 text-primary" />,
    title: '24/7 Dedicated Support',
    description: 'Anywhere & anytime',
  },
  {
    icon: <Tag className="h-10 w-10 text-primary" />,
    title: 'Daily Offers',
    description: 'Discount up to 15% OFF',
  },
];

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
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
        type: 'spring',
        stiffness: 100,
    }
  },
};


const ShopFeatures = () => {
  return (
    <section className="py-24 bg-[#fdf8e8] relative">
      <motion.div 
        className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-4 p-6 rounded-2xl bg-white/50 shadow-md backdrop-blur-sm"
            variants={itemVariants}
          >
            <div className="flex-shrink-0">{feature.icon}</div>
            <div>
              <h3 className="text-base font-bold text-[#2d2b28]">{feature.title}</h3>
              <p className="text-sm text-[#5a5854]">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ShopFeatures;
