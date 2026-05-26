'use client';

import { Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <div data-critical-hero className="relative flex flex-col items-center justify-center text-center py-8 sm:py-16">
      <div className="w-full max-w-5xl mx-auto px-4">
        {/* Subtitle */}
        <p className="hero-lead mt-4 sm:mt-6 text-xl sm:text-2xl font-medium text-foreground/90 max-w-2xl mx-auto">
          在几秒钟内创建令人惊叹的 AI 生成图像
        </p>

        {/* Tagline with sparkles */}
        <div className="flex items-center justify-center gap-2 mt-2 sm:mt-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <p className="text-base sm:text-lg text-foreground/70">
            全球首个无限免费 AI 图像生成器
          </p>
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>

        {/* Badges */}
        <div className="hero-badges flex flex-wrap justify-center gap-2 mt-6 sm:mt-8 min-h-[28px]">
          <div className="hero-badge free inline-flex items-center px-3 py-1 text-xs rounded-full bg-amber-600 text-white border border-amber-600 whitespace-nowrap">
            100% 免费
          </div>
          <div className="hero-badge powered inline-flex items-center px-3 py-1 text-xs rounded-full bg-emerald-600 text-white border border-emerald-600 whitespace-nowrap">
            由 Nano Banana 提供支持
          </div>
          <div className="hero-badge login inline-flex items-center px-3 py-1 text-xs rounded-full bg-blue-600 text-white border border-blue-600 whitespace-nowrap">
            无需登录
          </div>
          <div className="hero-badge unlimited inline-flex items-center px-3 py-1 text-xs rounded-full bg-purple-600 text-white border border-purple-600 whitespace-nowrap">
            无限生成
          </div>
        </div>
      </div>
    </div>
  );
}