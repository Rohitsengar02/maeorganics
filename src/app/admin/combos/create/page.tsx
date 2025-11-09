'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createCombo } from '@/lib/combos-api';
import { getProducts } from '@/lib/products-api';
import { getCoupons } from '@/lib/coupons-api';
import { uploadToCloudinary } from '@/lib/categories-api';
import Image from 'next/image';
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Upload,
  Package,
  DollarSign,
  Calendar,
  Tag,
  Image as ImageIcon
} from 'lucide-react';

export default function CreateComboPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string>('');
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    products: [{ product: '', quantity: 1, customRegularPrice: '', customDiscountedPrice: '' }],
    bannerImage: '',
    images: [''],
    discountType: 'percentage',
    discountValue: 0,
    coupon: '',
    isActive: true,
    isFeatured: false,
    startDate: '',
    endDate: '',
    stock: 0,
    tags: [''],
    category: 'other',
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: ['']
    }
  });

  useEffect(() => {
    fetchProducts();
    fetchCoupons();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts({ limit: 1000 });
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchCoupons = async () => {
    try {
      const response = await getCoupons();
      setCoupons(response.data);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
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
      products: [...formData.products, { product: '', quantity: 1, customRegularPrice: '', customDiscountedPrice: '' }]
    });
  };

  const removeProduct = (index: number) => {
    const newProducts = formData.products.filter((_, i) => i !== index);
    setFormData({ ...formData, products: newProducts });
  };

  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAdditionalImageFiles(prev => [...prev, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAdditionalImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImageFiles(prev => prev.filter((_, i) => i !== index));
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index));
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
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData({ ...formData, tags: newTags });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploading(true);

    try {
      // Validate banner image
      if (!bannerImageFile && !formData.bannerImage) {
        alert('Banner image is required');
        setLoading(false);
        setUploading(false);
        return;
      }

      let bannerImageUrl = formData.bannerImage;
      let additionalImageUrls: string[] = [];

      // Upload banner image to Cloudinary if a new file is selected
      if (bannerImageFile) {
        console.log('Uploading banner image to Cloudinary...');
        const bannerResult = await uploadToCloudinary(bannerImageFile, 'maeorganics/combos');
        bannerImageUrl = bannerResult.url;
      }

      // Upload additional images to Cloudinary
      if (additionalImageFiles.length > 0) {
        console.log('Uploading additional images to Cloudinary...');
        for (const file of additionalImageFiles) {
          const result = await uploadToCloudinary(file, 'maeorganics/combos');
          additionalImageUrls.push(result.url);
        }
      }

      setUploading(false);

      // Filter out empty values
      const cleanedData = {
        ...formData,
        bannerImage: bannerImageUrl,
        images: additionalImageUrls.length > 0 ? additionalImageUrls : formData.images.filter(img => img),
        products: formData.products.filter(p => p.product),
        tags: formData.tags.filter(tag => tag),
        coupon: formData.coupon || undefined,
        seo: {
          ...formData.seo,
          metaKeywords: formData.seo.metaKeywords.filter(k => k)
        }
      };

      await createCombo(cleanedData);
      alert('Combo created successfully!');
      router.push('/admin/combos');
    } catch (error: any) {
      console.error('Failed to create combo:', error);
      alert(error.message || 'Failed to create combo');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Product Combo</h1>
            <p className="text-gray-600">Bundle products together with special pricing</p>
          </div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
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
                  placeholder="e.g., Complete Kitchen Cleaning Bundle"
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
                  placeholder="Brief description for cards and previews"
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
                  placeholder="Detailed description of the combo and its benefits"
                />
                <p className="text-sm text-gray-500 mt-1">{formData.description.length}/2000</p>
              </div>
            </div>
          </div>

          {/* Products Selection */}
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
              {formData.products.map((item, index) => {
                const selectedProduct = products.find(p => p._id === item.product);
                
                // Use custom prices if provided, otherwise use product prices
                const regularPrice = item.customRegularPrice 
                  ? parseFloat(item.customRegularPrice) 
                  : selectedProduct?.regularPrice || 0;
                const discountedPrice = item.customDiscountedPrice 
                  ? parseFloat(item.customDiscountedPrice) 
                  : selectedProduct?.discountedPrice || 0;
                
                const productPrice = discountedPrice || regularPrice;
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
                          placeholder="Qty"
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
                    
                    {/* Custom Price Override */}
                    {selectedProduct && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Custom Regular Price (Optional)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.customRegularPrice}
                            onChange={(e) => handleProductChange(index, 'customRegularPrice', e.target.value)}
                            placeholder={`Default: ₹${selectedProduct.regularPrice}`}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Custom Discounted Price (Optional)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.customDiscountedPrice}
                            onChange={(e) => handleProductChange(index, 'customDiscountedPrice', e.target.value)}
                            placeholder={selectedProduct.discountedPrice ? `Default: ₹${selectedProduct.discountedPrice}` : 'No discount'}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Price Breakdown */}
                    {selectedProduct && (
                      <div className="flex items-center justify-between text-sm bg-gray-50 px-4 py-2 rounded">
                        <div className="flex items-center gap-4">
                          {discountedPrice && discountedPrice < regularPrice ? (
                            <>
                              <span className="text-gray-600">
                                Regular: <span className="line-through">₹{regularPrice.toFixed(2)}</span>
                                {item.customRegularPrice && <span className="ml-1 text-xs text-blue-600">(Custom)</span>}
                              </span>
                              <span className="text-green-600 font-semibold">
                                Sale: ₹{discountedPrice.toFixed(2)}
                                {item.customDiscountedPrice && <span className="ml-1 text-xs text-blue-600">(Custom)</span>}
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-600">
                              Price: ₹{regularPrice.toFixed(2)}
                              {item.customRegularPrice && <span className="ml-1 text-xs text-blue-600">(Custom)</span>}
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
            {formData.products.some(p => p.product) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total Original Price:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{formData.products.reduce((total, item) => {
                      const selectedProduct = products.find(p => p._id === item.product);
                      
                      // Use custom prices if provided
                      const regularPrice = item.customRegularPrice 
                        ? parseFloat(item.customRegularPrice) 
                        : selectedProduct?.regularPrice || 0;
                      const discountedPrice = item.customDiscountedPrice 
                        ? parseFloat(item.customDiscountedPrice) 
                        : selectedProduct?.discountedPrice || 0;
                      
                      const productPrice = discountedPrice || regularPrice;
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

          {/* Images */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Images
            </h2>
            
            <div className="space-y-6">
              {/* Banner Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4" />
                      Choose Banner Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerImageChange}
                        className="hidden"
                      />
                    </label>
                    {bannerImageFile && (
                      <span className="text-sm text-gray-600">{bannerImageFile.name}</span>
                    )}
                  </div>
                  
                  {bannerImagePreview && (
                    <div className="relative w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-200 overflow-hidden">
                      <Image
                        src={bannerImagePreview}
                        alt="Banner preview"
                        fill
                        className="object-contain p-4"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setBannerImageFile(null);
                          setBannerImagePreview('');
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Images (Optional)
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    Add More Images
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAdditionalImagesChange}
                      className="hidden"
                    />
                  </label>

                  {/* Additional Images Preview Grid */}
                  {additionalImagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {additionalImagePreviews.map((preview, index) => (
                        <div key={index} className="relative w-full h-40 bg-gray-50 rounded-lg border-2 border-gray-200 overflow-hidden group">
                          <Image
                            src={preview}
                            alt={`Additional image ${index + 1}`}
                            fill
                            className="object-contain p-2"
                          />
                          <button
                            type="button"
                            onClick={() => removeAdditionalImage(index)}
                            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                            {additionalImageFiles[index]?.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Discount */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing & Discount</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Type <span className="text-red-500">*</span>
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
                  Discount Value <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="discountValue"
                  required
                  min="0"
                  step="0.01"
                  value={formData.discountValue}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={formData.discountType === 'percentage' ? '10' : '100'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apply Coupon (Optional)
                </label>
                <select
                  name="coupon"
                  value={formData.coupon}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">No Coupon</option>
                  {coupons.map((coupon) => (
                    <option key={coupon._id} value={coupon._id}>
                      {coupon.code} - {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="100"
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-6">
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

            {/* Tags */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Tags</label>
                <button
                  type="button"
                  onClick={addTag}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  + Add Tag
                </button>
              </div>
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., eco-friendly, bestseller"
                  />
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Uploading Images...
                </>
              ) : loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating Combo...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Create Combo
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
