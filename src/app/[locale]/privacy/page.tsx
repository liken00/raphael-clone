export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8">隐私政策</h1>
      <div className="prose prose-invert max-w-none space-y-6 text-foreground/80">
        <p>最后更新：2026 年 5 月</p>

        <h2 className="text-xl font-semibold text-foreground mt-8">1. 信息收集</h2>
        <p>我们采用最小化数据收集原则：</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>未登录用户：</strong>您的图像生成请求仅作临时处理，不会持久保存。</li>
          <li><strong>登录用户：</strong>我们仅保存提供账户、历史记录、订阅和安全能力所必需的信息，包括邮箱地址和基本账户信息。</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-8">2. 信息使用</h2>
        <p>我们收集的信息仅用于：</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>提供和维护 MY AI 图像生成服务</li>
          <li>处理您的订阅和付款</li>
          <li>发送服务相关的通知</li>
          <li>改善服务质量和用户体验</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-8">3. 数据安全</h2>
        <p>我们采取合理的技术措施保护您的个人信息免遭未经授权的访问、修改、披露或销毁。</p>

        <h2 className="text-xl font-semibold text-foreground mt-8">4. 第三方服务</h2>
        <p>我们可能使用第三方服务来处理支付（如 Stripe）和发送邮件。这些服务有各自的隐私政策。</p>

        <h2 className="text-xl font-semibold text-foreground mt-8">5. 联系我们</h2>
        <p>如果您对隐私政策有任何疑问，请通过 support@myai.app 联系我们。</p>
      </div>
    </div>
  );
}