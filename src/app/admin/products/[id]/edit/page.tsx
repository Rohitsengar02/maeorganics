'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageHeader from '../../../components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Plus, Save, ArrowLeft, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getCategories } from '@/lib/categories-api';
import { getProduct, updateProduct } from '@/lib/products-api';
import { uploadToCloudinary } from '@/lib/categories-api';

interface Product {
  _id: string;
  name: string;
  shortDescription?: string;
  longDescription?: string;
  sku: string;
  categories: string[];
  regularPrice: number;
  discountedPrice?: number;
  stockQuantity: number;
  status: string;
  tags: string[];
  delivery?: string;
  returns?: string;
  seoTitle?: string;
  seoDescription?: string;
  images: string[];
}

interface Category {
  _id: string;
  name: string;
  description?: string;
  image: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    longDescription: '',
    status: 'Draft',
    regularPrice: '',
    discountedPrice: '',
    sku: '',
    stockQuantity: '',
    categories: [] as string[],
    delivery: '',
    returns: '',
    tags: [] as string[],
    mainImage: null as File | null,
    galleryImages: [] as File[],
    seoTitle: '',
    seoDescription: ''
  });

  const [tagInput, setTagInput] = useState('');
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Load product and categories data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setCategoriesLoading(true);

        // Load categories
        const categoriesResponse = await getCategories();
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data);
        }

        // Load product
        const productResponse = await getProduct(productId);
        if (productResponse.success) {
          const productData = productResponse.data;

          setProduct(productData);
          setFormData({
            name: productData.name,
            shortDescription: productData.shortDescription || '',
            longDescription: productData.longDescription || '',
            status: productData.status,
            regularPrice: productData.regularPrice?.toString() || '',
            discountedPrice: productData.discountedPrice?.toString() || '',
            sku: productData.sku,
            stockQuantity: productData.stockQuantity?.toString() || '',
            categories: productData.categories || [],
            delivery: productData.delivery || '',
            returns: productData.returns || '',
            tags: productData.tags || [],
            mainImage: null,
            galleryImages: [],
            seoTitle: productData.seoTitle || '',
            seoDescription: productData.seoDescription || ''
          });

          setExistingImages(productData.images || []);
          setMainImagePreview(productData.images?.[0] || null);
          setGalleryPreviews(productData.images?.slice(1) || []);
        } else {
          setError('Failed to load product');
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load product data');
      } finally {
        setLoading(false);
        setCategoriesLoading(false);
      }
    };

    if (productId) {
      loadData();
    }
  }, [productId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle category selection
  const handleAddCategory = (categoryId: string) => {
    if (!formData.categories.includes(categoryId)) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, categoryId]
      }));
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(id => id !== categoryId)
    }));
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size too large. Please choose a file smaller than 5MB.');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      console.log('Image selected:', file.name, file.size, file.type);
      setFormData(prev => ({ ...prev, mainImage: file }));

      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('Image preview generated');
        setMainImagePreview(e.target?.result as string);
      };
      reader.onerror = () => {
        console.error('Error reading file');
        alert('Error reading the selected file.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      galleryImages: [...prev.galleryImages, ...files]
    }));

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setGalleryPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      // Validate required fields
      if (!formData.name.trim()) {
        alert('Product name is required');
        return;
      }

      if (!formData.sku.trim()) {
        alert('SKU is required');
        return;
      }

      if (formData.categories.length === 0) {
        alert('At least one category is required');
        return;
      }

      if (!formData.regularPrice) {
        alert('Regular price is required');
        return;
      }

      if (!formData.stockQuantity) {
        alert('Stock quantity is required');
        return;
      }

      let allImages = [...existingImages];

      // Upload new main image if provided
      if (formData.mainImage) {
        console.log('Uploading new main image to Cloudinary...');
        const mainImageResult = await uploadToCloudinary(formData.mainImage, 'maeorganics/products');
        allImages[0] = mainImageResult.url; // Replace first image
      }

      // Upload new gallery images if provided
      if (formData.galleryImages.length > 0) {
        console.log('Uploading new gallery images to Cloudinary...');
        for (const image of formData.galleryImages) {
          const result = await uploadToCloudinary(image, 'maeorganics/products');
          allImages.push(result.url);
        }
      }

      // Prepare update data
      const updateData = {
        name: formData.name,
        shortDescription: formData.shortDescription,
        longDescription: formData.longDescription,
        sku: formData.sku,
        categories: formData.categories,
        regularPrice: parseFloat(formData.regularPrice),
        discountedPrice: formData.discountedPrice ? parseFloat(formData.discountedPrice) : undefined,
        stockQuantity: parseInt(formData.stockQuantity),
        status: formData.status,
        tags: formData.tags,
        delivery: formData.delivery,
        returns: formData.returns,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        images: allImages
      };

      console.log('Updating product...');
      const result = await updateProduct(productId, updateData);

      if (result.success) {
        console.log('Product updated successfully:', result);
        alert('Product updated successfully!');
        router.push('/admin/products');
      } else {
        throw new Error(result.message || 'Failed to update product');
      }

    } catch (error) {
      console.error('Error updating product:', error);
      alert(`Error updating product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading product...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️ {error || 'Product not found'}</div>
          <Button onClick={() => router.push('/admin/products')} variant="outline">
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      <PageHeader
        title={`Edit Product: ${product.name}`}
        description="Update product information and settings."
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/admin/products')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleSubmit} disabled={saving} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </PageHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📝 Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    placeholder="Enter SKU"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  placeholder="Brief product description (max 200 characters)"
                  rows={3}
                  maxLength={200}
                />
                <div className="text-sm text-gray-500 text-right">
                  {formData.shortDescription.length}/200
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="longDescription">Long Description</Label>
                <Textarea
                  id="longDescription"
                  value={formData.longDescription}
                  onChange={(e) => handleInputChange('longDescription', e.target.value)}
                  placeholder="Detailed product description with features, benefits, and usage instructions"
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pricing */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💰 Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="regularPrice">Regular Price (₹) *</Label>
                  <Input
                    id="regularPrice"
                    type="number"
                    value={formData.regularPrice}
                    onChange={(e) => handleInputChange('regularPrice', e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountedPrice">Discounted Price (₹)</Label>
                  <Input
                    id="discountedPrice"
                    type="number"
                    value={formData.discountedPrice}
                    onChange={(e) => handleInputChange('discountedPrice', e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Images */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🖼️ Product Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Image */}
              <div className="space-y-2">
                <Label>Main Image</Label>
                <div className="flex items-center gap-4">
                  <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                    {mainImagePreview ? (
                      <img src={mainImagePreview} alt="Main product" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <Upload className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      className="hidden"
                      id="main-image"
                    />
                    <Label htmlFor="main-image" className="cursor-pointer">
                      <div className="flex items-center justify-center w-full px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium transition-colors">
                        <Upload className="mr-2 h-4 w-4" />
                        Change Main Image
                      </div>
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Leave empty to keep current image. Recommended: 800x800px, max 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Gallery Images */}
              <div className="space-y-2">
                <Label>Gallery Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Existing gallery images */}
                  {galleryPreviews.map((preview, index) => (
                    <div key={`existing-${index}`} className="relative group">
                      <img src={preview} alt={`Gallery ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}

                  {/* New images being added */}
                  {formData.galleryImages.map((file, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New gallery ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(galleryPreviews.length + index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}

                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryImagesChange}
                      className="hidden"
                      id="gallery-images"
                    />
                    <Label htmlFor="gallery-images" className="cursor-pointer">
                      <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                        <Plus className="h-8 w-8 text-gray-400" />
                      </div>
                    </Label>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Add multiple product images (max 10 images)
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Inventory & Status */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📦 Inventory & Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Categories *</Label>

                  {/* Available Categories */}
                  {categoriesLoading ? (
                    <div className="text-sm text-gray-500">Loading categories...</div>
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto border rounded-lg p-3">
                        {categories.map((category) => (
                          <div
                            key={category._id}
                            className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                              formData.categories.includes(category._id)
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => {
                              if (formData.categories.includes(category._id)) {
                                handleRemoveCategory(category._id);
                              } else {
                                handleAddCategory(category._id);
                              }
                            }}
                          >
                            <div className="relative w-8 h-8 rounded overflow-hidden bg-gray-100">
                              <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{category.name}</div>
                              <div className="text-xs text-gray-500 truncate">{category.description}</div>
                            </div>
                            {formData.categories.includes(category._id) && (
                              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                <X className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}
                          </div>
                        ))}
                        {categories.length === 0 && !categoriesLoading && (
                          <div className="col-span-full text-center py-4 text-gray-500">
                            No categories available. Create categories first.
                          </div>
                        )}
                      </div>

                      {/* Selected Categories */}
                      {formData.categories.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-sm">Selected Categories ({formData.categories.length})</Label>
                          <div className="flex flex-wrap gap-2">
                            {formData.categories.map((categoryId) => {
                              const category = categories.find(c => c._id === categoryId);
                              if (!category) return null;
                              return (
                                <Badge key={categoryId} variant="default" className="flex items-center gap-2 px-3 py-1">
                                  <div className="relative w-3 h-3 rounded overflow-hidden">
                                    <Image
                                      src={category.image}
                                      alt={category.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <span className="text-xs">{category.name}</span>
                                  <X
                                    className="w-3 h-3 cursor-pointer hover:text-red-300"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveCategory(categoryId);
                                    }}
                                  />
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tags */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏷️ Tags & Keywords
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Add Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Enter tag (e.g., organic, vitamin-c)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Delivery & Returns */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🚚 Delivery & Returns
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="delivery">Delivery Information</Label>
                <Textarea
                  id="delivery"
                  value={formData.delivery}
                  onChange={(e) => handleInputChange('delivery', e.target.value)}
                  placeholder="Describe delivery options, timeframes, and shipping costs"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="returns">Returns & Refunds</Label>
                <Textarea
                  id="returns"
                  value={formData.returns}
                  onChange={(e) => handleInputChange('returns', e.target.value)}
                  placeholder="Describe return policy, refund process, and conditions"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* SEO Settings */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔍 SEO Settings
              </CardTitle>
              <p className="text-sm text-gray-600">Optimize this product for search engines</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                  placeholder="SEO-friendly title"
                  maxLength={60}
                />
                <div className="text-sm text-gray-500 text-right">
                  {formData.seoTitle.length}/60 characters
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  value={formData.seoDescription}
                  onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                  placeholder="Brief description for search results"
                  rows={3}
                  maxLength={160}
                />
                <div className="text-sm text-gray-500 text-right">
                  {formData.seoDescription.length}/160 characters
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Submit Buttons */}
        <motion.div variants={itemVariants} className="flex justify-end gap-4 pt-6">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/products')}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
