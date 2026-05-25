import HeroSection from "@/components/features/HeroSection";
import ImageGenerator from "@/components/features/ImageGenerator";
import GallerySection from "@/components/features/GallerySection";
import QuickI2ISection from "@/components/features/QuickI2ISection";
import FeaturesSection from "@/components/features/FeaturesSection";
import AdvancedFeatures from "@/components/features/AdvancedFeatures";
import StatsSection from "@/components/features/StatsSection";
import TestimonialsSection from "@/components/features/TestimonialsSection";
import FAQSection from "@/components/features/FAQSection";

export default function Home() {
  return (
    <>
      <div className="container mx-auto px-4">
        <HeroSection />
        <ImageGenerator />
        <GallerySection />
        <QuickI2ISection />
      </div>
      <FeaturesSection />
      <AdvancedFeatures />
      <StatsSection />
      <TestimonialsSection />
      <FAQSection />
    </>
  );
}
