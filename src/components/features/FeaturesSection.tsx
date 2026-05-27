import { Coins, Sparkles, Globe, Zap, Shield, Palette } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Coins,
      title: "零成本创作",
      desc: "MY AI 图像生成器是世界上第一个完全免费的 AI 图像生成器，没有生成次数限制或注册要求。",
      color: "from-amber-500/20 to-amber-600/10",
    },
    {
      icon: Sparkles,
      title: "最先进的质量",
      desc: "MY AI 图像生成器中的场景感知智能路由会选择当前最合适的模型，以提供具有卓越细节和风格控制的照片级图像。",
      color: "from-purple-500/20 to-purple-600/10",
    },
    {
      icon: Globe,
      title: "高级文本理解",
      desc: "MY AI 图像生成器提供卓越的文本到图像功能，能够准确解释复杂的提示和文本叠加功能。",
      color: "from-cyan-500/20 to-cyan-600/10",
    },
    {
      icon: Zap,
      title: "闪电般快速的生成",
      desc: "优化的推理管道确保 MY AI 图像生成器在不影响质量的情况下快速生成图像。",
      color: "from-amber-500/20 to-cyan-600/10",
    },
    {
      icon: Shield,
      title: "增强的隐私保护",
      desc: "我们采用最小化数据收集原则：未登录请求通常仅作临时处理；登录后仅保存提供服务所必需的信息。",
      color: "from-green-500/20 to-green-600/10",
    },
    {
      icon: Palette,
      title: "多风格支持",
      desc: "MY AI 图像生成器可以创建各种艺术风格的图像，从照片级真实感、动漫、油画到数字艺术。",
      color: "from-pink-500/20 to-pink-600/10",
    },
  ];

  return (
    <section id="功能" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mx-auto flex max-w-screen-md flex-col items-center gap-3 mb-12">
          <h2 className="text-pretty text-3xl lg:text-4xl font-bold text-foreground tracking-tight text-center">
            MY AI 图像生成器的<span className="gradient-text">主要特点</span>
          </h2>
          <p className="max-w-xl text-foreground/70 lg:max-w-none lg:text-lg text-center">
            体验下一代 AI 图像生成，强大、免费且注重隐私
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div 
              key={i} 
              className="group relative p-6 rounded-2xl tech-border hover:bg-[#0a0a14]/80 transition-all duration-300"
            >
              <div className={`mb-5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} backdrop-blur-sm border border-white/10`}>
                <f.icon className="size-7 text-foreground/80" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground line-clamp-1">
                {f.title}
              </h3>
              <p className="text-foreground/60 line-clamp-4 leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}