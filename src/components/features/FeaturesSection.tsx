export default function FeaturesSection() {
  const features = [
    {
      icon: "💰",
      title: "零成本创作",
      desc: "Raphael AI 图像生成器是世界上第一个完全免费的 AI 图像生成器，没有生成次数限制或注册要求。",
    },
    {
      icon: "✨",
      title: "最先进的质量",
      desc: "Raphael AI 图像生成器中的场景感知智能路由会选择当前最合适的模型，以提供具有卓越细节和风格控制的照片级图像。",
    },
    {
      icon: "🌐",
      title: "高级文本理解",
      desc: "Raphael AI 图像生成器提供卓越的文本到图像功能，能够准确解释复杂的提示和文本叠加功能。",
    },
    {
      icon: "⚡",
      title: "闪电般快速的生成",
      desc: "优化的推理管道确保 Raphael AI 图像生成器在不影响质量的情况下快速生成图像。",
    },
    {
      icon: "🛡️",
      title: "增强的隐私保护",
      desc: "我们采用最小化数据收集原则：未登录请求通常仅作临时处理；登录后仅保存提供服务所必需的信息。",
    },
    {
      icon: "🎨",
      title: "多风格支持",
      desc: "Raphael AI 图像生成器可以创建各种艺术风格的图像，从照片级真实感、动漫、油画到数字艺术。",
    },
  ];

  return (
    <section id="功能" className="py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-screen-md flex-col items-center gap-2">
          <h2 className="mb-2 text-pretty text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
            Raphael AI 图像生成器的主要特点
          </h2>
          <p className="mb-8 max-w-xl text-foreground/80 lg:max-w-none lg:text-lg">
            体验下一代 AI 图像生成，Raphael AI 图像生成器强大、免费且注重隐私。
          </p>
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col">
              <div className="mb-5 flex size-16 items-center justify-center rounded-full border border-primary text-2xl">
                {f.icon}
              </div>
              <h3 className="mb-2 text-2xl font-bold text-foreground line-clamp-2">
                {f.title}
              </h3>
              <p className="text-foreground/80 line-clamp-4 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
