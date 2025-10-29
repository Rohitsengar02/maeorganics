'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Header } from '@/components/header';
import Footer from '@/components/Footer';

export default function AddAddressPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-[#fdf8e8]">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-headline font-black text-[#2d2b28]">Add New Address</h1>
          </div>

          <div className="rounded-2xl border bg-white/60 p-8 shadow-lg">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" placeholder="John" />
                </div>
                <div>
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" placeholder="Doe" />
                </div>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="123 Smoothie Street" />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Flavor Town" />
              </div>
              <div>
                <Label htmlFor="state">State / Province</Label>
                <Input id="state" placeholder="California" />
              </div>
              <div>
                <Label htmlFor="zip">Zip / Postal Code</Label>
                <Input id="zip" placeholder="90210" />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" placeholder="United States" />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="default-address" />
                  <Label htmlFor="default-address" className="font-normal">
                    Make this my default address
                  </Label>
                </div>
              </div>
              <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" onClick={(e) => { e.preventDefault(); router.push('/checkout'); }}>Save Address</Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
