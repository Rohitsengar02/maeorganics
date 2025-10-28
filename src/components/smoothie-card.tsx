import type { Smoothie } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";

interface SmoothieCardProps {
  smoothie: Smoothie;
}

export function SmoothieCard({ smoothie }: SmoothieCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden h-full transition-all hover:shadow-xl hover:transform hover:-translate-y-2 duration-300">
      <CardHeader className="p-0">
        <div className="aspect-square relative w-full">
          <Image
            src={smoothie.image.imageUrl}
            alt={smoothie.image.description}
            data-ai-hint={smoothie.image.imageHint}
            fill
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-6">
        <CardTitle className="font-headline text-xl mb-2">{smoothie.name}</CardTitle>
        <CardDescription>{smoothie.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-6 pt-0">
        <p className="text-lg font-bold text-primary">${smoothie.price.toFixed(2)}</p>
        <Button size="sm">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
