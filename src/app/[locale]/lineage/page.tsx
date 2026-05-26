export default function LineagePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <span className="text-lg">🌳</span> 创作脉络
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Lineage - 创作历史
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          追溯您的创作历程，查看 AI 生成图像的完整脉络
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="p-6 rounded-xl border border-border/40 bg-card/40 text-left">
            <h3 className="text-lg font-semibold mb-4">功能特点</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>• 创作历史追溯</li>
              <li>• 版本对比查看</li>
              <li>• 一键复用创作</li>
              <li>• 智能分类整理</li>
            </ul>
          </div>
          <div className="p-6 rounded-xl border border-border/40 bg-card/40 text-left">
            <h3 className="text-lg font-semibold mb-4">数据管理</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>• 云端同步存储</li>
              <li>• 批量导出管理</li>
              <li>• 创作标签分类</li>
              <li>• 分享与协作</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}