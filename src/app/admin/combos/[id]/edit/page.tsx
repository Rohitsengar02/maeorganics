'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCombo, updateCombo } from '@/lib/combos-api';
import { getProducts } from '@/lib/products-api';
import { getCoupons } from '@/lib/coupons-api';
import { Save, X, Plus, Trash2 } from 'lucide-react';

export default function EditComboPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      setFetchLoading(true);
      const [comboRes, productsRes, couponsRes] = await Promise.all([
        getCombo(params.id as string),
        getProducts({ limit: 1000 }),
        getCoupons()
      ]);

      setProducts(productsRes.data);
      setCoupons(couponsRes.data);

      // Format combo data for form
      const combo = comboRes.data;
      setFormData({
        title: combo.title || '',
        description: combo.description || '',
        shortDescription: combo.shortDescription || '',
        products: combo.products.map((p: any) => ({
          product: typeof p.product === 'object' ? p.product._id : p.product,
          quantity: p.quantity
        })),
        bannerImage: combo.bannerImage || '',
        images: combo.images?.length > 0 ? combo.images : [''],
        discountType: combo.discountType || 'percentage',
        discountValue: combo.discountValue || 0,
        coupon: typeof combo.coupon === 'object' ? combo.coupon?._id : combo.coupon || '',
        isActive: combo.isActive,
        isFeatured: combo.isFeatured,
        startDate: combo.startDate ? new Date(combo.startDate).toISOString().slice(0, 16) : '',
        endDate: combo.endDate ? new Date(combo.endDate).toISOString().slice(0, 16) : '',
        stock: combo.stock || 0,
        tags: combo.tags?.length > 0 ? combo.tags : [''],
        category: combo.category || 'other',
        seo: {
          metaTitle: combo.seo?.metaTitle || '',
          metaDescription: combo.seo?.metaDescription || '',
          metaKeywords: combo.seo?.metaKeywords?.length > 0 ? combo.seo.metaKeywords : ['']
        }
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
      alert('Failed to load combo data');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleProductChange = (index: number, field: string, value: any) => {
    const newProducts = [...formData.products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setFormData({ ...formData, products: newProducts });
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { product: '', quantity: 1 }]
    });
  };

  const removeProduct = (index: number) => {
    const newProducts = formData.products.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, products: newProducts });
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImage = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData({ ...formData, tags: newTags });
  };

  const addTag = () => {
    setFormData({ ...formData, tags: [...formData.tags, ''] });
  };

  const removeTag = (index: number) => {
    const newTags = formData.tags.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, tags: newTags });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanedData = {
        ...formData,
        products: formData.products.filter((p: any) => p.product),
        images: formData.images.filter((img: string) => img),
        tags: formData.tags.filter((tag: string) => tag),
        coupon: formData.coupon || undefined,
        seo: {
          ...formData.seo,
          metaKeywords: formData.seo.metaKeywords.filter((k: string) => k)
        }
      };

      await updateCombo(params.id as string, cleanedData);
      alert('Combo updated successfully!');
      router.push('/admin/combos');
    } catch (error: any) {
      console.error('Failed to update combo:', error);
      alert(error.message || 'Failed to update combo');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading || !formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading combo data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Combo</h1>
            <p className="text-gray-600">Update combo details and settings</p>
          </div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Same form fields as create page */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Combo Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description
                </label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  maxLength={500}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  maxLength={2000}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Products Selection - Same as create */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Products in Combo</h2>
              <button
                type="button"
                onClick={addProduct}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>

            <div className="space-y-4">
              {formData.products.map((item: any, index: number) => {
                const selectedProduct = products.find(p => p._id === item.product);
                const productPrice = selectedProduct?.discountedPrice || selectedProduct?.regularPrice || 0;
                const itemTotal = productPrice * (item.quantity || 1);
                
                return (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <select
                          value={item.product}
                          onChange={(e) => handleProductChange(index, 'product', e.target.value)}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="">Select Product</option>
                          {products.map((product) => {
                            const hasDiscount = product.discountedPrice && product.discountedPrice < product.regularPrice;
                            const displayPrice = hasDiscount 
                              ? `₹${product.discountedPrice} (was ₹${product.regularPrice})`
                              : `₹${product.regularPrice}`;
                            return (
                              <option key={product._id} value={product._id}>
                                {product.name} - {displayPrice}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="w-32">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      {formData.products.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProduct(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    
                    {/* Price Breakdown */}
                    {selectedProduct && (
                      <div className="flex items-center justify-between text-sm bg-gray-50 px-4 py-2 rounded">
                        <div className="flex items-center gap-4">
                          {selectedProduct.discountedPrice && selectedProduct.discountedPrice < selectedProduct.regularPrice ? (
                            <>
                              <span className="text-gray-600">
                                Regular: <span className="line-through">₹{selectedProduct.regularPrice}</span>
                              </span>
                              <span className="text-green-600 font-semibold">
                                Sale: ₹{selectedProduct.discountedPrice}
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-600">
                              Price: ₹{selectedProduct.regularPrice}
                            </span>
                          )}
                        </div>
                        <div className="font-semibold text-gray-900">
                          Subtotal: ₹{itemTotal.toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Total Price Summary */}
            {formData.products.some((p: any) => p.product) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total Original Price:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{formData.products.reduce((total: number, item: any) => {
                      const selectedProduct = products.find(p => p._id === item.product);
                      const productPrice = selectedProduct?.discountedPrice || selectedProduct?.regularPrice || 0;
                      return total + (productPrice * (item.quantity || 1));
                    }, 0).toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  This is the base price before applying combo discount
                </p>
              </div>
            )}
          </div>

          {/* Pricing & Settings - Same structure as create page */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing & Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Type
                </label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Value
                </label>
                <input
                  type="number"
                  name="discountValue"
                  min="0"
                  step="0.01"
                  value={formData.discountValue}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="seasonal">Seasonal</option>
                  <option value="bestseller">Bestseller</option>
                  <option value="limited">Limited Edition</option>
                  <option value="special">Special Offer</option>
                  <option value="clearance">Clearance</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2 flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Update Combo
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
