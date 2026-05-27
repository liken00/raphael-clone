'use client';

import { ArrowDown } from "lucide-react";

const models = [
  {
    id: "nano-banana-pro",
    name: "🌸 Nano Banana Pro",
    origin: "谷歌 Gemini 3 Pro Image",
    tier: "PRO",
    description: "高清专业版，4K 超清输出。多语言文字清晰可商用，复杂合成、产品海报首选。",
    tags: ["4K 超清", "商用授权", "文字清晰"],
  },
  {
    id: "nano-banana-2",
    name: "⚡ Nano Banana 2.0",
    origin: "谷歌 Gemini 3.1 Flash Image",
    tier: "FREE",
    description: "极速版，速度提升 4 倍。支持联网搜索、实时生成，日常快速出图主力。",
    tags: ["极速", "联网搜索", "实时生成"],
  },
  {
    id: "flux-2",
    name: "📷 Flux 2",
    origin: "海外顶级写实模型 (Flux.1-Dev)",
    tier: "FREE",
    description: "摄影质感、细节拉满。适合人像、产品图、写实大片。",
    tags: ["写实摄影", "细节丰富", "人像"],
  },
  {
    id: "z-image",
    name: "🎨 Z-Image",
    origin: "动漫 / 插画模型",
    tier: "FREE",
    description: "偏向动漫、二次元、插画、国风。速度最快，日常出图首选。",
    tags: ["二次元", "极速", "插画"],
  },
  {
    id: "qwen-image",
    name: "🐉 Qwen-Image",
    origin: "阿里 通义千问图像版",
    tier: "FREE",
    description: "中文理解极强、文字不乱码。做中文海报、电商图、国风设计最稳。",
    tags: ["中文擅长", "文字不乱码", "电商"],
  },
  {
    id: "seedream-5.0",
    name: "🌄 Seedream 5.0",
    origin: "字节跳动",
    tier: "FREE",
    description: "国产顶尖模型，擅长真实场景、环境渲染、多人物一致性。",
    tags: ["场景渲染", "多人一致", "真实感"],
  },
];

