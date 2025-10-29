'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface CheckoutStepsProps {
  currentStep: number;
  steps: string[];
}

export default function CheckoutSteps({ currentStep, steps }: CheckoutStepsProps) {
  return (
    <div className="flex items-center justify-center w-full max-w-2xl mx-auto">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center w-full">
          <div className="flex flex-col items-center text-center">
            <div
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all',
                currentStep > index
                  ? 'bg-primary border-primary text-primary-foreground'
                  : currentStep === index
                  ? 'bg-primary border-primary text-primary-foreground scale-110'
                  : 'bg-gray-200 border-gray-300 text-gray-500'
              )}
            >
              {currentStep > index ? <Check className="w-6 h-6" /> : <span className="font-bold">{index + 1}</span>}
            </div>
            <p
              className={cn(
                'mt-2 text-sm font-semibold transition-all',
                currentStep >= index ? 'text-primary-foreground' : 'text-gray-500'
              )}
            >
              {step}
            </p>
          </div>

          {index < steps.length - 1 && (
            <div
              className={cn(
                'flex-1 h-1 mx-4 transition-all duration-500',
                currentStep > index ? 'bg-primary' : 'bg-gray-300'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
