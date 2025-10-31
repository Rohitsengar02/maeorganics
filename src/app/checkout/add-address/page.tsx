'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Header } from '@/components/header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { 
  addAddress, 
  updateAddress, 
  getAddresses, 
  Address as AddressType 
} from '@/lib/address-api';

interface AddressFormData {
  fullName: string;
  phone: string;
  pincode: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  country: string;
  addressType: 'home' | 'work' | 'other';
  isDefault: boolean;
}

export default function AddAddressPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [addressId, setAddressId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<AddressFormData>({
    fullName: '',
    phone: '',
    pincode: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    country: 'India',
    addressType: 'home',
    isDefault: false,
  });

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      setIsEditing(true);
      setAddressId(editId);
      loadAddress(editId);
    }
  }, [searchParams]);

  const loadAddress = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await getAddresses();
      if (response.success) {
        const address = response.data.find((addr: AddressType) => addr._id === id);
        if (address) {
          const { _id, ...addressData } = address;
          setFormData({
            fullName: addressData.fullName,
            phone: addressData.phone,
            pincode: addressData.pincode,
            addressLine1: addressData.addressLine1,
            addressLine2: addressData.addressLine2 || '',
            landmark: addressData.landmark || '',
            city: addressData.city,
            state: addressData.state,
            country: addressData.country,
            addressType: addressData.addressType as 'home' | 'work' | 'other',
            isDefault: addressData.isDefault,
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load address',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);

      const addressData = {
        fullName: formData.fullName,
        phone: formData.phone,
        pincode: formData.pincode,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        landmark: formData.landmark,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        addressType: formData.addressType,
        isDefault: formData.isDefault,
      };

      if (isEditing && addressId) {
        await updateAddress(addressId, addressData);
        toast({
          title: 'Success',
          description: 'Address updated successfully',
        });
        router.push('/checkout');
      } else {
        const response = await addAddress(addressData as any);
        if (response?.success) {
          toast({
            title: 'Success',
            description: 'Address added successfully',
          });
          router.push('/checkout');
        } else {
          throw new Error('Failed to save address: Invalid response from server');
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save address',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fdf8e8]">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold text-[#2d2b28]">
              {isEditing ? 'Edit Address' : 'Add New Address'}
            </h1>
          </div>
          
          <div className="rounded-2xl border bg-white/60 p-8 shadow-lg">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input 
                  id="fullName" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input 
                  id="phone" 
                  name="phone"
                  type="tel" 
                  value={formData.phone}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input 
                  id="pincode" 
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input 
                  id="city" 
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input 
                  id="state" 
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input 
                  id="country" 
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="addressLine1">Address Line 1 *</Label>
                <Input 
                  id="addressLine1" 
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                <Input 
                  id="addressLine2" 
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="landmark">Landmark (Optional)</Label>
                <Input 
                  id="landmark" 
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  placeholder="E.g., Near Central Park"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label>Address Type</Label>
                <RadioGroup 
                  defaultValue="home"
                  value={formData.addressType}
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, addressType: value as 'home' | 'work' | 'other' }))
                  }
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="home" id="home" />
                    <Label htmlFor="home" className="cursor-pointer">
                      <div className="font-medium">Home</div>
                      <div className="text-sm text-gray-500">(All day delivery)</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="work" id="work" />
                    <Label htmlFor="work" className="cursor-pointer">
                      <div className="font-medium">Work</div>
                      <div className="text-sm text-gray-500">(Delivery 9AM-6PM)</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="cursor-pointer">
                      <div className="font-medium">Other</div>
                      <div className="text-sm text-gray-500">(Any time delivery)</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="flex items-center space-x-2 md:col-span-2 pt-2">
                <Checkbox 
                  id="isDefault" 
                  checked={formData.isDefault}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, isDefault: !!checked }))
                  }
                />
                <Label htmlFor="isDefault" className="text-sm font-medium leading-none">
                  Set as default address
                </Label>
              </div>
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Update Address' : 'Save Address'}
              </Button>
            </div>
          </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
