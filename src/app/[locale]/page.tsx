'use client';

import ImageGenerator from "@/components/features/ImageGenerator";
import { useTranslations, useLocale } from "next-intl";

export default function HomePage() {
  const t = useTranslations("common");
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="text-lg">🎨</span> {locale === "zh" ? "AI 图像生成" : "AI Image Generation"}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {locale === "zh" ? t("tagline") : t("tagline")}
            </h1>
            <p className="text-xl text-muted-foreground">
              {locale === "zh" ? "将文字描述转换为精美的图像" : "Turn your words into stunning images"}
            </p>
          </div>
          <ImageGenerator />
      </main>
    </div>
  );
}