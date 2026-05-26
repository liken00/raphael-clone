'use client';

import { useState } from "react";
import { Globe, Loader2, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import GitHubLogin from "@/components/features/GitHubLogin";

type LoginStep = "choose" | "email" | "verify";

export default function LoginClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<LoginStep>("choose");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState("");
  const { setUser } = useAuth();

  const handleSendCode = async () => {
    if (!email.includes("@")) {
      setError("请输入有效的邮箱地址");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "发送失败");
      if (data._devCode) setDevCode(data._devCode);
      setStep("verify");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code || code.length < 4) {
      setError("请输入验证码");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "验证失败");
      setUser(data.user);
      localStorage.setItem("myai_user", JSON.stringify(data.user));
      window.location.href = "/zh";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
          {step === "choose" && (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-foreground">登录 MY AI</h1>
                <p className="mt-2 text-sm text-foreground/60">选择登录方式</p>
              </div>

              <div className="space-y-3">
                <GitHubLogin
                  onSuccess={(user) => {
                    setUser(user);
                    window.location.href = "/zh";
                  }}
                  onError={(err) => setError(err)}
                />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/40" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-foreground/40">或</span>
                  </div>
                </div>

                <button
                  onClick={() => { setStep("email"); setError(""); }}
                  className="w-full rounded-full border border-border/40 py-2.5 text-sm font-medium text-foreground/80 hover:bg-foreground/5 transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  使用邮箱登录
                </button>
              </div>

              {error && (
                <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}
            </>
          )}

          {step === "email" && (
            <>
              <div className="text-center mb-6">
                <button onClick={() => setStep("choose")} className="float-left text-foreground/40 hover:text-foreground">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold text-foreground">邮箱登录</h1>
                <p className="mt-2 text-sm text-foreground/60">输入邮箱地址，我们将发送验证码</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-foreground/60 block mb-1.5">邮箱地址</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-border/40 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                    onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                  />
                </div>
                <button
                  onClick={handleSendCode}
                  disabled={loading || !email.includes("@")}
                  className="w-full rounded-full py-2.5 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {loading ? "发送中..." : "发送验证码"}
                </button>
              </div>

              {error && (
                <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}
            </>
          )}

          {step === "verify" && (
            <>
              <div className="text-center mb-6">
                <button onClick={() => setStep("email")} className="float-left text-foreground/40 hover:text-foreground">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold text-foreground">输入验证码</h1>
                <p className="mt-2 text-sm text-foreground/60">
                  验证码已发送至 <strong className="text-foreground/80">{email}</strong>
                </p>
              </div>

              {devCode && (
                <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm text-center">
                  开发模式验证码: <strong className="text-lg tracking-widest">{devCode}</strong>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-foreground/60 block mb-1.5">验证码</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full text-center text-2xl tracking-[8px] px-4 py-3 rounded-xl border border-border/40 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                    onKeyDown={(e) => e.key === "Enter" && handleVerifyCode()}
                  />
                </div>
                <button
                  onClick={handleVerifyCode}
                  disabled={loading || code.length < 4}
                  className="w-full rounded-full py-2.5 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  {loading ? "验证中..." : "确认登录"}
                </button>
                <button
                  onClick={handleSendCode}
                  disabled={loading}
                  className="w-full text-center text-sm text-foreground/40 hover:text-foreground/60 transition-colors"
                >
                  重新发送验证码
                </button>
              </div>

              {error && (
                <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}
            </>
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