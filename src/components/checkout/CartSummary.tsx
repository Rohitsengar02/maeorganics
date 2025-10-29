'use client';

import Image from 'next/image';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '../ui/scroll-area';

interface CartSummaryProps {
  onNext: () => void;
}

export default function CartSummary({ onNext }: CartSummaryProps) {
  const { cartItems, subtotal, cartCount } = useCart();
  const shippingCost = subtotal > 50 ? 0 : 10;
  const total = subtotal + shippingCost;

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
                <label htmlFor="coupon" className="text-sm font-semibold mb-2 block">Coupon Code</label>
                <div className="flex gap-2">
                    <Input id="coupon" placeholder="Enter coupon" />
                    <Button variant="outline">Apply</Button>
                </div>
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
                <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-semibold text-green-600">-$0.00</span>
                </div>
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
