export default function BackgroundRemoverPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <span className="text-lg">✂️</span> 一键抠图
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          移除背景
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          AI 智能识别，一键去除图像背景
        </p>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-border/40 bg-card/40">
            <h3 className="text-lg font-semibold mb-3">支持场景</h3>
            <ul className="space-y-2 text-sm text-muted-foreground text-left">
              <li>• 产品照片抠图</li>
              <li>• 人像背景分离</li>
              <li>• 证件照处理</li>
              <li>• 电商图片制作</li>
            </ul>
          </div>
          <div className="p-6 rounded-xl border border-border/40 bg-card/40">
            <h3 className="text-lg font-semibold mb-3">输出格式</h3>
            <ul className="space-y-2 text-sm text-muted-foreground text-left">
              <li>• PNG (透明背景)</li>
              <li>• JPG (白色背景)</li>
              <li>• WebP</li>
              <li>• 多种尺寸选项</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}