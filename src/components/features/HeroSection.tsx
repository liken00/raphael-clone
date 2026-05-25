'use client';

import { Sparkles, Rocket, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative flex flex-col items-center justify-center text-center py-12 sm:py-20">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-purple-500/10 blur-[80px] pointer-events-none" />

      <div className="relative w-full max-w-6xl mx-auto px-4">
        {/* Hero image area - 1:1 square */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-2xl overflow-hidden border-2 border-primary/30 bg-card/50 animate-glow-pulse">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-cyan-500/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl sm:text-7xl mb-2">🚀</div>
                <div className="text-lg font-medium text-foreground/60">AI 生成</div>
              </div>
            </div>
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/50 rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/50 rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/50 rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/50 rounded-br-xl" />
          </div>
        </div>

        {/* Main headline - 1.5x enlarged */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="hidden sm:flex w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary to-cyan-500 items-center justify-center text-primary-foreground font-bold text-2xl shadow-lg shadow-primary/30">
            R
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-cyber bg-clip-text text-transparent">
              Hermes
            </span>
            <span className="text-foreground/80">+</span>
            <span className="bg-gradient-tech-warm bg-clip-text text-transparent">
              OpenClaw
            </span>
          </h1>
        </div>

        {/* Subheadline - larger text 1.5x */}
        <p className="mt-4 sm:mt-6 text-2xl sm:text-3xl md:text-4xl font-bold text-foreground/90 max-w-3xl mx-auto">
          <span className="bg-gradient-tech bg-clip-text text-transparent">
            一键部署
          </span>
          <span className="text-foreground/70"> · 智能创作 · 无缝协作</span>
        </p>

        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          <p className="text-lg sm:text-xl text-foreground/70">
            全球首个无限免费 AI 图像生成器
          </p>
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-3 mt-8 sm:mt-10">
          <span className="inline-flex items-center px-4 py-1.5 text-sm rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary border border-primary/30">
            <Rocket className="w-4 h-4 mr-1.5" />
            一键部署
          </span>
          <span className="inline-flex items-center px-4 py-1.5 text-sm rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30">
            100% 免费
          </span>
          <span className="inline-flex items-center px-4 py-1.5 text-sm rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30">
            <Zap className="w-4 h-4 mr-1.5" />
            无需登录
          </span>
          <span className="inline-flex items-center px-4 py-1.5 text-sm rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30">
            无限生成
          </span>
        </div>
      </div>
    </div>
  );
}