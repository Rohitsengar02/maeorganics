import Image from "next/image";
import { Button } from "./ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero_smoothie");

  if (!heroImage) return null;

  return (
    <section className="relative w-full overflow-hidden bg-background">
      <div className="container max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[calc(100vh-4rem)] py-12 md:py-20">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 animate-in fade-in slide-in-from-left-12 duration-500">
            <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-primary">
              Taste the Bliss
            </h1>
            <p className="max-w-lg text-lg text-foreground/80">
              Handcrafted smoothies made with the freshest, sun-ripened fruits and wholesome ingredients. Every sip is a burst of pure, natural goodness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base">
                Explore Our Menu
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-base">
                Customize Your Own
              </Button>
            </div>
          </div>
          <div className="relative h-[60vh] lg:h-full w-full max-w-md lg:max-w-none mx-auto animate-in fade-in slide-in-from-right-12 duration-500">
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              data-ai-hint={heroImage.imageHint}
              fill
              className="object-contain rounded-3xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
