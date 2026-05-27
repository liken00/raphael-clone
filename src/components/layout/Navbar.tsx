'use client';

import { useState } from "react";
import Link from "next/link";
import { Globe, LogIn, Menu, X, ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/routing";

function LanguageSelector() {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const switchLocalePath = (newLocale) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    return segments.join("/") || "/" + newLocale;
  };

  const labels: Record<string, string> = { zh: "简体中文", en: "English" };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span>{labels[locale]}</span>
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-[140px] rounded-lg border border-zinc-800 bg-[#1a1a24] shadow-xl p-1 z-50">
          {["zh", "en"].map((l) => (
            <Link
              key={l}
              href={switchLocalePath(l)}
              className={`block px-3 py-2 text-sm rounded-md hover:bg-zinc-800 ${
                locale === l ? "text-amber-400" : "text-zinc-400"
              }`}
              onClick={() => setOpen(false)}
            >
              {labels[l]}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const locale = useLocale();

  return (
    <nav className="py-4 border-b border-zinc-800/50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Left: MY AI logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm">
              M
            </div>
            <span className="text-xl font-bold text-white">MY AI</span>
          </Link>

          {/* Center: Nav labels */}
          <div className="hidden md:flex items-center gap-8">
            <Link href={`/${locale}`} className="text-sm text-amber-400 font-medium">
              图像生成
            </Link>
            <Link href={`/${locale}/ai-video-generator`} className="text-sm text-zinc-400 hover:text-white transition-colors">
              视频生成
            </Link>
            <Link href={`/${locale}/ai-voice-clone`} className="text-sm text-zinc-400 hover:text-white transition-colors">
              声音克隆
            </Link>
            <Link href={`/${locale}/models`} className="text-sm text-zinc-400 hover:text-white transition-colors">
              模型架构
            </Link>
          </div>

          {/* Right: Language + Login */}
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <button className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-white text-sm font-medium transition-colors">
              <LogIn className="w-4 h-4 inline mr-1" />
              登录
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-zinc-800/50 pt-4 space-y-3">
            <Link href={`/${locale}`} className="block text-sm text-amber-400 font-medium py-2">
              图像生成
            </Link>
            <Link href={`/${locale}/ai-video-generator`} className="block text-sm text-zinc-400 hover:text-white py-2">
              视频生成
            </Link>
            <Link href={`/${locale}/ai-voice-clone`} className="block text-sm text-zinc-400 hover:text-white py-2">
              声音克隆
            </Link>
            <Link href={`/${locale}/models`} className="block text-sm text-zinc-400 hover:text-white py-2">
              模型架构
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}