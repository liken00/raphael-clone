export default function TosPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8">服务条款</h1>
      <div className="prose prose-invert max-w-none space-y-6 text-foreground/80">
        <p>最后更新：2026 年 5 月</p>

        <h2 className="text-xl font-semibold text-foreground mt-8">1. 服务说明</h2>
        <p>MY AI 图像生成器是一款基于 AI 技术的在线图像生成服务。我们致力于为用户提供免费、高质量的 AI 图像生成体验。</p>

        <h2 className="text-xl font-semibold text-foreground mt-8">2. 用户责任</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>您不得使用本服务生成违法、侵权、色情或有害内容</li>
          <li>您不得滥用本服务，包括但不限于自动化攻击、逆向工程等</li>
          <li>您对使用本服务生成的内容负全部责任</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-8">3. 知识产权</h2>
        <p>您拥有使用 MY AI 生成的图像的完全权利，可用于个人和商业目的。但您不得声称 AI 生成内容的版权归属。</p>

        <h2 className="text-xl font-semibold text-foreground mt-8">4. 订阅和退款</h2>
        <p>付费订阅服务采用按月/年自动续费模式。如果您对服务不满意，可以在购买后 7 天内联系 support@myai.app 申请全额退款。</p>

        <h2 className="text-xl font-semibold text-foreground mt-8">5. 免责声明</h2>
        <p>本服务按"现状"提供，不提供任何明示或暗示的保证。我们保留随时修改或终止服务的权利。</p>

        <h2 className="text-xl font-semibold text-foreground mt-8">6. 联系我们</h2>
        <p>如有任何问题，请通过 support@myai.app 联系我们。</p>
      </div>
    </div>
  );
}