import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-primary">
      <div className="bg-background rounded-b-3xl">
        <Header />
        <main>
          <HeroSection />
        </main>
      </div>
    </div>
  );
}
