'use client';

import { useState, useEffect } from 'react';
import { getProducts } from '@/lib/products-api';
import { getProductReviews } from '@/lib/reviews-api';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import type { Smoothie } from '@/lib/types';

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
  filters?: {
    search?: string;
    priceMin?: number | null;
    priceMax?: number | null;
    categorySlug?: string | null;
    minRating?: number | null;
    tags?: string[];
    sort?: 'all' | 'price-asc' | 'price-desc' | 'date-desc' | 'alphabetical';
  };
}

// Convert API product to Smoothie format
const convertToSmoothie = (apiProduct: any): Smoothie => {
  return {
    id: apiProduct._id,
    name: apiProduct.name,
    description: apiProduct.shortDescription || apiProduct.longDescription || 'No description available',
    price: apiProduct.currentPrice || apiProduct.regularPrice,
    image: {
      id: `img-${apiProduct._id}`,
      description: apiProduct.name,
      imageUrl: apiProduct.images?.[0] || '/placeholder-product.png',
      imageHint: apiProduct.name
    },
    rating: Number(apiProduct.averageRating ?? apiProduct.rating ?? 4.5),
    ratingCount: Number(apiProduct.totalReviews ?? apiProduct.reviewsCount ?? 10),
    // carry raw fields for filtering
    // @ts-ignore
    categorySlug: apiProduct.category?.slug || apiProduct.categorySlug || null,
    // @ts-ignore
    tags: Array.isArray(apiProduct.tags) ? apiProduct.tags : [],
    // @ts-ignore
    createdAt: apiProduct.createdAt || null,
  };
};

const ProductGrid = forwardRef<HTMLDivElement, ProductGridProps>(
  ({ isGridView = true, filters }, ref) => {
    const [products, setProducts] = useState<Smoothie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const loadProducts = async () => {
        try {
          setLoading(true);
          setError(null);

          const response = await getProducts({ limit: 20 }); // Get up to 20 products
          if (response.success) {
            const base = response.data.map(convertToSmoothie);
            // enrich ratings from reviews collection
            const enriched = await Promise.all(
              base.map(async (p: Smoothie) => {
                try {
                  const res = await getProductReviews(p.id, { limit: 100 });
                  const reviews = (res.data || res.reviews || res) as any[];
                  if (Array.isArray(reviews) && reviews.length > 0) {
                    const avg = reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / reviews.length;
                    return { ...p, rating: Number(avg.toFixed(1)), ratingCount: reviews.length } as any;
                  }
                } catch {}
                return p;
              })
            );
            setProducts(enriched);
          } else {
            setError('Failed to load products');
          }
        } catch (err) {
          console.error('Error loading products:', err);
          setError('Failed to load products');
        } finally {
          setLoading(false);
        }
      };

      loadProducts();
    }, []);

    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading products...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
          >
            Try Again
          </button>
        </div>
      );
    }

    // apply filters
    const filtered = products.filter((p) => {
      const f = filters || {};
      if (f.search && !p.name.toLowerCase().includes(f.search.toLowerCase())) return false;
      if (f.priceMin != null && p.price < f.priceMin) return false;
      if (f.priceMax != null && p.price > f.priceMax) return false;
      if (f.categorySlug && (p as any).categorySlug && (p as any).categorySlug !== f.categorySlug) return false;
      if (f.tags && f.tags.length > 0) {
        const ptags: string[] = (p as any).tags || [];
        if (!f.tags.every(t => ptags.includes(t))) return false;
      }
      if (f.minRating != null && (p as any).rating < f.minRating) return false;
      return true;
    });
    const sorted = (() => {
      switch (filters?.sort) {
        case 'price-asc':
          return filtered.slice().sort((a, b) => a.price - b.price);
        case 'price-desc':
          return filtered.slice().sort((a, b) => b.price - a.price);
        case 'alphabetical':
          return filtered.slice().sort((a, b) => a.name.localeCompare(b.name));
        case 'date-desc':
          return filtered.slice().sort((a: any, b: any) => {
            const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return tb - ta;
          });
        default:
          return filtered;
      }
    })();

    if (sorted.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">No products available at the moment.</p>
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          'grid gap-4 sm:gap-8 relative',
          isGridView ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
        )}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        {sorted.map((product) => (
          <motion.div
            key={product.id}
            variants={itemVariants}
            className="relative z-30"
          >
            <ProductCard product={product} isGridView={isGridView} />
          </motion.div>
        ))}
      </motion.div>
    );
  }
);

ProductGrid.displayName = 'ProductGrid';
export default ProductGrid;
