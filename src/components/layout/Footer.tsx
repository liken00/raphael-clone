import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 mt-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
          {/* Brand */}
          <Link href="/zh" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600" />
                <div className="absolute inset-0 bg-gradient-to-br from-amber-300/50 via-transparent to-amber-600/50 animate-gradient" />
                <span className="relative text-white font-bold text-sm tracking-wide">M</span>
              </div>
              <div className="absolute -inset-1 rounded-xl bg-amber-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <p className="text-xl font-bold text-white">
              MY <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">AI</span>
            </p>
          </Link>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
            <Link href="/zh/privacy" className="text-zinc-500 hover:text-amber-400 transition-colors">
              隐私政策
            </Link>
            <Link href="/zh/tos" className="text-zinc-500 hover:text-amber-400 transition-colors">
              服务条款
            </Link>
            <Link href="/zh/partners" className="text-zinc-500 hover:text-amber-400 transition-colors">
              合作伙伴
            </Link>
          </div>

          {/* Social */}
          <div className="flex items-center gap-4 text-zinc-500 text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>using AI</span>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-sm text-zinc-600">
            © 2025 MY AI 版权所有.
          </p>
        </div>
      </div>
    </footer>
  );
}