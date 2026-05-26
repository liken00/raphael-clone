export default function PartnersPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1 rounded-full border border-primary/30 px-3 py-1 text-xs font-medium bg-primary/5 text-primary mb-4">
          合作伙伴
        </div>
        <h1 className="text-4xl font-bold mb-4">与我们合作</h1>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          MY AI 与全球顶尖的 AI 模型和技术提供商合作，为您带来最优质的图像生成体验。
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mb-16">
        {[
          { name: "Nano Banana", desc: "下一代 AI 图像生成模型，提供卓越的图像质量和生成速度。", tag: "图像模型" },
          { name: "Qwen-Image", desc: "阿里巴巴通义千问图像生成模型，强大的文本到图像能力。", tag: "图像模型" },
          { name: "Seedream", desc: "顶尖的图像生成模型，为 MY AI 自研模型提供核心技术。", tag: "图像模型" },
          { name: "Seedance", desc: "先进的视频生成模型，驱动 MY AI 的视频生成功能。", tag: "视频模型" },
          { name: "DeepSeek", desc: "高性能 AI 对话模型，为飞书机器人提供智能回复能力。", tag: "对话模型" },
          { name: "Stripe", desc: "全球领先的支付处理平台，保障您的交易安全。", tag: "支付" },
        ].map((partner, i) => (
          <div key={i} className="p-6 rounded-xl border border-border/40 bg-card/40 hover:border-primary/30 transition-colors">
            <div className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary mb-3">
              {partner.tag}
            </div>
            <h3 className="text-lg font-semibold mb-2">{partner.name}</h3>
            <p className="text-sm text-foreground/70">{partner.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 sm:p-12 text-center">
        <h2 className="text-2xl font-bold mb-4">成为合作伙伴</h2>
        <p className="text-foreground/70 mb-6 max-w-xl mx-auto">
          如果您有兴趣与 MY AI 合作，请通过以下方式联系我们。
        </p>
        <a href="mailto:support@myai.app" className="inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all">
          联系我们
        </a>
      </div>
    </div>
  );
}