'use client';

import Link from "next/link";
import { useState } from "react";
import { Globe, ChevronDown, Menu, X } from "lucide-react";

const navItems = [
  {
    title: "Nano Banana 2",
    href: "/zh/nano-banana-2",
    badge: "50%折扣",
  },
  { title: "AI 图像编辑器", href: "/zh/ai-image-editor" },
  { title: "AI 视频生成器", href: "/zh/ai-video-generator", badge: "NEW" },
  { title: "定价", href: "/zh/pricing" },
  {
    title: "AI 工具",
    children: [
      { title: "扩展图像", href: "/zh/uncrop" },
      { title: "移除背景", href: "/zh/background-remover" },
    ],
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <section className="py-3 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/zh" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                R
              </div>
              <span className="text-xl text-primary font-bold">
                Raphael AI
              </span>
            </Link>
            <div className="flex items-center gap-1">
              {navItems.map((item, i) => (
                <div key={i} className="relative group">
                  {"children" in item ? (
                    <>
                      <button className="text-muted-foreground hover:text-accent-foreground inline-flex items-center gap-1 h-10 px-4 py-2 text-sm font-medium rounded-md transition-colors">
                        <span>{item.title}</span>
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-accent-foreground inline-flex items-center h-10 px-4 py-2 text-sm font-medium rounded-md transition-colors relative"
                    >
                      {item.title}
                      {"badge" in item && item.badge && (
                        <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium bg-amber-500/10 text-amber-500 absolute -top-2 -right-3">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 h-10 px-3 text-sm text-muted-foreground border border-border rounded-md">
              <Globe className="h-4 w-4" />
              <span className="hidden md:block">简体中文</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </button>
            <button className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              登录
            </button>
          </div>
        </nav>

        {/* Mobile nav */}
        <div className="flex lg:hidden items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              R
            </div>
            <span className="text-xl font-bold">Raphael AI</span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-primary text-primary-foreground"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </section>
  );
}
