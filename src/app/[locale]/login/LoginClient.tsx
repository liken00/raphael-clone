'use client';

import { useState } from "react";
import { Globe, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import GitHubLogin from "@/components/features/GitHubLogin";

export default function LoginClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuth();

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
              登录 MY AI
            </h1>
            <p className="mt-2 text-sm text-foreground/60">
              使用 GitHub 账户登录以继续使用 MY AI
            </p>
          </div>

          {/* GitHub Login */}
          <GitHubLogin
            onSuccess={(user) => {
              setUser(user);
              window.location.href = "/zh";
            }}
            onError={(err) => setError(err)}
          />

          {/* Error Message */}
          {error && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
              <Globe className="w-4 h-4 flex-shrink-0" />
              {error}
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