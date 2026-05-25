'use client';

import { Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative flex flex-col items-center justify-center text-center py-8 sm:py-16">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <div className="hidden sm:flex w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 items-center justify-center text-primary font-bold text-xl">
            R
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              Raphael AI
            </span>
          </h1>
        </div>
        <p className="mt-4 sm:mt-6 text-xl sm:text-2xl font-medium text-foreground/90 max-w-2xl mx-auto">
          在几秒钟内创建令人惊叹的 AI 生成图像
        </p>
        <div className="flex items-center justify-center gap-2 mt-2 sm:mt-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <p className="text-base sm:text-lg text-foreground/70">
            全球首个无限免费 AI 图像生成器
          </p>
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-6 sm:mt-8">
          <span className="inline-flex items-center px-3 py-1 text-xs rounded-full bg-amber-600 text-white border border-amber-600">
            100% 免费
          </span>
          <span className="inline-flex items-center px-3 py-1 text-xs rounded-full bg-emerald-600 text-white border border-emerald-600">
            由 Nano Banana 提供支持
          </span>
          <span className="inline-flex items-center px-3 py-1 text-xs rounded-full bg-blue-600 text-white border border-blue-600">
            无需登录
          </span>
          <span className="inline-flex items-center px-3 py-1 text-xs rounded-full bg-purple-600 text-white border border-purple-600">
            无限生成
          </span>
        </div>
      </div>
    </div>
  );
}
