'use client';

import { Wand2, Video, Mic } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative flex flex-col items-center justify-center text-center py-16 sm:py-24">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-purple-500/10 via-amber-500/5 to-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-gradient-to-b from-amber-500/5 to-transparent rounded-full blur-[80px] pointer-events-none" />
      
      <div className="w-full max-w-5xl mx-auto px-4 relative z-10">
        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
          让<span className="gradient-text">AI</span>助力你的无穷创意
        </h1>

        {/* Tagline with icons */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <Wand2 className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-zinc-300">图像生成</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <Video className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-zinc-300">视频生成</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <Mic className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-zinc-300">声音克隆</span>
          </div>
        </div>
      </div>
    </div>
  );
}