export default function ModelsClient() {
  return (
    <div className="container mx-auto px-4 py-12 sm:py-20">
      <div className="text-center max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center rounded-full border border-primary/30 px-3 py-1 text-xs font-medium bg-primary/5 text-primary mb-6">🧠 技术架构</div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">全部模型技术支持</h1>
        <p className="mt-4 text-lg text-foreground/70">6 大主流图像模型 + 2 套自研技术，内置智能路由系统自动匹配最优模型</p>
      </div>

      <div className="max-w-3xl mx-auto mb-20">
        <h2 className="text-2xl font-bold text-center mb-8">⚙️ 智能多模型路由系统</h2>
        <div className="w-full">
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 text-center">
            <div className="text-xs text-primary/60 font-medium mb-1">你输入提示词</div>
            <div className="text-sm sm:text-base font-medium text-foreground">
              "一张国风海报，上面写着「中秋快乐」，高清"
            </div>
          </div>
          <div className="flex justify-center py-2 text-primary/50"><ArrowDown className="w-5 h-5" /></div>
        </div>
        <div className="w-full">
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 text-center">
            <div className="text-xs text-primary/60 font-medium mb-1">智能路由系统自动分析</div>
            <div className="text-sm sm:text-base font-medium text-foreground">
              风格 → 国风 / 文字需求 → 中文 / 画质 → 高清
            </div>
          </div>
          <div className="flex justify-center py-2 text-primary/50"><ArrowDown className="w-5 h-5" /></div>
        </div>
        <div className="w-full">
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 text-center">
            <div className="text-xs text-primary/60 font-medium mb-1">自动匹配最优模型</div>
            <div className="text-sm sm:text-base font-medium text-foreground">
              <div className="flex flex-wrap gap-2 justify-center mt-3">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-card border border-border/40 text-xs">✅ Qwen-Image（中文海报）</span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-card border border-border/40 text-xs">✅ Nano Banana Pro（高清文字）</span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-card border border-border/40 text-xs">←备选 Z-Image / Flux 2（备选）</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 rounded-xl border border-border/40 bg-card p-5 text-sm text-foreground/70">
          <p><strong className="text-foreground">判断逻辑：</strong></p>
          <ul className="mt-2 space-y-1">
            <li>• 要高清、文字清晰、合成复杂 → <span className="text-primary">Nano Banana Pro</span></li>
            <li>• 要速度、动漫、插画 → <span className="text-primary">Z-Image / Flux 2</span></li>
            <li>• 中文海报、国风设计 → <span className="text-primary">Qwen-Image</span></li>
            <li>• 真实场景、多人一致 → <span className="text-primary">Seedream 5.0</span></li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center mb-8">全部 6 大图像模型</h2>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {models.map((model) => (
          <div key={model.id} className="rounded-2xl border border-border/40 bg-card p-6 hover:border-primary/30 hover:bg-card-hover transition-all duration-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-bold">{model.name}</h3>
              <span className={"text-xs font-semibold px-2.5 py-0.5 rounded-full " + (model.tier === "PRO" ? "bg-amber-500/15 text-amber-500" : "bg-emerald-500/15 text-emerald-500")}>{model.tier === "PRO" ? "付费会员" : "免费"}</span>
            </div>
            <div className="text-xs text-foreground/50 mb-3">{model.origin}</div>
            <p className="text-sm text-foreground/70 mb-4 leading-relaxed">{model.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {model.tags.map((tag) => <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary/80">{tag}</span>)}
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto mt-20">
        <h2 className="text-2xl font-bold text-center mb-8">🔬 MY AI 自研专属技术</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border/40 bg-card p-6">
            <div className="text-3xl mb-3">🎬</div>
            <h3 className="text-lg font-bold mb-2">Seedance 2.0</h3>
            <p className="text-sm text-foreground/70">平台自研 AI 视频生成模型，可直接用文字生成短视频、动态图。</p>
          </div>
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <div className="text-3xl mb-3">🧠</div>
            <h3 className="text-lg font-bold mb-2">智能多模型路由系统</h3>
            <p className="text-sm text-foreground/70">自动识别你的提示词（风格、文字、画质、速度需求），自动分配最优模型，不用手动选。</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-20">
        <h2 className="text-2xl font-bold text-center mb-8">📋 模型速查表：我要做什么？</h2>
        <div className="overflow-x-auto rounded-xl border border-border/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-muted/50">
                <th className="text-left py-3 px-4 font-semibold">我要生成...</th>
                <th className="text-left py-3 px-4 font-semibold">推荐模型</th>
                <th className="text-left py-3 px-4 font-semibold hidden sm:table-cell">原因</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/20 hover:bg-foreground/[0.02]">
                <td className="py-3 px-4 font-medium">带中文文字的海报/邀请函</td>
                <td className="py-3 px-4 text-primary">Qwen-Image / Nano Banana Pro</td>
                <td className="py-3 px-4 text-foreground/60 hidden sm:table-cell">中文不乱码、文字清晰</td>
              </tr>
              <tr className="border-b border-border/20 hover:bg-foreground/[0.02]">
                <td className="py-3 px-4 font-medium">电商产品图/商品展示</td>
                <td className="py-3 px-4 text-primary">Nano Banana Pro / Flux 2</td>
                <td className="py-3 px-4 text-foreground/60 hidden sm:table-cell">4K 高清、细节锐利、可商用</td>
              </tr>
              <tr className="border-b border-border/20 hover:bg-foreground/[0.02]">
                <td className="py-3 px-4 font-medium">动漫/二次元插画</td>
                <td className="py-3 px-4 text-primary">Z-Image</td>
                <td className="py-3 px-4 text-foreground/60 hidden sm:table-cell">速度最快、风格最准</td>
              </tr>
              <tr className="border-b border-border/20 hover:bg-foreground/[0.02]">
                <td className="py-3 px-4 font-medium">真人写实/摄影质感</td>
                <td className="py-3 px-4 text-primary">Flux 2</td>
                <td className="py-3 px-4 text-foreground/60 hidden sm:table-cell">摄影级细节和光影</td>
              </tr>
              <tr className="border-b border-border/20 hover:bg-foreground/[0.02]">
                <td className="py-3 px-4 font-medium">国风/水墨风格</td>
                <td className="py-3 px-4 text-primary">Qwen-Image / Z-Image</td>
                <td className="py-3 px-4 text-foreground/60 hidden sm:table-cell">中文理解强、风格适配</td>
              </tr>
              <tr className="border-b border-border/20 hover:bg-foreground/[0.02]">
                <td className="py-3 px-4 font-medium">复杂场景/多人画面</td>
                <td className="py-3 px-4 text-primary">Seedream 5.0</td>
                <td className="py-3 px-4 text-foreground/60 hidden sm:table-cell">多人物一致性最好</td>
              </tr>
              <tr className="border-b border-border/20 hover:bg-foreground/[0.02]">
                <td className="py-3 px-4 font-medium">日常快速出图</td>
                <td className="py-3 px-4 text-primary">Nano Banana 2.0 / Z-Image</td>
                <td className="py-3 px-4 text-foreground/60 hidden sm:table-cell">速度最快、任意风格</td>
              </tr>
              <tr className="border-b border-border/20 hover:bg-foreground/[0.02]">
                <td className="py-3 px-4 font-medium">多图融合/局部重绘</td>
                <td className="py-3 px-4 text-primary">Nano Banana Pro</td>
                <td className="py-3 px-4 text-foreground/60 hidden sm:table-cell">专业图像引擎支持</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-20 text-center max-w-2xl mx-auto rounded-2xl border border-primary/20 bg-primary/5 p-8 sm:p-12">
        <h2 className="text-2xl sm:text-3xl font-bold">所有模型免费使用</h2>
        <p className="mt-4 text-foreground/70">全部基础模型无限免费生成。升级付费会员可解锁 Nano Banana Pro 4K 商用专业版。</p>
        <a href="/zh/pricing" className="mt-6 inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all">查看定价方案</a>
      </div>
    </div>
  );
}
