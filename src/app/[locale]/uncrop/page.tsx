export default function UncropPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <span className="text-lg">🔍</span> AI 扩展
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          扩展图像
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          智能扩展图像边界，补充缺失内容
        </p>
        
        <div className="mt-12 p-8 rounded-xl border border-border/40 bg-card/40">
          <p className="text-muted-foreground mb-4">上传您的图像，选择扩展方向和比例</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="px-4 py-2 rounded-lg border border-border/40 bg-secondary/20 text-sm">
              16:9 → 21:9
            </div>
            <div className="px-4 py-2 rounded-lg border border-border/40 bg-secondary/20 text-sm">
              1:1 → 4:3
            </div>
            <div className="px-4 py-2 rounded-lg border border-border/40 bg-secondary/20 text-sm">
              自由扩展
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}