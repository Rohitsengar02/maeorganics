import { featuredSmoothies } from "@/lib/data";
import { SmoothieCard } from "./smoothie-card";
import { Button } from "./ui/button";

export function FeaturedSmoothies() {
  return (
    <section id="menu" className="w-full py-16 md:py-24 bg-secondary/30 dark:bg-secondary/10">
      <div className="container max-w-7xl">
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">
            Our Fan Favorites
          </h2>
          <p className="max-w-2xl text-foreground/70 text-lg">
            Discover the blends our customers can't get enough of. Each one is a testament to our passion for flavor and freshness.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredSmoothies.map((smoothie) => (
            <SmoothieCard key={smoothie.id} smoothie={smoothie} />
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <Button size="lg" variant="outline">View Full Menu</Button>
        </div>
      </div>
    </section>
  );
}
