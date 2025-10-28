'use client';
import Image from "next/image";
import { Button } from "./ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight, Minus, Plus, Star } from "lucide-react";
import { YouMightAlsoLike } from "./you-might-also-like";
import React from "react";

const ingredients = [
  { name: 'Banana', icon: '🍌' },
  { name: 'Pineapple Juice', icon: '🍍' },
  { name: 'Orange', icon: '🍊' },
  { name: 'Almond Milk', icon: '🥛' },
  { name: 'Avocado', icon: '🥑' },
  { name: 'Mango', icon: '🥭' },
];

export function HeroSection() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "orange_smoothie_bottle");
  const [quantity, setQuantity] = React.useState(1);

  if (!heroImage) return null;

  return (
    <section className="relative w-full overflow-hidden">
      <div className="container max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start py-12">
          {/* Left Column */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h1 className="font-headline text-7xl font-bold tracking-tighter">
                Orange Smoothie
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[...Array(4)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />)}
                  <Star className="h-5 w-5 text-gray-300" />
                </div>
                <p className="text-4xl font-bold font-headline">$59</p>
              </div>
              <p className="max-w-md text-foreground/70">
                Using oranges as the basis for your breakfast smoothie takes the idea of fresh-squeezed orange juice to a whole new plane. You can create creamy smoothies with banana, pineapple juice, mango, avocado and coconut milk.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-lg bg-white p-2">
                <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-bold w-6 text-center">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={() => setQuantity(q => q + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button size="lg" className="bg-gray-900 text-white hover:bg-gray-800">
                Buy Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <YouMightAlsoLike />
          </div>

          {/* Right Column */}
          <div className="relative flex justify-center items-start lg:h-auto">
            <div className="absolute inset-0 bg-primary -ml-32 -mr-32 -mt-12 -mb-24 rounded-bl-[80px]"></div>
            
            <div className="relative z-10 grid grid-cols-[1fr_auto_1fr] items-start gap-4 pt-10">
              {/* Left Ingredients */}
              <div className="flex flex-col gap-8 items-end justify-start h-full pt-16">
                {ingredients.slice(0, 3).map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.name}</span>
                    <div className="bg-white/50 rounded-full p-2 text-2xl">{item.icon}</div>
                  </div>
                ))}
              </div>

              {/* Center Image */}
              <div className="relative h-[600px] w-[300px]">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                  <Image src="/doodles.svg" alt="doodles" fill className="object-contain" />
                </div>
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  data-ai-hint={heroImage.imageHint}
                  fill
                  className="object-contain z-10"
                  priority
                />
              </div>

              {/* Right Ingredients */}
              <div className="flex flex-col gap-8 items-start justify-start h-full pt-16">
                 {ingredients.slice(3).map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="bg-white/50 rounded-full p-2 text-2xl">{item.icon}</div>
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
