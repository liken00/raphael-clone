'use client';

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Phone, Github, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import PhoneLogin from "@/components/features/PhoneLogin";
import GitHubLogin from "@/components/features/GitHubLogin";
import { COUNTRY_CODES } from "@/app/api/auth/send-code/route";

export default function LoginClient() {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [loginMethod, setLoginMethod] = useState<"email" | "phone" | "github">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Demo account success - in production, use real auth
        if (email === "demo@raphael.app" && password === "demo1234") {
          const demoUser = {
            id: "1",
            email,
            name: "Demo User",
            tier: "PRO" as const,
            createdAt: new Date().toISOString(),
          };
          setUser(demoUser);
          window.location.href = "/zh";
        } else {
          setError("Invalid credentials. Try demo@raphael.app / demo1234");
        }
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSuccess = (user: any) => {
    setUser(user);
    setTimeout(() => {
      window.location.href = "/zh";
    }, 500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/zh" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
              R
            </div>
            <span className="text-2xl font-bold text-foreground">MY AI</span>
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
                ? "登录以继续使用 MY AI"
                : mode === "register"
                ? "注册以开始免费生成图像"
                : "输入您的电子邮件以接收重置链接"}
            </p>
          </div>

          {/* Login Method Tabs */}
          {mode === "login" && (
            <div className="flex gap-2 mb-6 p-1 rounded-lg bg-muted/50">
              <button
                onClick={() => setLoginMethod("email")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  loginMethod === "email" ? "bg-background shadow-sm" : "hover:bg-muted"
                }`}
              >
                邮箱登录
              </button>
              <button
                onClick={() => setLoginMethod("phone")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  loginMethod === "phone" ? "bg-background shadow-sm" : "hover:bg-muted"
                }`}
              >
                手机登录
              </button>
            </div>
          )}

          {/* Email Login Form */}
          {loginMethod === "email" && mode === "login" && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
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
                    placeholder="输入密码"
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

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  忘记密码？
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>登录</>}
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Demo hint */}
              <div className="text-center text-xs text-foreground/40 mt-2">
                Demo: demo@raphael.app / demo1234
              </div>
            </form>
          )}

          {/* Phone Login */}
          {loginMethod === "phone" && (
            <PhoneLogin onSuccess={handlePhoneSuccess} />
          )}

          {/* Divider */}
          {loginMethod === "email" && mode === "login" && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/30" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 text-foreground/40">或</span>
                </div>
              </div>

              {/* Social login */}
              <GitHubLogin
                onSuccess={(user) => {
                  setUser(user);
                  window.location.href = "/zh";
                }}
                onError={(err) => setError(err)}
              />
            </>
          )}

          {/* Switch mode */}
          {loginMethod === "email" && (
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
          )}
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