export default function StatsSection() {
  return (
    <section id="统计数据" className="py-16">
      <div className="container mx-auto px-4 flex flex-col items-center gap-4">
        <h2 className="text-center text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          深受数百万人信赖
        </h2>
        <p className="text-center text-foreground/70 lg:text-lg max-w-2xl">
          加入全球最大的免费 AI 图像生成器社区
        </p>
        <div className="w-full grid gap-12 md:grid-cols-3 mt-12">
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold uppercase tracking-widest text-foreground/60 mb-2">
              活跃用户
            </span>
            <span className="text-6xl md:text-7xl font-bold text-primary tracking-tighter">
              3M+
            </span>
            <span className="text-base mt-3 text-foreground/70 font-medium">
              月活跃用户
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold uppercase tracking-widest text-foreground/60 mb-2">
              创建的图像
            </span>
            <span className="text-6xl md:text-7xl font-bold text-primary tracking-tighter">
              1,530
            </span>
            <span className="text-base mt-3 text-foreground/70 font-medium">
              每分钟生成的图像数
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold uppercase tracking-widest text-foreground/60 mb-2">
              用户评分
            </span>
            <span className="text-6xl md:text-7xl font-bold text-primary tracking-tighter">
              4.9
            </span>
            <span className="text-base mt-3 text-foreground/70 font-medium">
              平均图像质量得分
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
