﻿'use client';

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "免费版",
    price: { monthly: 0, yearly: 0 },
    credits: "无限免费生成",
    description: "适合初次尝试 AI 图像生成",
    features: [
      "无限免费生成",
      "Z-Image / Flux 2 / Qwen-Image / Seedream 5.0 / Nano Banana 2.0",
      "普通生成速度，需排队",
      "基础分辨率 1080P",
      "图片底部水印",
      "偶尔文字乱码",
      "不可商用",
    ],
    cta: "开始使用",
    popular: false,
    region: "all",
  },
  {
    name: "付费会员",
    price: { monthly: 12, yearly: 120 },
    credits: "解锁全部高级功能",
    description: "解锁 Nano Banana Pro 4K专业模型",
    features: [
      "无限免费生成",
      "解锁 Nano Banana Pro（4K超清）",
      "极速生成，优先队列",
      "最高分辨率 4K",
      "无水印",
      "超清晰文字生成不乱码",
      "可商业使用",
      "多图融合 / 局部重绘",
    ],
    cta: "升级到付费会员",
    popular: true,
    region: "all",
  },
];

// Checkout handler
const handleCheckout = async (planName: string, interval: string) => {
  if (planName === 'free') {
    window.location.href = '/zh/login';
    return;
  }
  const planKey = planName === 'pro' ? 'pro' : 'ultimate';
  try {
    const res = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planKey, interval }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else if (data.success && data.mock) {
      window.location.href = data.url;
    }
  } catch (err) {
    console.error('Checkout error:', err);
  }
};

const faqItems = [
  { q: "可以随时取消或更改套餐吗？", a: "是的，您可以随时取消订阅或更改套餐。" },
  { q: "付费会员有哪些专属模型？", a: "付费会员可解锁 Nano Banana Pro（Gemini 3 Pro Image），支持 4K 超清分辨率、多语言文字清晰不乱码、商用授权。" },
  { q: "免费版有哪些模型可以使用？", a: "免费版可使用：Z-Image（二次元）、Flux 2（写实）、Qwen-Image（中文）、Seedream 5.0（场景）、Nano Banana 2.0（极速）。" },
  { q: "如何获取退款？", a: "如果您对服务不满意，可以在购买后 7 天内联系 support@myai.app 申请全额退款。" },
];

export default function PricingClient() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="container mx-auto px-4 py-12 sm:py-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center rounded-full border border-primary/30 px-3 py-1 text-xs font-medium bg-primary/5 text-primary">
          海外专享 30 倍利润品质保证
        </div>
        <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
          简单透明的定价
        </h1>
        <p className="mt-4 text-lg text-foreground/70">
          全部免费使用，升级解锁 4K 商用专业功能。所有套餐均包含核心 AI 图像生成功能。
        </p>
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-center gap-3 mt-10">
        <span className={`text-sm font-medium ${!annual ? "text-foreground" : "text-foreground/50"}`}>
          月付
        </span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
            annual ? "bg-primary" : "bg-secondary"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-background shadow transition-transform duration-200 ${
              annual ? "translate-x-7" : "translate-x-0"
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${annual ? "text-foreground" : "text-foreground/50"}`}>
          年付
        </span>
        {annual && (
          <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            省 33%
          </span>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-6 md:grid-cols-3 mt-10 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-2xl border p-6 sm:p-8 transition-all duration-200 ${
              plan.popular
                ? "border-primary/40 bg-primary/5 shadow-lg shadow-primary/10 scale-[1.02]"
                : "border-border/40 bg-card/40 hover:border-border/60"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-md">
                <Sparkles className="w-3 h-3" />
                最受欢迎
              </div>
            )}
            {plan.region === "overseas" && (
              <div className="absolute -top-3 right-4 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 text-xs font-medium text-emerald-600">
                海外专享
              </div>
            )}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              <p className="mt-1 text-sm text-foreground/60">{plan.description}</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-foreground">
                {plan.price.monthly === 0
                  ? "免费"
                  : `$${annual ? plan.price.yearly / 12 : plan.price.monthly}`}
              </span>
              {plan.price.monthly > 0 && (
                <span className="text-sm text-foreground/50 ml-1">/月</span>
              )}
              <p className="mt-2 text-sm text-foreground/60">{plan.credits}</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              className={`w-full rounded-full py-2.5 text-sm font-semibold transition-all duration-200 ${
                plan.popular
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                  : plan.price.monthly === 0
                  ? "bg-secondary text-foreground hover:bg-secondary/80 border border-border/40"
                  : "bg-foreground/5 text-foreground hover:bg-foreground/10 border border-border/40"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Feature Comparison */}
      <div className="mt-24 max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-10">
          功能对比
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left py-4 px-4 text-foreground font-semibold">功能</th>
                <th className="text-center py-4 px-4 text-foreground font-semibold">免费版</th>
                <th className="text-center py-4 px-4 text-primary font-semibold">付费会员</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["可用模型", "Z-Image / Flux 2 / Qwen-Image / Seedream 5.0 / Nano Banana 2.0", "全部模型 + Nano Banana Pro"],
                ["生成速度", "普通，需排队", "极速，优先队列"],
                ["最高分辨率", "1080P", "4K 超清"],
                ["水印", "底部水印", "无"],
                ["文字生成", "偶尔乱码", "超清晰不乱码"],
                ["商用授权", "不可", "可商业使用"],
              ].map((row, i) => (
                <tr key={i} className="border-b border-border/20 hover:bg-foreground/[0.02]">
                  <td className="py-3 px-4 text-foreground/80">{row[0]}</td>
                  <td className="py-3 px-4 text-center text-foreground/60">{row[1]}</td>
                  <td className="py-3 px-4 text-center text-primary font-medium">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-24 max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-10">
          常见问题
        </h2>
        <div className="space-y-6">
          {faqItems.map((item, i) => (
            <div key={i} className="border-b border-border/20 pb-6">
              <h3 className="text-base font-semibold text-foreground mb-2">{item.q}</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-24 text-center max-w-2xl mx-auto rounded-2xl border border-primary/20 bg-primary/5 p-8 sm:p-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          无限免费，升级解锁专业功能
        </h2>
        <p className="mt-4 text-foreground/70">
          从免费套餐开始体验，所有基础模型无限使用。升级后解锁 Nano Banana Pro 4K 商用专业功能。
        </p>
        <button className="mt-6 inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all">
          免费开始使用
        </button>
      </div>

      {/* 国内价格 */}
      <div className="mt-16 text-center max-w-2xl mx-auto rounded-2xl border border-amber-200 bg-amber-50/50 p-8 sm:p-12">
        <div className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-700 mb-4">
          即将推出
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          国内定价
        </h2>
        <p className="mt-4 text-foreground/70">
          国内区域定价方案正在筹备中，即将推出，敬请期待。
        </p>
      </div>
    </div>
  );
}
