'use client';

import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/features/HeroSection";
import ImageGenerator from "@/components/features/ImageGenerator";
import GallerySection from "@/components/features/GallerySection";
import StatsSection from "@/components/features/StatsSection";
import FeaturesSection from "@/components/features/FeaturesSection";
import AdvancedFeatures from "@/components/features/AdvancedFeatures";
import TestimonialsSection from "@/components/features/TestimonialsSection";
import FAQSection from "@/components/features/FAQSection";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HeroSection />
          <ImageGenerator />
          <GallerySection />
          <StatsSection />
          <FeaturesSection />
          <AdvancedFeatures />
          <TestimonialsSection />
          <FAQSection />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
