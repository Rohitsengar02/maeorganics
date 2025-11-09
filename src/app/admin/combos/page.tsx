'use client';

import { useState, useEffect } from 'react';
import { getCombos, deleteCombo, toggleComboActive } from '@/lib/combos-api';
import { getProducts } from '@/lib/products-api';
import { getCoupons } from '@/lib/coupons-api';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Package, 
  TrendingUp,
  Power,
  PowerOff,
  Star,
  Calendar,
  DollarSign,
  Tag
} from 'lucide-react';

export default function AdminCombosPage() {
  const [combos, setCombo] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    isActive: '',
    category: '',
  });

  useEffect(() => {
    fetchCombos();
  }, [filter]);

  const fetchCombos = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (filter.isActive) filters.isActive = filter.isActive === 'true';
      if (filter.category) filters.category = filter.category;

      const response = await getCombos(filters);
      setCombo(response.data);
    } catch (error) {
      console.error('Failed to fetch combos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this combo?')) return;

    try {
      await deleteCombo(id);
      fetchCombos();
    } catch (error) {
      console.error('Failed to delete combo:', error);
      alert('Failed to delete combo');
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await toggleComboActive(id);
      fetchCombos();
    } catch (error) {
      console.error('Failed to toggle combo status:', error);
      alert('Failed to toggle combo status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Combos</h1>
            <p className="text-gray-600">Create and manage product bundles and special offers</p>
          </div>
          <Link
            href="/admin/combos/create"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Combo
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Combos</p>
                <p className="text-2xl font-bold text-gray-900">{combos.length}</p>
              </div>
              <Package className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {combos.filter(c => c.isActive).length}
                </p>
              </div>
              <Power className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Featured</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {combos.filter(c => c.isFeatured).length}
                </p>
              </div>
              <Star className="w-10 h-10 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-purple-600">
                  {combos.reduce((sum, c) => sum + (c.soldCount || 0), 0)}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={filter.isActive}
              onChange={(e) => setFilter({ ...filter, isActive: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="seasonal">Seasonal</option>
              <option value="bestseller">Bestseller</option>
              <option value="limited">Limited Edition</option>
              <option value="special">Special Offer</option>
              <option value="clearance">Clearance</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Combos Grid */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading combos...</p>
          </div>
        ) : combos.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No combos found</p>
            <Link
              href="/admin/combos/create"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Combo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {combos.map((combo) => (
              <div key={combo._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Banner Image */}
                <div className="relative h-48 bg-gray-200">
                  {combo.bannerImage ? (
                    <Image
                      src={combo.bannerImage}
                      alt={combo.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Package className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  {combo.isFeatured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Featured
                    </div>
                  )}
                  <div className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-semibold ${
                    combo.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                  }`}>
                    {combo.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {combo.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {combo.shortDescription || combo.description}
                  </p>

                  {/* Products Count */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Package className="w-4 h-4" />
                    <span>{combo.products?.length || 0} Products</span>
                  </div>

                  {/* Pricing */}
                  <div className="mb-4 bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                    {/* Price Breakdown */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Total Regular Price:</span>
                        <span className="font-semibold text-gray-900">₹{combo.originalPrice?.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-red-600">Combo Discount:</span>
                        <span className="font-semibold text-red-600">
                          - ₹{combo.savings?.toFixed(2)}
                          <span className="ml-1 text-xs">
                            ({combo.discountType === 'percentage' ? `${combo.discountValue}%` : `₹${combo.discountValue}`})
                          </span>
                        </span>
                      </div>
                      <div className="border-t border-green-300 pt-2 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Final Combo Price:</span>
                          <span className="text-2xl font-bold text-green-600">
                            ₹{combo.finalPrice?.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Savings Badge */}
                    <div className="bg-green-600 text-white text-center py-1.5 rounded-md">
                      <span className="text-xs font-bold">
                        🎉 YOU SAVE ₹{combo.savings?.toFixed(2)}!
                      </span>
                    </div>
                  </div>

                  {/* Category & Stock */}
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {combo.category}
                    </span>
                    <span>Stock: {combo.stock}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/combos/${combo._id}/edit`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleToggleActive(combo._id)}
                      className={`p-2 rounded-lg transition-colors ${
                        combo.isActive
                          ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                      title={combo.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {combo.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(combo._id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
