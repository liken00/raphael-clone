export default function StudioPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <span className="text-lg">🎨</span> 创意工坊
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Studio - 无限画布
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          在无限画布上释放创意，AI 辅助创作新体验
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="p-6 rounded-xl border border-border/40 bg-card/40 text-left">
            <h3 className="text-lg font-semibold mb-4">核心功能</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>• 无限画布创作</li>
              <li>• AI 辅助图像生成</li>
              <li>• 多图层支持</li>
              <li>• 实时协作</li>
            </ul>
          </div>
          <div className="p-6 rounded-xl border border-border/40 bg-card/40 text-left">
            <h3 className="text-lg font-semibold mb-4">适用场景</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>• 品牌视觉设计</li>
              <li>• 营销素材创作</li>
              <li>• 创意概念探索</li>
              <li>• 团队头脑风暴</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}