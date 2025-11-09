'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import {
  ChevronRight,
  Minus,
  Plus,
  Star,
  Heart,
  ShoppingCart,
  Info,
  Truck,
  MessageSquare,
  Loader2,
  ThumbsUp,
  Flag,
  Send,
  User,
} from 'lucide-react';
import Link from 'next/link';

import { Header } from '@/components/header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/ProductCard';
import { cn } from '@/lib/utils';
import ProductMobileBar from '@/components/ProductMobileBar';
import { useCart } from '@/hooks/use-cart';
import { getProduct, getProducts } from '@/lib/products-api';
import { getProductReviews, createReview } from '@/lib/reviews-api';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedColor, setSelectedColor] = useState<string>('Orange');
  const [api, setApi] = useState<CarouselApi>();
  const [selectedThumb, setSelectedThumb] = useState<number>(0);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Load reviews function - moved before loadProduct
  const loadReviews = async () => {
    if (!params.id) return;

    try {
      setReviewsLoading(true);
      const response = await getProductReviews(params.id as string, { status: 'approved' });
      if (response.success) {
        setReviews(response.data);
        setReviewStats(response.stats);
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
      // Don't show error for reviews, just log it
    } finally {
      setReviewsLoading(false);
    }
  };

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        setError(null);

        const response = await getProduct(params.id as string);
        if (response.success) {
          setProduct(response.data);

          // Load all products for 'You May Also Like' section
          const allProductsResponse = await getProducts({ limit: 100 }); // Fetch a large number of products
          if (allProductsResponse.success) {
            // Filter out the current product
            const filteredProducts = allProductsResponse.data.filter((p: any) => p._id !== params.id);
            setRelatedProducts(filteredProducts);
          }

          // Load reviews
          await loadReviews();
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params.id]);

  // Carousel effect - moved to top
  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      setSelectedThumb(api.selectedScrollSnap());
    };

    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  // Now handle conditional rendering after all hooks
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#fdf8e8]">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading product...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col bg-[#fdf8e8]">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {error || 'Product Not Found'}
            </h1>
            <p className="text-gray-600 mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/shop">
              <Button>Back to Shop</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Create gallery images from product images
  const galleryImages = product.images || [product.image || '/placeholder-product.png'];

  const handleThumbClick = (index: number) => {
    api?.scrollTo(index);
    setSelectedThumb(index);
  };

  // Review form handlers
  const handleReviewFormChange = (field: string, value: string | number) => {
    setReviewForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Please log in to submit a review');
      return;
    }

    if (!reviewForm.title.trim() || !reviewForm.comment.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSubmittingReview(true);

      const reviewData = {
        productId: params.id,
        rating: reviewForm.rating,
        title: reviewForm.title.trim(),
        comment: reviewForm.comment.trim(),
        // User ID will be extracted from the authentication token by the backend
      };

      const response = await createReview(reviewData);

      if (response.success) {
        alert('Review submitted successfully! It will be visible after approval.');
        setReviewForm({ rating: 5, title: '', comment: '' });
        setShowReviewForm(false);
        // Reload reviews to show any that might be auto-approved
        await loadReviews();
      } else {
        throw new Error(response.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(`Error submitting review: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      // Convert API product format to cart format
      const cartProduct = {
        id: product._id,
        name: product.name,
        price: product.currentPrice || product.regularPrice,
        image: {
          id: `img-${product._id}`,
          description: product.name,
          imageUrl: product.images?.[0] || '/placeholder-product.png',
          imageHint: product.name
        },
        description: product.shortDescription || '',
        sku: product.sku,
        rating: 4.5, // Default rating
        ratingCount: 10 // Default count
      };
      addToCart(cartProduct, quantity);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fdf8e8]">
      <Header />
      <main className="flex-grow pb-24 sm:pb-0">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          {/* Breadcrumbs */}
          <div className="mb-6 flex items-center text-sm font-medium text-gray-500">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="mx-2 h-4 w-4" />
            <Link href="/shop" className="hover:text-primary">
              Shop
            </Link>
            <ChevronRight className="mx-2 h-4 w-4" />
            <span className="text-gray-800">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Image Gallery */}
            <div className="space-y-4">
              <Carousel className="w-full" setApi={setApi}>
                <CarouselContent>
                  {galleryImages.map((img: string, index: number) => (
                    <CarouselItem key={`image-${index}`}>
                      <div className="relative aspect-square w-full overflow-hidden rounded-xl border bg-white/60">
                        <Image
                          src={img}
                          alt={`${product.name} - Image ${index + 1}`}
                          fill
                          className="object-contain p-8"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4" />
                <CarouselNext className="absolute right-4" />
              </Carousel>
              <div className="grid grid-cols-4 gap-4">
                {galleryImages.map((img: string, index: number) => (
                    <button
                        key={`thumb-${index}`}
                        onClick={() => handleThumbClick(index)}
                        className={cn(
                            "relative aspect-square w-full overflow-hidden rounded-lg border-2 bg-white/60 transition-all",
                            selectedThumb === index ? 'border-primary' : 'border-transparent'
                        )}
                    >
                        <Image
                            src={img}
                            alt={`${product.name} - Thumbnail ${index + 1}`}
                            fill
                            className="object-contain p-2"
                        />
                    </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <h1 className="font-headline text-4xl font-black text-[#2d2b28]">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      fill={i < 4 ? 'currentColor' : 'none'} // Default to 4 stars for now
                      strokeWidth={1.5}
                      className="h-5 w-5 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">(4.5 reviews)</span>
              </div>

              <p className="font-headline text-4xl font-black text-[#1a1815]">
                ₹{(product.currentPrice || product.regularPrice)?.toFixed(2)}
                {product.discountedPrice && product.discountedPrice < product.regularPrice && (
                  <span className="ml-2 text-lg text-gray-500 line-through">
                    ₹{product.regularPrice?.toFixed(2)}
                  </span>
                )}
              </p>
              {product.discountedPrice && product.discountedPrice < product.regularPrice && (
                <p className="text-sm text-green-600 font-medium">
                  Save ₹{(product.regularPrice - product.discountedPrice)?.toFixed(2)} ({product.discountPercentage}% off)
                </p>
              )}
              <p className="text-base text-gray-600">
                {product.shortDescription || product.longDescription || 'No description available'}
              </p>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Stock:</span>
                <span className={`text-sm font-medium ${
                  product.stockQuantity > 10 ? 'text-green-600' :
                  product.stockQuantity > 0 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                </span>
              </div>

              {/* SKU */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">SKU:</span>
                <span className="text-sm text-gray-600 font-mono">{product.sku}</span>
              </div>

              <Separator />

              {/* Color Options - Hide for now since not in API */}
              {false && (
                <div>
                  <p className="mb-2 text-sm font-semibold">Color: <span className="font-normal text-gray-600">{selectedColor}</span></p>
                  <div className="flex gap-2">
                      {['Orange', 'Green', 'Red'].map(color => (
                          <button key={color} onClick={() => setSelectedColor(color)} className={cn("h-8 w-8 rounded-full border-2 transition-all", selectedColor === color ? 'border-primary' : 'border-gray-300')} style={{backgroundColor: color.toLowerCase()}} />
                      ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= product.stockQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
               
                <div className="hidden sm:flex flex-grow gap-4">
                    <Button size="lg" className="h-12 flex-grow rounded-full" onClick={handleAddToCart}>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add to Cart
                    </Button>
                     <Button variant="outline" size="lg" className="h-12 rounded-full">
                        <Heart className="mr-2 h-5 w-5" />
                        Add to Wishlist
                    </Button>
                </div>
              </div>

              <Separator />

              {/* Social Share */}
              <div className='flex items-center gap-4'>
                    <p className='text-sm font-semibold'>Share:</p>
                    <div className='flex gap-2'>
                        <Button variant="outline" size="icon" className='rounded-full'>
                          <span className="text-xs font-bold">f</span>
                        </Button>
                        <Button variant="outline" size="icon" className='rounded-full'>
                          <span className="text-xs font-bold">t</span>
                        </Button>
                        <Button variant="outline" size="icon" className='rounded-full'>
                          <span className="text-xs font-bold">i</span>
                        </Button>
                    </div>
              </div>

            </div>
          </div>

           {/* Details Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
                <TabsTrigger value="description"><Info className="mr-2 h-4 w-4"/>Description</TabsTrigger>
                <TabsTrigger value="delivery"><Truck className="mr-2 h-4 w-4"/>Delivery & Returns</TabsTrigger>
                <TabsTrigger value="reviews"><MessageSquare className="mr-2 h-4 w-4"/>Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-6 rounded-lg border bg-white/60 p-6 text-sm text-gray-600 leading-relaxed">
                {product.longDescription || product.shortDescription || 'No detailed description available for this product.'}
              </TabsContent>
              <TabsContent value="delivery" className="mt-6 rounded-lg border bg-white/60 p-6 text-sm text-gray-600 leading-relaxed">
                {product.delivery || 'We offer free standard shipping on all orders over ₹500. Express shipping is available for an additional fee. Returns are accepted within 30 days of purchase, provided the item is in its original condition and packaging.'}
              </TabsContent>
              <TabsContent value="reviews" className="mt-6 rounded-lg border bg-white/60 p-6">
                {/* Review Statistics */}
                {reviewStats && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-3xl font-bold text-primary">{reviewStats.averageRating}</div>
                      <div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              fill={star <= Math.round(reviewStats.averageRating) ? 'currentColor' : 'none'}
                              strokeWidth={1.5}
                              className="h-4 w-4 text-yellow-400"
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">Based on {reviewStats.totalReviews} reviews</p>
                      </div>
                    </div>

                    {/* Rating Distribution */}
                    <div className="space-y-2">
                      {reviewStats.distribution.map((item: any) => (
                        <div key={item.rating} className="flex items-center gap-2 text-sm">
                          <span className="w-3">{item.rating}</span>
                          <Star fill="currentColor" strokeWidth={1.5} className="h-3 w-3 text-yellow-400" />
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <span className="w-8 text-right">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Write Review Button */}
                <div className="mb-6">
                  {user ? (
                    <Button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                    </Button>
                  ) : (
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-blue-800 mb-2">Want to share your experience?</p>
                      <Button variant="outline" className="bg-blue-600 text-white hover:bg-blue-700">
                        Login to Write a Review
                      </Button>
                    </div>
                  )}
                </div>

                {/* Review Form */}
                {showReviewForm && user && (
                  <div className="mb-8 p-6 border rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      {/* Rating */}
                      <div>
                        <Label className="text-sm font-medium">Rating *</Label>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleReviewFormChange('rating', star)}
                              className="focus:outline-none"
                            >
                              <Star
                                fill={star <= reviewForm.rating ? 'currentColor' : 'none'}
                                strokeWidth={1.5}
                                className="h-6 w-6 text-yellow-400 hover:scale-110 transition-transform"
                              />
                            </button>
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            {reviewForm.rating} out of 5 stars
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <div>
                        <Label htmlFor="review-title">Review Title *</Label>
                        <Input
                          id="review-title"
                          value={reviewForm.title}
                          onChange={(e) => handleReviewFormChange('title', e.target.value)}
                          placeholder="Summarize your experience"
                          maxLength={100}
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {reviewForm.title.length}/100 characters
                        </p>
                      </div>

                      {/* Comment */}
                      <div>
                        <Label htmlFor="review-comment">Your Review *</Label>
                        <Textarea
                          id="review-comment"
                          value={reviewForm.comment}
                          onChange={(e) => handleReviewFormChange('comment', e.target.value)}
                          placeholder="Tell others about your experience with this product"
                          rows={4}
                          maxLength={1000}
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {reviewForm.comment.length}/1000 characters
                        </p>
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowReviewForm(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={submittingReview}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {submittingReview ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Submit Review
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviewsLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <p className="text-gray-600">Loading reviews...</p>
                    </div>
                  ) : reviews.length > 0 ? (
                    reviews.map((review: any) => (
                      <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-start gap-4">
                          {/* User Avatar */}
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {review.user?.avatar ? (
                              <Image
                                src={review.user.avatar}
                                alt={review.user.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            ) : (
                              <User className="h-5 w-5 text-gray-500" />
                            )}
                          </div>

                          {/* Review Content */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{review.user?.name || 'Anonymous'}</h4>
                              {review.isVerifiedPurchase && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  Verified Purchase
                                </span>
                              )}
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    fill={star <= review.rating ? 'currentColor' : 'none'}
                                    strokeWidth={1.5}
                                    className="h-4 w-4 text-yellow-400"
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>

                            {/* Review Title */}
                            <h5 className="font-medium mb-2">{review.title}</h5>

                            {/* Review Comment */}
                            <p className="text-gray-700 mb-3 leading-relaxed">{review.comment}</p>

                            {/* Review Actions */}
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <button className="flex items-center gap-1 hover:text-green-600 transition-colors">
                                <ThumbsUp className="h-4 w-4" />
                                <span>Helpful ({review.helpfulCount || 0})</span>
                              </button>
                              <button className="flex items-center gap-1 hover:text-red-600 transition-colors">
                                <Flag className="h-4 w-4" />
                                <span>Report</span>
                              </button>
                            </div>

                            {/* Admin Response */}
                            {review.adminResponse && (
                              <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                                <p className="text-sm font-medium text-blue-800 mb-1">
                                  Response from {review.adminResponse.respondedBy?.name || 'Admin'}
                                </p>
                                <p className="text-sm text-blue-700">{review.adminResponse.comment}</p>
                                <p className="text-xs text-blue-600 mt-1">
                                  {new Date(review.adminResponse.respondedAt).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                      <p className="text-gray-600">Be the first to share your thoughts about this product!</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* You Might Also Like */}
            <div className="mt-16">
                <h2 className="text-3xl font-headline font-black text-[#2d2b28] mb-8 text-center">You Might Also Like</h2>
                <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-4">
                {relatedProducts.length > 0 ? (
                  relatedProducts.map((p) => {
                    // Convert API product to ProductCard format
                    const cardProduct = {
                      id: p._id,
                      name: p.name,
                      price: p.currentPrice || p.regularPrice,
                      image: {
                        id: `img-${p._id}`,
                        description: p.name,
                        imageUrl: p.images?.[0] || '/placeholder-product.png',
                        imageHint: p.name
                      },
                      description: p.shortDescription || '',
                      rating: p.averageRating || 4, // Use average rating from API
                      ratingCount: p.reviewCount || 10, // Use review count from API
                      category: p.categories?.[0]?.name || p.categories?.[0] || 'General'
                    };
                    return <ProductCard key={p._id} product={cardProduct} />;
                  })
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    No related products available
                  </div>
                )}
                </div>
            </div>
        </div>
      </main>

      <ProductMobileBar product={{
        id: product._id,
        name: product.name,
        price: product.currentPrice || product.regularPrice,
        image: {
          id: `img-${product._id}`,
          description: product.name,
          imageUrl: product.images?.[0] || '/placeholder-product.png',
          imageHint: product.name
        },
        description: product.shortDescription || product.longDescription || 'No description available',
        rating: 4.5, // Default rating
        ratingCount: 10 // Default count
      }} />

      <Footer />
    </div>
  );
}

    