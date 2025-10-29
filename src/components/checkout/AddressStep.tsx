'use client';

import { useState } from 'react';
import { Home, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { savedAddresses } from '@/lib/data';
import type { SavedAddress } from '@/lib/types';


interface AddressStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function AddressStep({ onNext, onBack }: AddressStepProps) {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(savedAddresses[0]?.id || null);
  const router = useRouter();

  return (
    <div className="rounded-2xl border bg-white/60 p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-[#2d2b28] mb-6">Shipping Address</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {savedAddresses.map((address) => (
          <Card
            key={address.id}
            className={cn(
              'cursor-pointer transition-all',
              selectedAddress === address.id
                ? 'border-primary ring-2 ring-primary/50'
                : 'hover:border-gray-400'
            )}
            onClick={() => setSelectedAddress(address.id)}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg">{address.name}</p>
                  <p className="text-sm text-gray-600 mt-2">{address.street}</p>
                  <p className="text-sm text-gray-600">{address.city}, {address.state} {address.zip}</p>
                  <p className="text-sm text-gray-600">{address.country}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    {address.isDefault && (
                        <div className="flex items-center gap-1.5 text-xs text-primary font-semibold">
                            <Home className="h-3 w-3" />
                            <span>Default</span>
                        </div>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card 
            className="flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-primary transition-all cursor-pointer min-h-[150px]"
            onClick={() => router.push('/checkout/add-address')}
        >
          <CardContent className="p-6 text-center">
            <Plus className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="font-semibold text-gray-600">Add New Address</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mt-8">
        <Button variant="outline" onClick={onBack}>Back to Cart</Button>
        <Button onClick={onNext} disabled={!selectedAddress}>Proceed to Payment</Button>
      </div>
    </div>
  );
}
