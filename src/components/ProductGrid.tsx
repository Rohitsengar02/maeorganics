'use client';

import { allProducts } from '@/lib/data';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface ProductGridProps {
    isGridView?: boolean;
}

const ProductGrid = forwardRef<HTMLDivElement, ProductGridProps>(({ isGridView = true }, ref) => {
  return (
    <motion.div
        ref={ref}
        className={cn(
            "grid gap-4 sm:gap-8 ",
            isGridView ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
        >
        {allProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
            <ProductCard product={product} isGridView={isGridView} />
            </motion.div>
        ))}
    </motion.div>
  );
});

ProductGrid.displayName = 'ProductGrid';

export default ProductGrid;
