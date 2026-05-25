'use client';

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "免费",
    price: { monthly: 0, yearly: 0 },
    credits: "每日 10 点数",
    description: "适合初次尝试 AI 图像生成",
    features: [
      "每日 10 次生成",
      "Raphael Basic 模型",
      "标准队列",
      "基础分辨率",
      "社区许可",
    ],
    cta: "开始使用",
    popular: false,
  },
  {
    name: "专业",
    price: { monthly: 12, yearly: 96 },
    credits: "每月 2,000 点数",
    description: "适合创作者和自由职业者",
    features: [
      "每月 2,000 点数",
      "所有 Raphael 模型",
      "优先队列",
      "高清分辨率",
      "商业许可",
      "无水印",
      "优先邮件支持",
    ],
    cta: "升级到专业版",
    popular: true,
  },
  {
    name: "终极",
    price: { monthly: 28, yearly: 224 },
    credits: "每月 5,000 点数",
    description: "适合工作室和重度用户",
    features: [
      "每月 5,000 点数",
      "所有 Raphael 模型",
      "最快渲染队列",
      "最高分辨率",
      "商业许可",
      "无水印",
      "优先邮件支持",
      "AI 图像编辑器",
      "API 访问权限",
    ],
    cta: "升级到终极版",
    popular: false,
  },
];

const faqItems = [
  { q: "可以随时取消或更改套餐吗？", a: "是的，您可以随时取消订阅或更改套餐。取消后，点数将在当前计费周期结束时过期。" },
  { q: "未使用的点数会累积到下一月吗？", a: "点数仅限当月使用，不会结转到下个月。我们建议选择适合您使用量的套餐。" },
  { q: "免费用户有功能限制吗？", a: "免费用户每天获得 10 点数，可使用 Raphael Basic 模型。升级后可解锁更多模型、更高分辨率和优先队列。" },
  { q: "如何获取退款？", a: "如果您对服务不满意，可以在购买后 7 天内联系 support@raphael.app 申请全额退款。" },
];

export default function PricingClient() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="container mx-auto px-4 py-12 sm:py-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center rounded-full border border-primary/30 px-3 py-1 text-xs font-medium bg-primary/5 text-primary">
          定价
        </div>
        <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
          简单透明的定价
        </h1>
        <p className="mt-4 text-lg text-foreground/70">
          从免费开始，成长时再升级。所有套餐均包含核心 AI 图像生成功能。
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
                <th className="text-center py-4 px-4 text-foreground font-semibold">免费</th>
                <th className="text-center py-4 px-4 text-primary font-semibold">专业</th>
                <th className="text-center py-4 px-4 text-foreground font-semibold">终极</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["月生成量", "300", "2,000", "5,000"],
                ["可用模型", "Raphael Basic", "所有模型", "所有模型"],
                ["渲染队列", "标准", "优先", "最快"],
                ["分辨率", "基础", "高清", "最高"],
                ["水印", "有", "无", "无"],
                ["商业许可", "否", "是", "是"],
                ["AI 图像编辑器", "—", "—", "✓"],
                ["API 访问", "—", "—", "✓"],
                ["邮件支持", "—", "优先", "优先"],
              ].map((row, i) => (
                <tr key={i} className="border-b border-border/20 hover:bg-foreground/[0.02]">
                  <td className="py-3 px-4 text-foreground/80">{row[0]}</td>
                  <td className="py-3 px-4 text-center text-foreground/60">{row[1]}</td>
                  <td className="py-3 px-4 text-center text-foreground/80">{row[2]}</td>
                  <td className="py-3 px-4 text-center text-foreground/80">{row[3]}</td>
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
          还不确定？
        </h2>
        <p className="mt-4 text-foreground/70">
          从免费套餐开始体验，无需信用卡。每天 10 点数，零成本探索 AI 图像生成。
        </p>
        <button className="mt-6 inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all">
          免费开始使用
        </button>
      </div>
    </div>
  );
}
