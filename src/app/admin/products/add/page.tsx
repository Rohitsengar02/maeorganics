'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { uploadToCloudinary, getCategories } from '@/lib/categories-api';
import { createProduct } from '@/lib/products-api';
import PageHeader from '../../components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { Upload, X, Plus, Save, ArrowLeft, ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    longDescription: '',
    status: 'Draft',
    regularPrice: '',
    discountedPrice: '',
    sku: '',
    stockQuantity: '',
    categories: [] as string[], // Changed from single category to multiple
    delivery: '',
    returns: '',
    tags: [] as string[],
    mainImage: null as File | null,
    galleryImages: [] as File[],
    relatedProducts: [] as string[]
  });

  const [tagInput, setTagInput] = useState('');
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [descriptionImagePreview, setDescriptionImagePreview] = useState<string | null>(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        setCategoriesLoading(true);
        const response = await getCategories();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategoriesData();
  }, []);

  // Handle adding/removing categories
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

  // Available products for selection
  const availableProducts = [
    {
      id: '1',
      name: 'Sunshine Orange',
      image: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/True_fruits_-_Smoothie_yellow.png',
      category: 'Smoothies'
    },
    {
      id: '2',
      name: 'Green Vitality',
      image: 'https://pepelasalonline.com/wp-content/uploads/2023/02/33721-TRUE-FRUITS-SMOOTHIE-LIGHT-GREEN-25CL.png',
      category: 'Smoothies'
    },
    {
      id: '3',
      name: 'Berry Bliss',
      image: 'https://res.cloudinary.com/ds1wiqrdb/image/upload/v1761644760/ChatGPT_Image_Oct_28_2025_03_14_30_PM_1_hgd95d.png',
      category: 'Smoothies'
    },
  ];

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

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, mainImage: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setMainImagePreview(e.target?.result as string);
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

  const handleAddRelatedProduct = (productId: string) => {
      setFormData(prev => ({
        ...prev,
        relatedProducts: [...prev.relatedProducts, productId]
      }));
    }

  const handleRemoveRelatedProduct = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      relatedProducts: prev.relatedProducts.filter(id => id !== productId)
    }));
  };

  const handleDescriptionImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setDescriptionImagePreview(imageUrl);
        // Insert image markdown into description
        const imageMarkdown = `\n![Product Image](${imageUrl})\n`;
        setFormData(prev => ({
          ...prev,
          longDescription: prev.longDescription + imageMarkdown
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
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

      if (!formData.mainImage) {
        alert('Main product image is required');
        return;
      }

      // Upload main image to Cloudinary
      console.log('Uploading main image to Cloudinary...');
      const mainImageResult = await uploadToCloudinary(formData.mainImage, 'maeorganics/products');

      // Upload gallery images to Cloudinary
      const galleryImageUrls: string[] = [];
      if (formData.galleryImages.length > 0) {
        console.log('Uploading gallery images to Cloudinary...');
        for (const image of formData.galleryImages) {
          const result = await uploadToCloudinary(image, 'maeorganics/products');
          galleryImageUrls.push(result.url);
        }
      }

      // Combine main image with gallery images
      const allImages = [mainImageResult.url, ...galleryImageUrls];

      // Prepare product data for API
      const productData = {
        name: formData.name,
        shortDescription: formData.shortDescription,
        longDescription: formData.longDescription,
        sku: formData.sku,
        categories: formData.categories,
        regularPrice: formData.regularPrice,
        discountedPrice: formData.discountedPrice || undefined,
        stockQuantity: formData.stockQuantity,
        status: formData.status,
        tags: formData.tags,
        delivery: formData.delivery,
        returns: formData.returns,
        relatedProducts: [], // Temporarily empty until real products exist
        images: allImages
      };

      // Create product
      console.log('Creating product...');
      const result = await createProduct(productData);

      if (result.success) {
        console.log('Product created successfully:', result);
        alert('Product created successfully!');
        router.push('/admin/products');
      } else {
        throw new Error(result.message || 'Failed to create product');
      }

    } catch (error) {
      console.error('Error creating product:', error);
      alert(`Error creating product: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      <PageHeader
        title="Add New Product"
        description="Create a new product for your store."
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/admin/products')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
            <Save className="mr-2 h-4 w-4" />
            Save Product
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="longDescription">Long Description</Label>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleDescriptionImageChange}
                      className="hidden"
                      id="description-image"
                    />
                    <Label htmlFor="description-image" className="cursor-pointer">
                      <Button type="button" variant="outline" size="sm">
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Insert Image
                      </Button>
                    </Label>
                  </div>
                </div>
                <Textarea
                  id="longDescription"
                  value={formData.longDescription}
                  onChange={(e) => handleInputChange('longDescription', e.target.value)}
                  placeholder="Detailed product description with features, benefits, and usage instructions. You can insert images using the button above."
                  rows={6}
                />
                <p className="text-sm text-gray-500">
                  Tip: Use the "Insert Image" button to add product images directly into your description
                </p>
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
                <Label>Main Image *</Label>
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
                        Choose Main Image
                      </div>
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Recommended: 800x800px, max 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Gallery Images */}
              <div className="space-y-2">
                <Label>Gallery Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {galleryPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
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

        {/* Submit Buttons */}
        <motion.div variants={itemVariants} className="flex justify-end gap-4 pt-6">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/products')}>
            Cancel
          </Button>
          <Button type="submit" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
            <Save className="mr-2 h-4 w-4" />
            Create Product
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
