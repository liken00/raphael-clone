import VideoGenerator from "@/components/features/VideoGenerator";

export default function AIVideoGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <span className="text-lg">🎬</span> NEW
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          AI 视频生成器
        </h1>
        <p className="text-xl text-muted-foreground">
          将文字描述转换为视频，或使用图像生成动态视频
        </p>
      </div>
      <VideoGenerator />
    </div>
  );
}