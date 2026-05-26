'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { Globe, ChevronDown, Menu, X, User, LogOut, Crown } from "lucide-react";
import { useAuth, type User as AuthUser } from "@/contexts/AuthContext";
import { TIERS } from "@/lib/tiers";

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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const { user, isAuthenticated, isLoading, tierConfig } = useAuth();

  // Close menus when clicking outside
  useEffect(() => {
    const handleClick = () => {
      setUserMenuOpen(false);
      setAiMenuOpen(false);
    };
    if (userMenuOpen || aiMenuOpen) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [userMenuOpen, aiMenuOpen]);

  // Handle auth callback redirect with user data
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authParam = params.get("auth");
    const userParam = params.get("user");

    if (authParam === "github" && userParam) {
      try {
        const userData = JSON.parse(atob(userParam));
        // Store in localStorage and update context
        localStorage.setItem("raphael_user", JSON.stringify(userData));
        window.location.href = "/zh"; // Clean URL
      } catch (e) {
        console.error("Failed to parse user data:", e);
      }
    }
  }, []);

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
                MY AI
              </span>
            </Link>
            <div className="flex items-center gap-1">
              {navItems.map((item, i) => (
                <div key={i} className="relative group">
                  {"children" in item ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAiMenuOpen(!aiMenuOpen);
                        }}
                        className="text-muted-foreground hover:text-accent-foreground inline-flex items-center gap-1 h-10 px-4 py-2 text-sm font-medium rounded-md transition-colors"
                      >
                        <span>{item.title}</span>
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      {aiMenuOpen && (
                        <div className="absolute left-0 top-full mt-1 w-48 rounded-xl border border-border/40 bg-card/95 backdrop-blur-sm shadow-lg p-2 z-50">
                          {"children" in item && item.children.map((child, j) => (
                            <Link
                              key={j}
                              href={child.href}
                              onClick={() => setAiMenuOpen(false)}
                              className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                            >
                              {child.title}
                            </Link>
                          ))}
                        </div>
                      )}
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

            {isLoading ? (
              <div className="h-10 w-20 animate-pulse bg-muted rounded-md" />
            ) : isAuthenticated && user ? (
              /* User Menu */
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserMenuOpen(!userMenuOpen);
                  }}
                  className="flex items-center gap-2 h-10 px-3 text-sm border border-border rounded-md hover:bg-accent transition-colors"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-3 h-3 text-primary" />
                    </div>
                  )}
                  <span className="hidden md:block">{user.name || user.phone || "用户"}</span>
                  <span
                    className={`hidden md:block px-1.5 py-0.5 text-[10px] font-medium rounded ${tierConfig.badgeColor} text-white`}
                  >
                    {tierConfig.badge}
                  </span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border/40 bg-card/95 backdrop-blur-sm shadow-lg p-2 z-50">
                    {/* User Info */}
                    <div className="px-3 py-2 border-b border-border/30 mb-2">
                      <p className="font-medium text-sm">
                        {user.name || user.phone || "用户"}
                      </p>
                      <p className="text-xs text-foreground/50">
                        {user.email || user.phone || ""}
                      </p>
                    </div>

                    {/* Tier Badge */}
                    <div className="px-3 py-2 mb-2">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${tierConfig.badgeColor} text-white text-xs font-medium`}
                      >
                        <Crown className="w-3 h-3" />
                        {tierConfig.label}
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-1">
                      <Link
                        href="/zh/account"
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                      >
                        <User className="w-4 h-4" />
                        账户设置
                      </Link>
                      <Link
                        href="/zh/membership"
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                      >
                        <Crown className="w-4 h-4" />
                        升级会员
                      </Link>
                      <button
                        onClick={() => {
                          localStorage.removeItem("raphael_user");
                          window.location.href = "/zh";
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors text-red-500"
                      >
                        <LogOut className="w-4 h-4" />
                        退出登录
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/zh/login"
                className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                登录
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile nav */}
        <div className="flex lg:hidden items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              R
            </div>
            <span className="text-xl font-bold">MY AI</span>
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