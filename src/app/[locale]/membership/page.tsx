'use client';

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Check, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "免费",
    price: "¥0",
    period: "",
    credits: "每日 10 点数",
    features: ["每日 10 次生成", "720P 分辨率", "标准队列", "水印"],
    cta: "当前方案",
    popular: false,
    color: "border-border/40",
  },
  {
    name: "专业",
    price: "¥99",
    period: "/月",
    credits: "无限点数",
    features: ["无限生成", "4K 分辨率", "优先队列", "无水印", "所有模型", "优先支持"],
    cta: "立即升级",
    popular: true,
    color: "border-primary",
  },
  {
    name: "企业",
    price: "¥399",
    period: "/月",
    credits: "定制方案",
    features: ["所有专业版功能", "API 访问", "专属客服", "批量处理", "定制模型"],
    cta: "联系我们",
    popular: false,
    color: "border-border/40",
  },
];

export default function MembershipPage() {
  const { user, isAuthenticated, tier, updateTier } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (planName: string) => {
    if (planName === "免费") return;

    if (!isAuthenticated) {
      window.location.href = "/zh/login";
      return;
    }

    setLoading(true);
    try {
      const planKey = planName === "专业" ? "pro" : "ultimate";
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey, interval: "monthly", email: user?.email, userId: user?.id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.success && data.mock) {
        // Dev mock: simulate upgrade
        updateTier("PRO");
        alert("开发模式：已模拟升级到专业版！");
      }
    } catch (err) {
      console.error("Upgrade error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1 rounded-full border border-primary/30 px-3 py-1 text-xs font-medium bg-primary/5 text-primary mb-4">
          <Sparkles className="w-3 h-3" />
          会员计划
        </div>
        <h1 className="text-4xl font-bold mb-4">选择适合您的方案</h1>
        <p className="text-lg text-foreground/70">解锁全部 AI 创作能力</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={"relative flex flex-col rounded-2xl border p-6 sm:p-8 transition-all duration-200 " + (plan.popular ? "border-primary/40 bg-primary/5 shadow-lg shadow-primary/10 scale-[1.02]" : "border-border/40 bg-card/40 hover:border-border/60")}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-md">
                <Sparkles className="w-3 h-3" />
                推荐
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
              <div>
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                {plan.period && <span className="text-foreground/60 text-sm">{plan.period}</span>}
              </div>
              <p className="mt-1 text-sm text-foreground/60">{plan.credits}</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade(plan.name)}
              disabled={loading || (plan.name === "免费")}
              className={"w-full rounded-full py-2.5 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 " + (plan.popular ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md" : (plan.name === "免费" ? "bg-secondary text-foreground/50 border border-border/40 cursor-default" : "bg-foreground/5 text-foreground hover:bg-foreground/10 border border-border/40"))}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {!isAuthenticated && (
        <div className="mt-8 text-center">
          <Link href="/zh/login" className="text-sm text-primary hover:text-primary/80 underline">登录后即可升级会员</Link>
        </div>
      )}
    </div>
  );
}