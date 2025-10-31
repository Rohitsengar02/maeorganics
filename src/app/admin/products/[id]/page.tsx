'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageHeader from '../../components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Loader2, Calendar, DollarSign, BarChart3 } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getProduct } from '@/lib/products-api';

interface Product {
  _id: string;
  name: string;
  shortDescription?: string;
  longDescription?: string;
  sku: string;
  categories: any[];
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
  createdAt: string;
  updatedAt: string;
  discountPercentage?: number;
  currentPrice?: number;
  stockStatus?: string;
}

export default function ViewProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const response = await getProduct(productId);

        if (response.success) {
          setProduct(response.data);
        } else {
          setError('Failed to load product');
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Failed to load product data');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Draft': return 'secondary';
      case 'Inactive': return 'destructive';
      case 'Out of Stock': return 'destructive';
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
        title={product.name}
        description="View product details and information."
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/admin/products')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={() => router.push(`/admin/products/${product._id}/edit`)} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
            <Edit className="mr-2 h-4 w-4" />
            Edit Product
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
                    <label className="text-sm font-medium text-gray-500">Product Name</label>
                    <p className="text-lg font-semibold">{product.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">SKU</label>
                    <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{product.sku}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Short Description</label>
                  <p className="mt-1">{product.shortDescription || 'No description provided'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Long Description</label>
                  <p className="mt-1">{product.longDescription || 'No detailed description provided'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Categories</label>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {product.categories && product.categories.length > 0 ? (
                        product.categories.map((category, index) => (
                          <Badge key={index} variant="outline">
                            {category.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400">No categories assigned</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tags</label>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {product.tags && product.tags.length > 0 ? (
                        product.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400">No tags assigned</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pricing Information */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Regular Price</label>
                    <p className="text-2xl font-bold text-green-600">₹{product.regularPrice}</p>
                  </div>
                  {product.discountedPrice && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Discounted Price</label>
                      <p className="text-xl font-semibold text-blue-600">₹{product.discountedPrice}</p>
                      {product.discountPercentage && (
                        <p className="text-sm text-green-600 font-medium">
                          Save {product.discountPercentage}%
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Current Price</label>
                  <p className="text-lg font-semibold">₹{product.currentPrice || product.regularPrice}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Delivery & Returns */}
          {(product.delivery || product.returns) && (
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🚚 Delivery & Returns
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {product.delivery && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Delivery Information</label>
                      <p className="mt-1">{product.delivery}</p>
                    </div>
                  )}
                  {product.returns && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Returns & Refunds</label>
                      <p className="mt-1">{product.returns}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

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
                  <p className="mt-1">{product.seoTitle || 'Not set'}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {product.seoTitle?.length || 0}/60 characters
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">SEO Description</label>
                  <p className="mt-1">{product.seoDescription || 'Not set'}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {product.seoDescription?.length || 0}/160 characters
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Images */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🖼️ Product Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {product.images && product.images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {product.images.slice(0, 4).map((image, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={image}
                            alt={`${product.name} - Image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No images available
                    </div>
                  )}
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
                  <span className="text-sm text-gray-500">Stock Quantity</span>
                  <span className={`font-semibold ${
                    product.stockQuantity < 10 ? 'text-red-600' :
                    product.stockQuantity < 50 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {product.stockQuantity}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Stock Status</span>
                  <Badge variant={product.stockStatus === 'In Stock' ? 'default' : 'destructive'}>
                    {product.stockStatus || 'Unknown'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <Badge variant={getStatusColor(product.status) as any}>
                    {product.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Categories</span>
                  <span className="font-semibold">{product.categories?.length || 0}</span>
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
                  <p className="text-sm">{new Date(product.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-sm">{new Date(product.updatedAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}