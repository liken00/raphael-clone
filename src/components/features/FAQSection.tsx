const faqs = [
  { q: "什么是 Raphael AI 及其工作原理？", a: "Raphael AI 图像生成器是一款完全免费的 AI 图像生成器，内置智能多模型路由系统。您无需注册，也没有生成次数限制，只需输入文字描述即可生成高质量图像。" },
  { q: "Raphael AI 真的免费使用吗？", a: "是的，Raphael AI 图像生成器完全免费使用！我们致力于成为世界上最大、最强大的免费 AI 图像生成器。没有隐藏费用、无需信用卡，也没有生成次数限制。" },
  { q: "Raphael AI 与其他 AI 图像生成器有何不同？", a: "Raphael AI 图像生成器提供无生成次数限制的免费多模型智能路由能力。我们提供卓越的图像质量、快速的生成速度和完整的隐私保护，且无需任何费用或注册要求。" },
  { q: "我需要创建账户才能使用 Raphael AI 吗？", a: "无需账户。Raphael AI 图像生成器允许您访问 raphael.app 并立即开始生成图像。我们相信让每个人都能无障碍地使用人工智能。" },
  { q: "我可以使用 Raphael AI 创建哪些类型的图像？", a: "Raphael AI 图像生成器允许您创建各种图像，包括逼真的场景、艺术插图、数字艺术、动漫风格图像等。我们的智能路由器会为每个提示选择最佳模型。" },
  { q: "Raphael AI 如何保护我的隐私？", a: "我们采用最小化数据收集原则：未登录用户的请求通常仅作临时处理；登录后仅保存提供账户、历史记录、订阅和安全能力所必需的信息。" },
  { q: "Raphael 的自研模型由什么支持？", a: "Raphael 的自研图片模型由 Seedream 5.0 提供支持，Raphael 的自研视频模型由 Seedance 2.0 提供支持。此外，Raphael 也支持业内其他先进的画图模型，例如 Nano Banana。" },
  { q: "我可以使用生成的图像进行商业用途吗？", a: "是的，您拥有使用 Raphael AI 生成的图像的权利。您可以将它们用于个人和商业目的，使其成为创作者和企业的理想选择。" },
  { q: "Raphael AI 的下一步是什么？", a: "我们通过对 AI 模型和用户界面的定期更新不断改进我们的服务。未来计划包括移动应用程序和其他创意功能，同时保持我们完全免费的承诺。" },
];

export default function FAQSection() {
  return (
    <section id="常见问题" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium border-transparent bg-primary text-primary-foreground">
            常见问题
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            常见问题
          </h2>
          <p className="mt-6 text-base font-medium text-foreground/70">
            还有其他问题吗？请通过 support@raphael.app 联系我们
          </p>
        </div>
        <div className="mx-auto mt-14 grid gap-8 md:grid-cols-2 md:gap-12">
          {faqs.map((faq, i) => (
            <div key={i} className="flex gap-4">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary font-mono text-xs text-primary">
                {i + 1}
              </span>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-foreground">{faq.q}</h3>
                </div>
                <p className="text-base text-foreground/70 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
