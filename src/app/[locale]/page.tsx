'use client';

import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import ImageGenerator from "@/components/features/ImageGenerator";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#0a0a0f]">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="text-lg">🎨</span> AI 图像生成
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              AI 图像生成器
            </h1>
            <p className="text-xl text-muted-foreground">
              将文字描述转换为精美的图像
            </p>
          </div>
          <ImageGenerator />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}