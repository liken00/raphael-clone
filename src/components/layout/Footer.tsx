import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 border-t border-zinc-800/50 mt-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm">
              M
            </div>
            <p className="text-2xl font-bold text-white">MY AI</p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
            <Link href="/zh/privacy" className="hover:text-amber-400 transition-colors">
              隐私政策
            </Link>
            <Link href="/zh/tos" className="hover:text-amber-400 transition-colors">
              服务条款
            </Link>
            <Link href="/zh/partners" className="hover:text-amber-400 transition-colors">
              合作伙伴
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-zinc-600">
          © 2025 MY AI 版权所有。
        </div>
      </div>
    </footer>
  );
}