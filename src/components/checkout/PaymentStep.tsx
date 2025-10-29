'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard, Lock } from 'lucide-react';
import Image from 'next/image';

interface PaymentStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function PaymentStep({ onNext, onBack }: PaymentStepProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="rounded-2xl border bg-white/60 p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-[#2d2b28] mb-6">Payment Information</h2>
            <form className="space-y-6">
                <div>
                    <Label htmlFor="card-number">Card Number</Label>
                    <div className="relative">
                        <Input id="card-number" placeholder="0000 0000 0000 0000" />
                        <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                </div>
                <div>
                    <Label htmlFor="card-name">Name on Card</Label>
                    <Input id="card-name" placeholder="John Doe" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="expiry-date">Expiry Date</Label>
                        <Input id="expiry-date" placeholder="MM/YY" />
                    </div>
                    <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                    </div>
                </div>
                <div className="flex items-center space-x-2 pt-4">
                  <Checkbox id="save-card" />
                  <Label htmlFor="save-card" className="font-normal">
                    Save this card for future payments
                  </Label>
                </div>
            </form>
        </div>

        <div className="rounded-2xl border bg-white/60 p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-[#2d2b28] mb-6">Billing Address</h2>
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Checkbox id="same-address" defaultChecked />
                    <Label htmlFor="same-address" className="font-normal">
                        Same as shipping address
                    </Label>
                </div>
                <div className="text-sm p-4 bg-gray-100/50 rounded-lg">
                    <p className="font-bold">John Doe</p>
                    <p>123 Smoothie Street</p>
                    <p>Flavor Town, California 90210</p>
                    <p>United States</p>
                </div>
            </div>
            <div className="mt-8 pt-8 border-t">
                 <div className="flex justify-between items-center mt-8">
                    <Button variant="outline" onClick={onBack}>Back to Address</Button>
                    <Button onClick={onNext} size="lg">Pay Now</Button>
                </div>
                <p className="text-xs text-gray-500 mt-4 flex items-center justify-center gap-2">
                    <Lock className="h-3 w-3" /> Secure SSL/TLS encryption
                </p>
            </div>
        </div>
    </div>
  );
}
