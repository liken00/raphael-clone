export default function AccountPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">账户设置</h1>
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-border/40 bg-card/40">
            <h2 className="text-lg font-semibold mb-4">基本信息</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">用户名</label>
                <input 
                  type="text" 
                  className="w-full mt-1 px-4 py-2 rounded-lg border border-border bg-background"
                  placeholder="请输入用户名"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">邮箱</label>
                <input 
                  type="email" 
                  className="w-full mt-1 px-4 py-2 rounded-lg border border-border bg-background"
                  placeholder="请输入邮箱"
                />
              </div>
              <button className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90">
                保存更改
              </button>
            </div>
          </div>
          
          <div className="p-6 rounded-xl border border-border/40 bg-card/40">
            <h2 className="text-lg font-semibold mb-4">安全设置</h2>
            <div className="space-y-4">
              <button className="w-full px-4 py-3 rounded-lg border border-border text-left hover:bg-accent transition-colors">
                修改密码
              </button>
              <button className="w-full px-4 py-3 rounded-lg border border-border text-left hover:bg-accent transition-colors">
                绑定第三方账号
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}