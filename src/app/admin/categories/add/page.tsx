'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '../../components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, Save, ArrowLeft } from 'lucide-react';
import { uploadToCloudinary, createCategory } from '@/lib/categories-api';
import { motion } from 'framer-motion';

export default function AddCategoryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Draft',
    displayOrder: '',
    parentCategory: '',
    image: null as File | null,
    seoTitle: '',
    seoDescription: '',
    slug: ''
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setFormData(prev => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('Image preview generated');
        setImagePreview(e.target?.result as string);
      };
      reader.onerror = () => {
        console.error('Error reading file');
        alert('Error reading the selected file.');
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    handleInputChange('name', value);
    const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    handleInputChange('slug', slug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        alert('Category name is required');
        return;
      }

      if (!formData.image) {
        alert('Category image is required');
        return;
      }

      // Upload image to Cloudinary first
      console.log('Uploading image to Cloudinary...');
      const cloudinaryResult = await uploadToCloudinary(formData.image, 'maeorganics/categories');

      // Prepare category data
      const categoryData = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        displayOrder: parseInt(formData.displayOrder) || 0,
        parentCategory: formData.parentCategory || null,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        image: cloudinaryResult.url
      };

      // Create category
      console.log('Creating category...');
      const result = await createCategory(categoryData);

      console.log('Category created successfully:', result);
      alert('Category created successfully!');
      router.push('/admin/categories');

    } catch (error) {
      console.error('Error creating category:', error);
      alert(`Error creating category: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
        title="Add New Category"
        description="Create a new product category for your store."
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/admin/categories')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
            <Save className="mr-2 h-4 w-4" />
            Save Category
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
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Enter category name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="category-url-slug"
                  />
                  <p className="text-sm text-gray-500">
                    Auto-generated from category name
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe what products belong in this category"
                  rows={4}
                />
              </div>

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
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => handleInputChange('displayOrder', e.target.value)}
                    placeholder="1"
                    min="1"
                  />
                  <p className="text-sm text-gray-500">
                    Lower numbers appear first
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentCategory">Parent Category</Label>
                  <Select value={formData.parentCategory} onValueChange={(value) => handleInputChange('parentCategory', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beverages">Beverages</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="supplements">Supplements</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Image */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🖼️ Category Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Category Image</Label>
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Category preview"
                        className="w-full h-full object-cover"
                        style={{ width: '100%', height: '100%' }}
                      />
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
                      onChange={handleImageChange}
                      className="hidden"
                      id="category-image"
                    />
                    <Label htmlFor="category-image" className="cursor-pointer">
                      <div className="flex items-center justify-center w-full px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium transition-colors">
                        <Upload className="mr-2 h-4 w-4" />
                        Choose Category Image
                      </div>
                    </Label>
                    {formData.image && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          try {
                            console.log('Testing Cloudinary upload...');
                            const result = await uploadToCloudinary(formData.image!, 'maeorganics/categories');
                            console.log('Test upload successful:', result);
                            alert('Cloudinary upload test successful!');
                          } catch (error) {
                            console.error('Test upload failed:', error);
                            alert(`Upload test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                          }
                        }}
                        className="mt-2"
                      >
                        Test Upload
                      </Button>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Recommended: 400x400px, max 2MB
                    </p>
                  </div>
                </div>
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
              <p className="text-sm text-gray-600">Optimize this category for search engines</p>
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
          <Button type="button" variant="outline" onClick={() => router.push('/admin/categories')}>
            Cancel
          </Button>
          <Button type="submit" className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
            <Save className="mr-2 h-4 w-4" />
            Create Category
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
