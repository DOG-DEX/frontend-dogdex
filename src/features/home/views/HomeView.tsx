import { ProductStage } from "../components/ProductStage";
import { BentoGrid } from "../components/BentoGrid";
import { HowItWorks } from "../components/HowItWorks";

/**
 * HomeView View Component
 * Assembles the Neo-Brutalist landing experience for Dog Dex.
 * Features ProductStage hero centerpiece, BentoGrid, and HowItWorks.
 */
export function HomeView() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12">
      {/* 1. Centerpiece Product Showcase Stage */}
      <ProductStage />

      {/* 2. Bento Grid Modules (Reunite Community & Breed Dex) */}
      <BentoGrid />

      {/* 3. How It Works 3-Step Process Workflow */}
      <HowItWorks />
    </section>
  );
}
