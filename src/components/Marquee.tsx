'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

const marqueeTexts = [
  "Pure Herbal Freshness 🌿",
  "Aloe & Mint Powered Cleanse 🍃",
  "Soothing Fragrance. Gentle Touch 💧",
  "Nature’s Care for Every Wash 🌱",
  "EcoBless – Made from Nature ♻️",
];

const MarqueeText = ({ children, direction }: { children: React.ReactNode, direction: number }) => {
    const marqueeRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: marqueeRef,
        offset: ["start end", "end start"]
    });

    const x = useTransform(scrollYProgress, [0, 1], [`${20 * direction}%`, `${-20 * direction}%`]);

    return (
        <motion.div ref={marqueeRef} className="overflow-hidden py-8 bg-[#f3b315]" style={{ x }}>
            <div className="flex gap-8 whitespace-nowrap">
                {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-3xl font-headline font-semibold text-white">
                        {children}
                    </span>
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
