'use client';

import { useState } from "react";
import Link from "next/link";
import { Globe, LogIn, Menu, X, ChevronDown, Wand2, Video, Mic, Box } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/routing";

function LanguageSelector() {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const switchLocalePath = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    return segments.join("/") || "/" + newLocale;
  };

  const labels: Record<string, string> = { zh: "简体中文", en: "English" };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="group flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-all duration-200 hover:bg-white/5 px-3 py-1.5 rounded-lg border border-transparent hover:border-white/10"
      >
        <div className="relative">
          <Globe className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
          <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <span className="hidden sm:inline">{labels[locale]}</span>
        <ChevronDown className={`w-3 h-3 opacity-60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-[160px] rounded-xl border border-white/10 bg-[#0a0a14]/95 backdrop-blur-xl shadow-2xl shadow-black/30 p-1.5 z-50 animate-scale-in">
          {["zh", "en"].map((l) => (
            <Link
              key={l}
              href={switchLocalePath(l)}
              className={`block px-3 py-2.5 text-sm rounded-lg hover:bg-white/5 transition-colors ${
                locale === l ? "text-amber-400 font-medium bg-amber-500/10" : "text-zinc-400"
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

  const navItems = [
    { href: `/${locale}`, label: "图像生成", icon: Wand2, active: true },
    { href: `/${locale}/ai-video-generator`, label: "视频生成", icon: Video, active: false },
    { href: `/${locale}/ai-voice-clone`, label: "声音克隆", icon: Mic, active: false },
    { href: `/${locale}/models`, label: "模型架构", icon: Box, active: false },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-2xl bg-[#0a0a14]/80">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left: MY AI logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3 group">
            <div className="relative">
              {/* Logo container with tech border */}
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600" />
                <div className="absolute inset-0 bg-gradient-to-br from-amber-300/50 via-transparent to-amber-600/50 animate-gradient" />
                {/* Letter */}
                <span className="relative text-white font-bold text-sm tracking-wide">M</span>
                {/* Glow effect */}
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-amber-400/30 to-amber-600/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-white tracking-tight">
                MY <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">AI</span>
              </span>
              {/* Status indicator */}
              <span className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            </div>
          </Link>

          {/* Center: Nav labels */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-2 px-4 py-2 text-sm rounded-xl transition-all duration-300 ${
                  item.active
                    ? "text-white bg-white/10"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className={`w-4 h-4 transition-all duration-300 ${item.active ? 'text-amber-400' : 'text-zinc-500 group-hover:text-amber-400/70'}`} />
                <span className="relative">
                  {item.label}
                  {item.active && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" />
                  )}
                </span>
              </Link>
            ))}
          </div>

          {/* Right: Language + Login */}
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <button className="group relative px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white text-sm font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">登录</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-white/20 to-amber-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/5 pt-4 space-y-1 animate-fade-in-up">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all ${
                  item.active
                    ? "text-white bg-white/10 font-medium"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className={`w-4 h-4 ${item.active ? 'text-amber-400' : ''}`} />
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}