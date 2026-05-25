'use client';

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginClient() {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/zh" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
              R
            </div>
            <span className="text-2xl font-bold text-foreground">Raphael AI</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-border/40 bg-card/40 p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              {mode === "login" ? "欢迎回来" : mode === "register" ? "创建账户" : "重置密码"}
            </h1>
            <p className="mt-2 text-sm text-foreground/60">
              {mode === "login"
                ? "登录以继续使用 Raphael AI"
                : mode === "register"
                ? "注册以开始免费生成图像"
                : "输入您的电子邮件以接收重置链接"}
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-4"
          >
            {mode === "register" && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground/80 mb-1.5">
                  用户名
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="您的用户名"
                    className="w-full rounded-xl border border-border/40 bg-background px-4 py-2.5 pl-10 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-1.5">
                电子邮件
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-xl border border-border/40 bg-background px-4 py-2.5 pl-10 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              </div>
            </div>

            {mode !== "forgot" && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground/80 mb-1.5">
                  密码
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "register" ? "至少 8 个字符" : "输入密码"}
                    className="w-full rounded-xl border border-border/40 bg-background px-4 py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === "login" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  忘记密码？
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              {mode === "login" ? "登录" : mode === "register" ? "注册" : "发送重置链接"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/30" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-foreground/40">或</span>
            </div>
          </div>

          {/* Social login */}
          <button className="w-full rounded-full border border-border/40 py-2.5 text-sm font-medium text-foreground/80 hover:bg-foreground/5 transition-all flex items-center justify-center gap-2">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            使用 GitlabLogo 登录
          </button>

          {/* Switch mode */}
          <div className="mt-6 text-center text-sm text-foreground/50">
            {mode === "login" ? (
              <>
                还没有账户？{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  注册
                </button>
              </>
            ) : mode === "register" ? (
              <>
                已有账户？{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  登录
                </button>
              </>
            ) : (
              <>
                想起密码了？{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  返回登录
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-foreground/40">
          继续操作即表示您同意我们的{" "}
          <Link href="/privacy" className="underline hover:text-foreground/60">隐私政策</Link>
          {" "}和{" "}
          <Link href="/tos" className="underline hover:text-foreground/60">服务条款</Link>
        </p>
      </div>
    </div>
  );
}
