import Hero from "@/components/Hero";
import { YouMightAlsoLike } from "@/components/you-might-also-like";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-primary">
      <div className="bg-background rounded-b-3xl">
        <main>
          <Hero />
        </main>
      </div>
    </div>
  );
}
