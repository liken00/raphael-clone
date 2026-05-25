import Link from "next/link";

export default function Footer() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-8">
        <footer>
          <div className="flex flex-col items-center lg:items-start justify-between gap-10 text-center lg:flex-row lg:text-left">
            <div className="flex max-w-96 shrink flex-col items-center justify-between gap-6 lg:items-start">
              <div>
                <div className="flex items-center justify-center gap-2 lg:justify-start">
                  <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    R
                  </div>
                  <p className="text-3xl font-semibold">Raphael AI</p>
                </div>
                <p className="mt-6 text-md text-muted-foreground">
                  Raphael AI 图像生成器：免费无限的 AI 图像生成器，聚合 Nano Banana 2 / Pro、Qwen-Image 和 Seedream 5.0 等顶尖模型。无需注册，无次数限制。
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-x-12 lg:gap-y-0 lg:ml-auto">
              <div className="text-center lg:text-left">
                <div className="mb-6 font-bold">关于</div>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li className="font-medium hover:text-primary">
                    <Link href="/zh#feature">功能</Link>
                  </li>
                  <li className="font-medium hover:text-primary">
                    <Link href="/zh/pricing">定价</Link>
                  </li>
                  <li className="font-medium hover:text-primary">
                    <Link href="/partners">合作伙伴</Link>
                  </li>
                </ul>
              </div>
              <div className="text-center lg:text-left">
                <div className="mb-6 font-bold">工具</div>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li className="font-medium hover:text-primary">
                    <Link href="/zh/ai-image-editor">AI 图像编辑器</Link>
                  </li>
                  <li className="font-medium hover:text-primary">
                    <Link href="/zh/uncrop">扩展图像</Link>
                  </li>
                  <li className="font-medium hover:text-primary">
                    <a href="https://fameo.ai" target="_blank" rel="noopener noreferrer">
                      AI 对口型视频
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col justify-between gap-4 border-t border-border pt-8 text-center text-sm font-medium text-muted-foreground lg:flex-row lg:items-center lg:text-left">
            <p>2025 Raphael AI 版权所有。</p>
            <ul className="flex justify-center gap-4 lg:justify-start">
              <li className="hover:text-primary">
                <Link href="/privacy">隐私政策</Link>
              </li>
              <li className="hover:text-primary">
                <Link href="/tos">服务条款</Link>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
}
