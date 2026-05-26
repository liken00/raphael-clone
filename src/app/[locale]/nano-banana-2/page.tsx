export default function NanoBanana2Page() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-sm font-medium mb-6">
          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded">50%</span>
          折扣优惠
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Nano Banana 2
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          全新升级的 AI 图像生成模型，带来更精细、更快速的生成体验
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 rounded-xl border border-border/40 bg-card/40">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold mb-2">极速生成</h3>
            <p className="text-muted-foreground text-sm">平均 3-5 秒即可生成一张高质量图像</p>
          </div>
          <div className="p-6 rounded-xl border border-border/40 bg-card/40">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-lg font-semibold mb-2">精细控制</h3>
            <p className="text-muted-foreground text-sm">支持多种风格和参数微调</p>
          </div>
          <div className="p-6 rounded-xl border border-border/40 bg-card/40">
            <div className="text-3xl mb-3">✨</div>
            <h3 className="text-lg font-semibold mb-2">高清输出</h3>
            <p className="text-muted-foreground text-sm">支持最高 4K 分辨率输出</p>
          </div>
        </div>

        <div className="mt-12 p-6 rounded-xl border border-amber-500/20 bg-amber-500/5">
          <p className="text-lg font-medium text-amber-500 mb-2">限时优惠</p>
          <p className="text-muted-foreground">立即体验 Nano Banana 2，享受 50% 折扣</p>
        </div>
      </div>
    </div>
  );
}