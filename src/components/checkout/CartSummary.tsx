'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import CouponPopup from './CouponPopup';
import { X } from 'lucide-react';

interface CartSummaryProps {
  onNext: () => void;
}

interface Coupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  expiryDate?: string;
  isActive: boolean;
}

export default function CartSummary({ onNext }: CartSummaryProps) {
  const { cartItems, subtotal, cartCount } = useCart();
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  
  const shippingCost = subtotal > 50 ? 0 : 10;
  
  // Calculate discount
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = (subtotal * appliedCoupon.discountValue) / 100;
    } else {
      discount = Math.min(appliedCoupon.discountValue, subtotal);
    }
  }
  
  const total = subtotal + shippingCost - discount;
  
  const handleApplyCoupon = (coupon: Coupon) => {
    setAppliedCoupon(coupon);
    if (typeof window !== 'undefined') {
      localStorage.setItem('appliedCoupon', JSON.stringify(coupon));
    }
  };
  
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('appliedCoupon');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 rounded-2xl border bg-white/60 p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-[#2d2b28] mb-6">Shopping Cart ({cartCount} items)</h2>
        <ScrollArea className="h-[400px]">
            <div className="space-y-6 pr-4">
            {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-6">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border bg-white">
                    <Image
                    src={item.image.imageUrl}
                    alt={item.name}
                    fill
                    className="object-contain p-2"
                    />
                </div>
                <div className="flex-1">
                    <p className="font-bold text-lg text-[#2d2b28]">{item.name}</p>
                    <p className="text-sm text-gray-500">
                    Qty: {item.quantity}
                    </p>
                </div>
                <p className="font-bold text-lg text-[#2d2b28]">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            ))}
            </div>
        </ScrollArea>
      </div>

      <div className="lg:col-span-1">
        <div className="rounded-2xl border bg-white/60 p-8 shadow-lg space-y-6">
            <h2 className="text-2xl font-bold text-[#2d2b28]">Order Summary</h2>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold">Coupon Code</label>
                {appliedCoupon && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-green-600 font-medium">
                      {appliedCoupon.code} Applied
                    </span>
                    <button 
                      onClick={handleRemoveCoupon}
                      className="text-gray-400 hover:text-gray-600"
                      aria-label="Remove coupon"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              {!appliedCoupon && (
                <CouponPopup 
                  onApplyCoupon={handleApplyCoupon} 
                  appliedCoupon={appliedCoupon} 
                />
              )}
            </div>

            <Separator />

            <div className="space-y-3 text-base">
                <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">{shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'Free'}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Discount {appliedCoupon?.discountType === 'percentage' 
                        ? `(${appliedCoupon?.discountValue}%)` 
                        : ''}
                    </span>
                    <span className="font-semibold text-green-600">-₹{discount.toFixed(2)}</span>
                  </div>
                )}
            </div>

            <Separator />

            <div className="flex justify-between items-center font-bold text-xl">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
            </div>

            <Button size="lg" className="w-full h-12 rounded-full" onClick={onNext}>
                Proceed to Shipping
            </Button>
        </div>
      </div>
    </div>
  );
}
