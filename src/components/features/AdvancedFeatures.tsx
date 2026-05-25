'use client';

import { useState } from "react";
import { Zap, Pointer, LayoutGrid } from "lucide-react";

const tabs = [
  {
    id: "speed",
    icon: Zap,
    label: "闪电般快速的生成",
    title: "闪电般快速的生成",
    tag: "速度",
    desc: "Raphael AI 图像生成器采用先进的图像生成引擎，以出色速度创建专业级图像。非常适合快速原型设计和创意工作流程，它能在几秒钟内生成令人惊艳的视觉效果，同时保持卓越质量。",
  },
  {
    id: "control",
    icon: Pointer,
    label: "精确的创意控制",
    title: "精确的创意控制",
    tag: "AI Image Editor 技术",
    desc: "Raphael AI 图像生成器的独家 AI Image Editor 功能为您提供了前所未有的输出控制能力。以专业的精度微调风格、构图和元素，同时在创意项目中保持一致性。",
  },
  {
    id: "style",
    icon: LayoutGrid,
    label: "多功能风格引擎",
    title: "多功能风格引擎",
    tag: "创意自由",
    desc: "Raphael AI 图像生成器支持各种创意方向。无论您需要照片级渲染还是艺术插图，我们的平台都能提供卓越结果。",
  },
];

export default function AdvancedFeatures() {
  const [active, setActive] = useState(0);

  return (
    <section className="my-40 relative">
      <div className="w-full mx-auto max-w-6xl px-4">
        <div className="flex w-full justify-center">
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium border-transparent bg-primary text-primary-foreground">
            高级功能
          </span>
        </div>
        <h2 className="mx-auto mt-4 max-w-4xl text-center text-3xl font-bold md:text-4xl tracking-tight text-foreground">
          Raphael AI 图像生成器的先进功能
        </h2>
        <p className="mx-auto mt-6 max-w-4xl text-center text-foreground/80 text-lg">
          体验 Raphael AI 图像生成器与 AI Image Editor 带来的强大创作能力
        </p>

        {/* Tabs */}
        <div className="mt-16 w-full">
          <div className="flex justify-center mb-12">
            <div className="relative overflow-hidden rounded-3xl">
              <div className="flex p-1.5 bg-foreground/5 backdrop-blur-md rounded-3xl border border-foreground/10">
                {tabs.map((tab, i) => (
                  <button
                    key={tab.id}
                    onClick={() => setActive(i)}
                    className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full transition-all duration-300 text-sm font-medium ${active === i ? "bg-background text-foreground shadow-md" : "text-foreground/50 hover:text-foreground/80"}`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active tab content */}
          <div className="mt-8">
            <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
              <div className="w-full space-y-6 lg:w-1/2 lg:text-left">
                <div className="inline-flex">
                  <span className="inline-flex items-center px-3 py-1 rounded-full border border-primary/30 text-primary bg-primary/5 text-xs font-medium">
                    {tabs[active].tag}
                  </span>
                </div>
                <h3 className="text-3xl font-bold md:text-4xl tracking-tight text-foreground">
                  {tabs[active].title}
                </h3>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  {tabs[active].desc}
                </p>
                <div className="flex justify-center lg:justify-start">
                  <a
                    href="/zh"
                    className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 transition-colors"
                  >
                    Try Raphael AI
                  </a>
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <div className="relative overflow-hidden rounded-lg border shadow-lg aspect-[3/2] bg-gradient-to-br from-primary/10 to-secondary/50 flex items-center justify-center">
                  <span className="text-muted-foreground/60 text-sm">
                    {tabs[active].title} - 展示图片
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
