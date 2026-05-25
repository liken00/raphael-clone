const testimonials = [
  {
    text: "Raphael AI 图像生成器将我的创作效率提高了 10 倍！图像质量超乎想象，完全满足商业要求。",
    name: "Sophie Miller",
    role: "自由职业设计师",
  },
  {
    text: "借助 AI Image Editor 功能，我可以精确控制每一个细节。Raphael AI 是市场上最强大的 AI 图像生成器！",
    name: "Michael Chen",
    role: "创意总监",
  },
  {
    text: "作为一名电子商务经理，Raphael AI 图像生成器帮助我快速生成产品展示图片，生成效果比其他 AI 工具好得多！",
    name: "Sarah Wang",
    role: "电子商务经理",
  },
];

const testimonials2 = [
  {
    text: "AI Image Editor 让我能够保持品牌风格的一致性。Raphael AI 图像生成器真正理解我的需求。",
    name: "David Liu",
    role: "品牌设计师",
  },
  {
    text: "Raphael AI 图像生成器的速度令人惊叹！几秒钟内生成专业质量的图像，大大缩短了项目周期。",
    name: "Emma Zhang",
    role: "内容创作者",
  },
  {
    text: "它的细节表现无与伦比。作为一名游戏开发者，Raphael AI 图像生成器已成为我们概念设计的首选工具。",
    name: "Kevin Wu",
    role: "游戏概念艺术家",
  },
];

const testimonials3 = [
  {
    text: "我尝试了很多工具，但 Raphael AI 图像生成器及其 AI Image Editor 功能确实改变了游戏规则！",
    name: "Jessica Li",
    role: "数字营销专家",
  },
  {
    text: "Raphael AI 图像生成器让广告创意落地变得非常简单。它生成的图像达到了商业摄影标准。",
    name: "Tom Anderson",
    role: "广告创意总监",
  },
  {
    text: "作为一名独立开发者，Raphael AI 的 API 集成非常友好。它是市场上最好的 AI 图像生成器解决方案！",
    name: "Nina Patel",
    role: "全栈开发人员",
  },
];

function TestimonialCard({ t }: { t: (typeof testimonials)[0] }) {
  return (
    <div className="p-10 rounded-3xl border shadow-lg shadow-primary/10 max-w-xs w-full">
      <div>{t.text}</div>
      <div className="flex items-center gap-2 mt-5">
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
          {t.name.charAt(0)}
        </div>
        <div className="flex flex-col">
          <div className="font-medium tracking-tight leading-5">{t.name}</div>
          <div className="leading-5 opacity-60 tracking-tight">{t.role}</div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="bg-background my-20 relative">
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col items-center justify-center max-w-3xl mx-auto text-center">
          <div className="flex justify-center">
            <div className="border border-border/60 py-1.5 px-5 rounded-full text-xs font-semibold text-foreground/80 bg-background/50 backdrop-blur-sm">
              用户评价
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-6 text-foreground">
            用户对 Raphael AI 的评价
          </h2>
          <p className="text-lg mt-6 text-foreground/80 leading-relaxed">
            看看创作者如何使用 Raphael AI 和 AI Image Editor 提高生产力
          </p>
          <p className="text-sm mt-3 text-foreground/60 font-medium">
            基于 25,017+ 位用户评分，平均 4.9/5 分。
          </p>
        </div>

        <div className="flex justify-center gap-6 mt-10 overflow-hidden max-h-[740px]">
          {/* Column 1 */}
          <div className="flex flex-col gap-6 pb-6 animate-scroll" style={{ animationDuration: "15s" }}>
            {[...testimonials, ...testimonials].map((t, i) => (
              <TestimonialCard key={i} t={t} />
            ))}
          </div>
          {/* Column 2 */}
          <div className="hidden md:flex flex-col gap-6 pb-6 animate-scroll" style={{ animationDuration: "19s" }}>
            {[...testimonials2, ...testimonials2].map((t, i) => (
              <TestimonialCard key={i} t={t} />
            ))}
          </div>
          {/* Column 3 */}
          <div className="hidden lg:flex flex-col gap-6 pb-6 animate-scroll" style={{ animationDuration: "17s" }}>
            {[...testimonials3, ...testimonials3].map((t, i) => (
              <TestimonialCard key={i} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
