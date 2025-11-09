'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCombo } from '@/lib/combos-api';
import { addItemToCart } from '@/lib/cart-api';
import { useCart } from '@/hooks/use-cart';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';
import Footer from '@/components/Footer';
import { 
  ShoppingCart, 
  Package, 
  Check, 
  Star, 
  Tag,
  ArrowLeft,
  Plus,
  Minus,
  Sparkles
} from 'lucide-react';

export default function ComboDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { openCart, refreshCart } = useCart();
  const [combo, setCombo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchCombo();
    }
  }, [params.id]);

  const fetchCombo = async () => {
    try {
      setLoading(true);
      const response = await getCombo(params.id as string);
      setCombo(response.data);
    } catch (error) {
      console.error('Failed to fetch combo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      // Add combo to cart with isCombo flag
      await addItemToCart(combo._id, quantity, true);
      
      // Refresh cart data to show the new item
      await refreshCart();
      
      // Open cart sidebar to show the added combo
      openCart();
      
      alert('Combo added to cart successfully!');
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      alert(error.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < (combo?.stock || 999)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading combo details...</p>
        </div>
      </div>
    );
  }

  if (!combo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Combo not found</h2>
          <Link href="/combos" className="text-green-600 hover:underline">
            ← Back to Combos
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [combo.bannerImage, ...(combo.images || [])].filter(Boolean);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-green-600">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/combos" className="text-gray-600 hover:text-green-600">Combos</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{combo.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={allImages[selectedImage]}
                alt={combo.title}
                fill
                className="object-cover"
              />
              {combo.isFeatured && (
                <div className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                  <Star className="w-4 h-4 fill-current" />
                  Featured
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden ${
                      selectedImage === index
                        ? 'ring-4 ring-green-600'
                        : 'ring-2 ring-gray-200 hover:ring-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${combo.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Title and Category */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                  <Tag className="w-3 h-3" />
                  {combo.category}
                </span>
                {combo.isFeatured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                    <Sparkles className="w-3 h-3" />
                    Featured Deal
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{combo.title}</h1>
              <p className="text-lg text-gray-600">{combo.description}</p>
            </div>

            {/* Pricing Card */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border-2 border-green-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Regular Price:</span>
                  <span className="text-xl font-semibold text-gray-500 line-through">
                    ₹{combo.originalPrice?.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Combo Discount:</span>
                  <span className="text-xl font-semibold text-red-600">
                    - ₹{combo.savings?.toFixed(2)}
                  </span>
                </div>
                <div className="border-t-2 border-green-300 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-900">Combo Price:</span>
                    <span className="text-4xl font-bold text-green-600">
                      ₹{combo.finalPrice?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-green-600 text-white text-center py-2 rounded-lg">
                <span className="font-bold">
                  🎉 Save ₹{combo.savings?.toFixed(2)} ({combo.discountType === 'percentage' ? `${combo.discountValue}%` : `₹${combo.discountValue}`} OFF)
                </span>
              </div>
            </div>

            {/* Products Included */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-6 h-6 text-green-600" />
                Products Included ({combo.products?.length || 0})
              </h3>
              <div className="space-y-3">
                {combo.products?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {item.product?.name || 'Product'}
                      </p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    {item.product?.regularPrice && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500 line-through">
                          ₹{item.product.regularPrice}
                        </p>
                        {item.product.discountedPrice && (
                          <p className="text-sm font-semibold text-green-600">
                            ₹{item.product.discountedPrice}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= (combo.stock || 999)}
                    className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Stock Available:</span>
                <span className="font-semibold">{combo.stock} units</span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart || combo.stock === 0}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              >
                {addingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6" />
                    Add to Cart - ₹{(combo.finalPrice * quantity).toFixed(2)}
                  </>
                )}
              </button>
            </div>

            {/* Back to Combos */}
            <Link
              href="/combos"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to All Combos
            </Link>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
