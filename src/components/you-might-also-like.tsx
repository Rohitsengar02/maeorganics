import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight, Heart } from "lucide-react";

const likedItems = [
    {
        name: "Apple Smoothie",
        size: "250ml",
        price: "$79",
        image: "https://storage.googleapis.com/project-spark-345315-pub/project-water-bottle-optim.png"
    },
    {
        name: "Lemon Smoothie",
        size: "250ml",
        price: "$49",
        image: "https://storage.googleapis.com/project-spark-345315-pub/project-water-bottle-optim.png"
    }
]

export function YouMightAlsoLike() {
  return (
    <div className="pt-8">
      <h3 className="text-lg font-semibold mb-4">You might also like:</h3>
      <div className="flex items-center gap-4">
        {likedItems.map((item) => (
            <Card key={item.name} className="p-4 flex-1 rounded-2xl bg-white border-none shadow-lg">
                <CardContent className="p-0 flex flex-col items-center text-center relative">
                    <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-8 w-8 text-gray-400 hover:text-red-500">
                        <Heart className="h-4 w-4" />
                    </Button>
                    <div className="relative w-24 h-32 mb-2">
                        <Image src={item.image} alt={item.name} fill className="object-contain" />
                    </div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm text-foreground/60">{item.size}</p>
                    <p className="font-bold mt-2">{item.price}</p>
                </CardContent>
            </Card>
        ))}
        <Button variant="outline" size="icon" className="rounded-full h-12 w-12 bg-white shadow-lg">
            <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
