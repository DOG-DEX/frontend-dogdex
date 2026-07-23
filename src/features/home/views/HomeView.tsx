import { HeroBadge } from "../components/HeroBadge";
import { ProductStage } from "../components/ProductStage";
import { BentoGrid } from "../components/BentoGrid";
import { HowItWorks } from "../components/HowItWorks";

/**
 * HomeView View Component
 * Assembles the Neo-Brutalist landing experience for Dog Dex.
 * Features ProductStage hero centerpiece, HeroBadge, BentoGrid, and HowItWorks.
 */
export function HomeView() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12">
      {/* 1. Hero Live Status Counter Badge */}
      <HeroBadge />

      {/* 2. Centerpiece Product Showcase Stage */}
      <ProductStage />

      {/* 3. Bento Grid Modules (Radar & AI Scanner) */}
      <BentoGrid />

      {/* 4. How It Works 3-Step Process Workflow */}
      <HowItWorks />
    </section>
  );
}
