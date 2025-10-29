'use client';

import { CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import Footer from '@/components/Footer';

export default function ThankYouPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-[#fdf8e8]">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto max-w-2xl px-4 py-24">
          <div className="rounded-2xl border bg-white/60 p-12 shadow-lg text-center flex flex-col items-center">
            <CheckCircle2 className="h-20 w-20 text-green-500 mb-6" />
            <h1 className="text-4xl font-headline font-black text-[#2d2b28]">Thank You!</h1>
            <p className="text-lg text-[#5a5854] mt-4">Your order has been placed successfully.</p>
            <p className="text-sm text-[#5a5854] mt-2">
              We've sent a confirmation email to your address with all the details. You can check your order status in your account.
            </p>
            <div className="flex gap-4 mt-8">
              <Button onClick={() => router.push('/shop')}>Continue Shopping</Button>
              <Button variant="outline" onClick={() => router.push('/account/orders')}>View My Orders</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
