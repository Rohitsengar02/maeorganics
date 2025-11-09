'use client';

import { useState, useEffect } from 'react';
import { getCombos } from '@/lib/combos-api';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ShoppingCart, Star, Tag, TrendingUp } from 'lucide-react';
import { Header } from '@/components/header';
import Footer from '@/components/Footer';

export default function CombosPage() {
  const [combos, setCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCombos();
  }, [filter]);

  const fetchCombos = async () => {
    try {
      setLoading(true);
      const filters: any = {
        isActive: true,
      };
      
      if (filter !== 'all') {
        filters.category = filter;
      }

      const response = await getCombos(filters);
      setCombos(response.data);
    } catch (error) {
      console.error('Failed to fetch combos:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All Combos' },
    { value: 'seasonal', label: 'Seasonal' },
    { value: 'bestseller', label: 'Bestseller' },
    { value: 'limited', label: 'Limited Edition' },
    { value: 'special', label: 'Special Offer' },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🎁 Special Combo Offers
            </h1>
            <p className="text-xl text-green-50 max-w-2xl mx-auto">
              Save more with our specially curated product bundles. Get the best value for your money!
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  filter === cat.value
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Combos Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading amazing combos...</p>
          </div>
        ) : combos.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No combos available</h3>
            <p className="text-gray-500">Check back soon for exciting offers!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {combos.map((combo) => (
              <Link
                key={combo._id}
                href={`/combos/${combo._id}`}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Banner Image */}
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  {combo.bannerImage ? (
                    <Image
                      src={combo.bannerImage}
                      alt={combo.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Package className="w-20 h-20 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {combo.isFeatured && (
                      <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Star className="w-3 h-3 fill-current" />
                        Featured
                      </div>
                    )}
                    <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      Save ₹{combo.savings?.toFixed(0)}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {combo.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {combo.shortDescription || combo.description}
                  </p>

                  {/* Products Count */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Package className="w-4 h-4" />
                    <span className="font-medium">{combo.products?.length || 0} Products Included</span>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-200 mb-4">
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

                  {/* View Details Button */}
                  <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg">
                    <ShoppingCart className="w-5 h-5" />
                    View Details
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
}
