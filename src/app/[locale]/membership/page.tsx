export default function MembershipPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">升级会员</h1>
        <p className="text-xl text-muted-foreground mb-12">
          解锁更多高级功能，享受无限生成
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-border/40 bg-card/40">
            <div className="text-sm text-muted-foreground mb-2">免费版</div>
            <div className="text-3xl font-bold mb-4">¥0</div>
            <ul className="space-y-2 text-sm text-muted-foreground text-left mb-6">
              <li>✓ 720P 生成</li>
              <li>✓ 每日 10 次</li>
              <li>✗ 水印</li>
            </ul>
            <button className="w-full py-2 rounded-lg border border-border hover:bg-accent transition-colors">
              当前方案
            </button>
          </div>
          
          <div className="p-6 rounded-xl border-2 border-primary bg-primary/5 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
              推荐
            </div>
            <div className="text-sm text-primary mb-2">专业版</div>
            <div className="text-3xl font-bold mb-4">¥99<span className="text-sm font-normal">/月</span></div>
            <ul className="space-y-2 text-sm text-muted-foreground text-left mb-6">
              <li>✓ 4K 生成</li>
              <li>✓ 无限次数</li>
              <li>✓ 无水印</li>
              <li>✓ 优先队列</li>
            </ul>
            <button className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90">
              立即升级
            </button>
          </div>
          
          <div className="p-6 rounded-xl border border-border/40 bg-card/40">
            <div className="text-sm text-muted-foreground mb-2">企业版</div>
            <div className="text-3xl font-bold mb-4">¥399<span className="text-sm font-normal">/月</span></div>
            <ul className="space-y-2 text-sm text-muted-foreground text-left mb-6">
              <li>✓ 所有专业版功能</li>
              <li>✓ API 访问</li>
              <li>✓ 专属客服</li>
              <li>✓ 批量处理</li>
            </ul>
            <button className="w-full py-2 rounded-lg border border-border hover:bg-accent transition-colors">
              联系我们
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}