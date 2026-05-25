'use client';

import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

const exampleImages = [
  { id: 1, prompt: "style is lite brite art, luminous and colorful designs" },
  { id: 2, prompt: "high quality sci-fi illustration. a lone astronaut in a spacesuit" },
  { id: 3, prompt: "A hyper-detailed action scene set on a windswept mountain slope" },
  { id: 4, prompt: "Blonde, beautiful woman wearing a cropped satin top" },
];

const styles = [
  { name: "Sketch", img: "/images/quick-i2i/sketch.webp" },
  { name: "Holiday portrait", img: "/images/quick-i2i/holiday-portrait.webp" },
  { name: "Dramatic", img: "/images/quick-i2i/dramatic_v2.webp" },
  { name: "Plushie", img: "/images/quick-i2i/plushie_v2.webp" },
  { name: "Doodle", img: "/images/quick-i2i/doodle_v2.webp" },
  { name: "Inkwork", img: "/images/quick-i2i/inkwork.webp" },
];

const discoveries = [
  { name: "Create a holiday card", img: "/images/quick-i2i/create-a-holiday-card.webp" },
  { name: "What would I look like as a K-Pop star?", img: "/images/quick-i2i/what-would-i-look-like-as-a-k-pop-star.webp" },
  { name: "Me as The Girl with a Pearl", img: "/images/quick-i2i/me-as-the-girl-with-a-pearl.webp" },
  { name: "Create an album cover", img: "/images/quick-i2i/create-an-album-cover.webp" },
  { name: "Style me", img: "/images/quick-i2i/style-me.webp" },
];

export default function GallerySection() {
  return (
    <div id="get-inspired-gallery" className="py-16">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-center text-4xl font-semibold">获取灵感</h2>
        <p className="text-center text-muted-foreground lg:text-lg">
          从 Raphael 的创作中获取灵感
        </p>
      </div>
      <div className="mt-16 columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {exampleImages.map((img) => (
          <button
            key={img.id}
            className="break-inside-avoid mb-4 cursor-pointer transition-transform hover:scale-[1.02] w-full text-left bg-transparent border-0 p-0"
          >
            <div className="relative overflow-hidden rounded-lg group bg-muted/30 aspect-[2/3] flex items-center justify-center">
              <div className="text-muted-foreground/60 text-sm px-4 text-center">
                {img.prompt.substring(0, 40)}...
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-xs leading-relaxed mb-2 line-clamp-3">
                  {img.prompt}
                </p>
                <div className="flex items-center justify-end text-white/80 text-xs">
                  <span>点击使用</span>
                  <ChevronRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Quick I2I Styles */}
      <section className="w-full mx-auto mt-10 sm:mt-16">
        <div className="py-2 sm:py-4">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground tracking-tight">
              尝试一种风格
            </h2>
          </div>
          <div className="relative flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-hide">
            {styles.map((style) => (
              <button
                key={style.name}
                className="group flex w-32 sm:w-40 shrink-0 snap-start flex-col gap-3 text-left focus:outline-none"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-border/20 bg-muted/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-black/20 flex items-center justify-center">
                  <span className="text-muted-foreground/60 text-xs">{style.name}</span>
                </div>
                <span className="line-clamp-2 px-1 text-base font-semibold text-foreground/90 transition-colors group-hover:text-foreground">
                  {style.name}
                </span>
              </button>
            ))}
          </div>

          {/* Discovery section */}
          <div className="relative mt-12 mb-6 flex items-center justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground tracking-tight">
              发现新内容
            </h2>
          </div>
          <div className="relative grid auto-cols-[85%] grid-flow-col grid-rows-3 gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory scrollbar-hide sm:auto-cols-[45%] lg:auto-cols-[32%]">
            {discoveries.map((item) => (
              <button
                key={item.name}
                className="group relative flex items-center gap-4 snap-start overflow-hidden rounded-xl border border-border/10 bg-foreground/[0.02] p-3 text-left transition-all duration-300 hover:bg-foreground/[0.05] hover:border-border/40 hover:shadow-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border/10 bg-muted/30 flex items-center justify-center">
                  <span className="text-muted-foreground/60 text-[10px]">img</span>
                </div>
                <span className="line-clamp-2 text-base font-semibold text-foreground/90 transition-colors group-hover:text-foreground">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
