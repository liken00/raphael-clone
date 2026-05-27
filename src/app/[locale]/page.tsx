'use client';

import ImageGenerator from "@/components/features/ImageGenerator";
import HeroSection from "@/components/features/HeroSection";
import FeaturesSection from "@/components/features/FeaturesSection";
import { useLocale } from "next-intl";

export default function HomePage() {
  const locale = useLocale();

  return (
    <div className="min-h-screen">
      <main className="max-w-5xl mx-auto px-4 py-6">
        <HeroSection />
        <ImageGenerator />
        <FeaturesSection />
      </main>
    </div>
  );
}