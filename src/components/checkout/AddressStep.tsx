'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { getAddresses, setDefaultAddress, Address } from '@/lib/address-api';
import { Loader2, MapPin, Edit, Trash2, Plus } from 'lucide-react';

interface AddressStepProps {
  onBack: () => void;
  onNext: (selectedAddress: Address) => void;
}

export default function AddressStep({ onBack, onNext }: AddressStepProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const response = await getAddresses();
        if (response.success) {
          setAddresses(response.data);
          // Select the default address if available
          const defaultAddress = response.data.find(addr => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress._id);
          } else if (response.data.length > 0) {
            setSelectedAddressId(response.data[0]._id);
          }
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load addresses. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAddresses();
  }, [toast]);

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
  };

  const handleSetDefault = async (e: React.MouseEvent, addressId: string) => {
    e.stopPropagation();
    try {
      const response = await setDefaultAddress(addressId);
      if (response.success) {
        setAddresses(prevAddresses => 
          prevAddresses.map(addr => ({
            ...addr,
            isDefault: addr._id === addressId
          }))
        );
        toast({
          title: 'Success',
          description: 'Default address updated',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to set default address',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddressId) {
      toast({
        title: 'Error',
        description: 'Please select an address',
        variant: 'destructive',
      });
      return;
    }
    const selectedAddress = addresses.find(addr => addr._id === selectedAddressId);
    if (selectedAddress) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedAddress', JSON.stringify(selectedAddress));
      }
      onNext(selectedAddress);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-[#2d2b28]">Select Delivery Address</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div 
              key={address._id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedAddressId === address._id ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-300'}`}
              onClick={() => handleAddressSelect(address._id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span className="font-medium capitalize">{address.addressType}</span>
                  {address.isDefault && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    className="text-gray-400 hover:text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/checkout/add-address?edit=${address._id}`);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-1 text-sm">
                <p className="font-medium">{address.fullName}</p>
                <p>{address.addressLine1}</p>
                {address.addressLine2 && <p>{address.addressLine2}</p>}
                {address.landmark && <p>Landmark: {address.landmark}</p>}
                <p>
                  {address.city}, {address.state} - {address.pincode}
                </p>
                <p>{address.country}</p>
                <p className="text-gray-600">Phone: {address.phone}</p>
              </div>
              
              {!address.isDefault && (
                <button
                  type="button"
                  onClick={(e) => handleSetDefault(e, address._id)}
                  className="mt-3 text-sm text-primary hover:underline"
                >
                  Set as default
                </button>
              )}
            </div>
          ))}
          
          <div 
            className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-primary hover:text-primary cursor-pointer transition-colors min-h-[200px]"
            onClick={() => router.push('/checkout/add-address')}
          >
            <Plus className="h-8 w-8" />
            <span className="font-medium">Add New Address</span>
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back to Cart
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={!selectedAddressId}
          >
            Deliver to this Address
          </Button>
        </div>
      </div>
    </div>
  );
}
