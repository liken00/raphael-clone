'use client';

import { Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative flex flex-col items-center justify-center text-center py-12 sm:py-20">
      <div className="w-full max-w-5xl mx-auto px-4">
        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
          让<span className="text-amber-400">AI</span>助力你的无穷创意
        </h1>

        {/* Tagline with sparkles */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <p className="text-lg sm:text-xl text-zinc-400">
            图像生成 · 视频生成 · 声音克隆
          </p>
          <Sparkles className="w-5 h-5 text-amber-400" />
        </div>
      </div>
    </div>
  );
}