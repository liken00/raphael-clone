'use client';

import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/features/HeroSection";
import ImageGenerator from "@/components/features/ImageGenerator";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#0a0a0f]">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4">
          <HeroSection />
          <ImageGenerator />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}