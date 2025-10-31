'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Lock } from 'lucide-react';
import Image from 'next/image';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/hooks/use-cart';
import { createOrder } from '@/lib/orders-api';
import { useRouter } from 'next/navigation';

interface PaymentStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function PaymentStep({ onNext, onBack }: PaymentStepProps) {
  const [method, setMethod] = useState<'upi' | 'phonepe' | 'paytm' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('');
  const { subtotal, cartItems, clearCart } = useCart();
  const router = useRouter();

  type Coupon = {
    _id: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minPurchase?: number;
    expiryDate?: string;
    isActive: boolean;
  } | null;

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('appliedCoupon');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setAppliedCoupon(parsed);
        } catch {}
      }
    }
  }, []);

  const shipping = subtotal > 50 ? 0 : 10;
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = (subtotal * appliedCoupon.discountValue) / 100;
    } else {
      discount = Math.min(appliedCoupon.discountValue, subtotal);
    }
  }
  const total = Math.max(0, subtotal + shipping - discount);

  const fmt = (v: number) => `₹${v.toFixed(2)}`;

  const canProceed =
    method === 'cod' || method === 'phonepe' || method === 'paytm' || (method === 'upi' && upiId.trim().length > 0);

  const placeOrder = async () => {
    // Read selected address
    let address: any = null;
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('selectedAddress');
      if (raw) {
        try { address = JSON.parse(raw); } catch {}
      }
    }
    if (!address) {
      // fallback: prevent ordering without address
      alert('Please select a delivery address.');
      return;
    }

    // Build items
    const items = cartItems.map((it) => ({
      productId: it.id,
      name: it.name,
      imageUrl: it.image.imageUrl,
      price: it.price,
      quantity: it.quantity,
    }));

    // Build coupon
    let coupon: any = null;
    if (appliedCoupon) {
      coupon = {
        code: appliedCoupon.code,
        discountType: appliedCoupon.discountType,
        discountValue: appliedCoupon.discountValue,
      };
    }

    // Build payment info
    const payment = {
      method,
      status: method === 'cod' ? 'cod' : 'pending',
      provider: method === 'phonepe' ? 'phonepe' : method === 'paytm' ? 'paytm' : 'upi',
      upiId: method === 'upi' ? upiId : undefined,
    } as any;

    const payload = {
      items,
      address: {
        fullName: address.fullName,
        phone: address.phone,
        pincode: address.pincode,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || '',
        landmark: address.landmark || '',
        city: address.city,
        state: address.state,
        country: address.country,
        addressType: address.addressType,
      },
      payment,
      amounts: { subtotal, discount, shipping, total, currency: 'INR' },
      coupon,
    };

    const res = await createOrder(payload);
    if (res.success) {
      // Optionally clear cart or coupon here
      if (typeof window !== 'undefined') {
        localStorage.removeItem('appliedCoupon');
      }
      // Empty the cart locally so cart drawer is refreshed for a new order
      clearCart();
      router.push(`/checkout/thank-you?orderId=${res.data._id}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="rounded-2xl border bg-white/60 p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-[#2d2b28] mb-6">Select Payment Method</h2>

        <RadioGroup
          value={method}
          onValueChange={(v) => setMethod(v as typeof method)}
          className="space-y-4"
        >
          <div className="flex items-start gap-3 rounded-lg border p-4">
            <RadioGroupItem id="pay-upi" value="upi" />
            <div className="flex-1">
              <Label htmlFor="pay-upi" className="font-medium cursor-pointer">UPI</Label>
              <p className="text-sm text-gray-600 mt-1">Pay directly with your UPI ID.</p>
              {method === 'upi' && (
                <div className="mt-4 grid gap-2">
                  <Label htmlFor="upiId">Your UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="name@bank"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">We will request a UPI collect to this ID.</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border p-4">
            <RadioGroupItem id="pay-phonepe" value="phonepe" />
            <div className="flex-1">
              <Label htmlFor="pay-phonepe" className="font-medium cursor-pointer">PhonePe</Label>
              <p className="text-sm text-gray-600 mt-1">Complete payment using your PhonePe app.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border p-4">
            <RadioGroupItem id="pay-paytm" value="paytm" />
            <div className="flex-1">
              <Label htmlFor="pay-paytm" className="font-medium cursor-pointer">Paytm</Label>
              <p className="text-sm text-gray-600 mt-1">Complete payment using your Paytm app.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border p-4">
            <RadioGroupItem id="pay-cod" value="cod" />
            <div className="flex-1">
              <Label htmlFor="pay-cod" className="font-medium cursor-pointer">Cash on Delivery</Label>
              <p className="text-sm text-gray-600 mt-1">Pay in cash when your order arrives.</p>
            </div>
          </div>
        </RadioGroup>
      </div>

      <div className="rounded-2xl border bg-white/60 p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-[#2d2b28] mb-6">Payment Summary</h2>
        <div className="space-y-5 text-sm text-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Items ({cartItems.length})</span>
            <span className="font-medium">{fmt(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">
                Discount {appliedCoupon?.discountType === 'percentage' ? `(${appliedCoupon?.discountValue}%)` : ''}
              </span>
              <span className="font-medium text-green-700">- {fmt(discount)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Delivery</span>
            <span className="font-medium">{shipping === 0 ? 'Free' : fmt(shipping)}</span>
          </div>
          <div className="border-t pt-4 flex items-center justify-between text-base">
            <span className="font-semibold text-[#2d2b28]">Total</span>
            <span className="font-bold text-[#2d2b28]">{fmt(total)}</span>
          </div>

          {method === 'upi' && (
            <p className="text-xs text-gray-500">A UPI collect request will be sent to your UPI ID after placing the order.</p>
          )}
          {method === 'phonepe' && (
            <p className="text-xs text-gray-500">Complete payment in the PhonePe app when prompted.</p>
          )}
          {method === 'paytm' && (
            <p className="text-xs text-gray-500">Complete payment in the Paytm app when prompted.</p>
          )}
          {method === 'cod' && (
            <p className="text-xs text-gray-500">Cash payment to be collected upon delivery.</p>
          )}
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex justify-between items-center mt-8">
            <Button variant="outline" onClick={onBack}>Back to Address</Button>
            <Button onClick={placeOrder} size="lg" disabled={!canProceed}>
              {method === 'cod' ? 'Place Order' : 'Proceed'}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-4 flex items-center justify-center gap-2">
            <Lock className="h-3 w-3" /> Secure SSL/TLS encryption
          </p>
        </div>
      </div>
    </div>
  );
}
