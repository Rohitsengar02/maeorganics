import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { FeaturedSmoothies } from "@/components/featured-smoothies";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedSmoothies />
      </main>
      <Footer />
    </div>
  );
}
