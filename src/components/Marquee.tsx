'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const MarqueeText = ({ children, direction }: { children: React.ReactNode, direction: number }) => {
    const marqueeRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: marqueeRef,
        offset: ["start end", "end start"]
    });

    const x = useTransform(scrollYProgress, [0, 1], [`${20 * direction}%`, `${-20 * direction}%`]);
    const backgroundColor = useTransform(scrollYProgress, [0.1, 0.9], ['#1a1815', '#ffffff']);
    const color = useTransform(scrollYProgress, [0.1, 0.9], ['#ffffff', '#2d2b28']);

    return (
        <motion.div ref={marqueeRef} className="overflow-hidden py-8 px-4" style={{ backgroundColor, x }}>
            <div className="flex gap-8 whitespace-nowrap">
                {Array.from({ length: 5 }).map((_, i) => (
                    <motion.span key={i} className="text-3xl font-headline font-semibold" style={{ color }}>
                        {children}
                    </motion.span>
                ))}
            </div>
        </motion.div>
    )
}


const Marquee = () => {

  return (
    <section className="py-0">
        <MarqueeText direction={1}>Pure Herbal Freshness 🌿</MarqueeText>
        <MarqueeText direction={-1}>Aloe & Mint Powered Cleanse 🍃</MarqueeText>
    </section>
  );
};

export default Marquee;
