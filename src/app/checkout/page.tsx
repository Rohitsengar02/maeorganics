'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useCart } from '@/hooks/use-cart';
import { Header } from '@/components/header';
import Footer from '@/components/Footer';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import CartSummary from '@/components/checkout/CartSummary';
import AddressStep from '@/components/checkout/AddressStep';
import PaymentStep from '@/components/checkout/PaymentStep';
import { Button } from '@/components/ui/button';

const steps = ['Cart', 'Address', 'Payment'];

export default function CheckoutPage() {
  const { cartCount } = useCart();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
        router.push('/thank-you');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  if (cartCount === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-[#fdf8e8]">
        <Header />
        <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-3xl font-headline font-black text-[#2d2b28]">Your Cart is Empty</h1>
                <p className="text-[#5a5854] mt-2">Add some items to your cart to start the checkout process.</p>
                <Button onClick={() => router.push('/shop')} className="mt-6">Go Shopping</Button>
            </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fdf8e8]">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto max-w-6xl px-4 py-12">
          <h1 className="text-center text-4xl font-headline font-black text-[#2d2b28] mb-4">Checkout</h1>
          <p className="text-center text-lg text-[#5a5854] mb-12">Complete your purchase in just a few steps.</p>
          
          <CheckoutSteps currentStep={currentStep} steps={steps} />

          <div className="mt-12">
            {currentStep === 0 && <CartSummary onNext={handleNext} />}
            {currentStep === 1 && <AddressStep onBack={handleBack} onNext={handleNext} />}
            {currentStep === 2 && <PaymentStep onBack={handleBack} onNext={handleNext} />}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
