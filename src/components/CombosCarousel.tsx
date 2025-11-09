'use client';

import { useState, useEffect } from 'react';
import { getCombos } from '@/lib/combos-api';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Package, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';

const CombosCarousel = () => {
  const [combos, setCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const response = await getCombos({ isActive: true, limit: 10 });
        if (response.success) {
          setCombos(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch combos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCombos();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, combos.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, combos.length - 2)) % Math.max(1, combos.length - 2));
  };

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (combos.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-r from-green-50 via-blue-50 to-green-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-full mb-4"
          >
            <Package className="w-5 h-5" />
            <span className="font-bold">Special Combo Offers</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Save More with Bundles
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get the best value with our specially curated product combos
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {combos.length > 3 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </>
          )}

          {/* Cards Container */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: `-${currentIndex * (100 / 3)}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {combos.map((combo) => (
                <Link
                  key={combo._id}
                  href={`/combos/${combo._id}`}
                  className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3"
                >
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full"
                  >
                    {/* Image */}
                    <div className="relative h-64 bg-gradient-to-br from-green-100 to-blue-100 overflow-hidden">
                      <Image
                        src={combo.bannerImage}
                        alt={combo.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {combo.isFeatured && (
                          <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            ⭐ Featured
                          </span>
                        )}
                        <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                          Save ₹{combo.savings?.toFixed(0)}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {combo.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {combo.shortDescription || combo.description}
                      </p>

                      {/* Products Count */}
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <Package className="w-4 h-4" />
                        <span>{combo.products?.length || 0} Products Included</span>
                      </div>

                      {/* Product Images */}
                      {combo.products && combo.products.length > 0 && (
                        <div className="flex items-center gap-2 mb-4 overflow-hidden">
                          <div className="flex -space-x-3">
                            {combo.products.slice(0, 4).map((item: any, idx: number) => (
                              <div
                                key={idx}
                                className="relative w-12 h-12 rounded-full border-2 border-white bg-white shadow-md overflow-hidden"
                              >
                                {item.product?.images?.[0] && (
                                  <Image
                                    src={item.product.images[0]}
                                    alt={item.product?.name || 'Product'}
                                    fill
                                    className="object-contain p-1"
                                  />
                                )}
                              </div>
                            ))}
                            {combo.products.length > 4 && (
                              <div className="relative w-12 h-12 rounded-full border-2 border-white bg-gray-100 shadow-md flex items-center justify-center">
                                <span className="text-xs font-bold text-gray-600">
                                  +{combo.products.length - 4}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Pricing */}
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-xs text-gray-600">Regular Price</p>
                            <p className="text-lg font-semibold text-gray-500 line-through">
                              ₹{combo.originalPrice?.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-600">Combo Price</p>
                            <p className="text-2xl font-bold text-green-600">
                              ₹{combo.finalPrice?.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="bg-green-600 text-white text-center py-1 rounded-md">
                          <span className="text-xs font-bold">
                            🎉 {combo.discountType === 'percentage' ? `${combo.discountValue}%` : `₹${combo.discountValue}`} OFF
                          </span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Button className="w-full bg-green-600 hover:bg-green-700 rounded-xl">
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        View Combo
                      </Button>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          {combos.length > 3 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.max(1, combos.length - 2) }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'w-8 bg-green-600' : 'w-2 bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link
            href="/combos"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-lg"
          >
            View All Combos
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CombosCarousel;
