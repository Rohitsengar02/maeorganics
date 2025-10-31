'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageHeader from '../../components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Loader2, Calendar, Tag, BarChart3 } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getCategory } from '@/lib/categories-api';

interface Category {
  _id: string;
  name: string;
  description?: string;
  status: string;
  displayOrder: number;
  parentCategory?: any;
  image: string;
  seoTitle?: string;
  seoDescription?: string;
  slug?: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function ViewCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        setLoading(true);
        const response = await getCategory(categoryId);

        if (response.success) {
          setCategory(response.data);
        } else {
          setError('Failed to load category');
        }
      } catch (err) {
        console.error('Error loading category:', err);
        setError('Failed to load category data');
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      loadCategory();
    }
  }, [categoryId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Draft': return 'secondary';
      case 'Inactive': return 'destructive';
      default: return 'secondary';
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
        <span className="ml-2">Loading category...</span>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️ {error || 'Category not found'}</div>
          <Button onClick={() => router.push('/admin/categories')} variant="outline">
            Back to Categories
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
        title={category.name}
        description="View category details and information."
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/admin/categories')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={() => router.push(`/admin/categories/${category._id}/edit`)} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
            <Edit className="mr-2 h-4 w-4" />
            Edit Category
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
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
                  <div>
                    <label className="text-sm font-medium text-gray-500">Category Name</label>
                    <p className="text-lg font-semibold">{category.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">URL Slug</label>
                    <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{category.slug}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="mt-1">{category.description || 'No description provided'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">
                      <Badge variant={getStatusColor(category.status)}>
                        {category.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Display Order</label>
                    <p className="mt-1 font-semibold">{category.displayOrder}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Parent Category</label>
                    <p className="mt-1">{category.parentCategory?.name || 'None'}</p>
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
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">SEO Title</label>
                  <p className="mt-1">{category.seoTitle || 'Not set'}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {category.seoTitle?.length || 0}/60 characters
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">SEO Description</label>
                  <p className="mt-1">{category.seoDescription || 'Not set'}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {category.seoDescription?.length || 0}/160 characters
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category Image */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🖼️ Category Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Statistics */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Products</span>
                  <span className="font-semibold">{category.productCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <Badge variant={getStatusColor(category.status)}>
                    {category.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Timestamps */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-sm">{new Date(category.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-sm">{new Date(category.updatedAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
