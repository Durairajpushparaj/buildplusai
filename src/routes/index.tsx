import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { CTASection } from "@/components/landing/CTASection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BuildPlus — Smarter Construction Tracking" },
      { name: "description", content: "Centralize progress tracking, get visual updates, and deliver construction projects on time with BuildPlus." },
      { property: "og:title", content: "BuildPlus — Smarter Construction Tracking" },
      { property: "og:description", content: "Centralize progress tracking, get visual updates, and deliver construction projects on time." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}
