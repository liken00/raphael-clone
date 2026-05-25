'use client';

import { useState, useRef } from "react";
import {
  Plus, ChevronDown, Zap, Download, RefreshCw,
  Loader2, ImageIcon, AlertCircle, X
} from "lucide-react";
import { RESOLUTION_OPTIONS, Tier, DEFAULT_TIER, TIERS } from "@/lib/tiers";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  model: string;
}

interface ResolutionOption {
  width: number;
  height: number;
  label: string;
  tiers: Tier[];
}

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [selectedModel, setSelectedModel] = useState("flux-schnell");
  const [resolution, setResolution] = useState<ResolutionOption>(RESOLUTION_OPTIONS[0]);
  const promptRef = useRef<HTMLTextAreaElement>(null);

  // Mock user tier - replace with actual auth check
  const userTier: Tier = DEFAULT_TIER;

  const handleGenerate = async () => {
    const trimmed = prompt.trim();
    if (!trimmed || generating) return;

    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: trimmed,
          model_id: selectedModel,
          width: resolution.width,
          height: resolution.height,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      if (!data.output || data.output.length === 0) {
        throw new Error("No image was generated");
      }

      const newImages: GeneratedImage[] = data.output.map((url: string) => ({
        id: crypto.randomUUID(),
        url,
        prompt: trimmed,
        model: data.model || selectedModel,
      }));

      setImages((prev) => [...newImages, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败，请重试");
    } finally {
      setGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleDownload = async (url: string, index: number) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `raphael-ai-${Date.now()}-${index}.png`;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  const clearAll = () => {
    setImages([]);
    setError(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="w-full mx-auto">
          {/* Generator Card */}
          <div className="border border-border/40 bg-card/40 rounded-xl px-3 sm:px-6 py-3">
            <div className="mb-2.5 sm:mb-3">
              <h2 className="text-[1.7rem] leading-none sm:text-[2rem] font-serif font-semibold text-foreground">
                AI 图像生成器
              </h2>
            </div>

            {/* Upload area + Prompt input */}
            <div className="rounded-xl px-2 bg-secondary/50 mb-2 sm:mb-3 py-0.5 border border-border/60">
              <div className="rounded-lg relative p-2 sm:p-3">
                <div className="flex items-stretch min-h-[132px] sm:min-h-[148px] gap-2 sm:gap-3">
                  {/* Upload reference image button */}
                  <div className="flex-shrink-0 flex items-center self-stretch">
                    <div className="relative group self-start w-[80px] sm:w-[88px] aspect-[3/4]">
                      <button
                        type="button"
                        className="absolute inset-0 focus:outline-none focus:ring-0"
                        aria-label="上传参考图"
                      >
                        <div className="absolute inset-0 overflow-hidden rounded-[16px] border-2 border-dashed border-white/16 bg-white/[0.03] hover:-translate-y-1 hover:border-primary/45 hover:bg-primary/5 transition-all duration-200 flex items-center justify-center">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary/85 group-hover:scale-110 transition-all duration-200">
                            <Plus className="h-4 w-4" />
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Prompt textarea */}
                  <div className="flex-1 min-w-0 flex flex-col justify-start pt-0">
                    <div className="flex items-center justify-end gap-1.5 mb-2 text-xs text-muted-foreground/80">
                      <span>🇬🇧</span>
                      <span>为获得最佳效果，请输入英文提示词</span>
                    </div>
                    <div className="relative flex-1 flex flex-col">
                      <textarea
                        ref={promptRef}
                        id="image-generator-prompt"
                        placeholder="描述您想生成的图像..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-transparent focus:outline-none mb-2 text-foreground resize-none text-base placeholder:text-base placeholder:text-muted-foreground/60 overflow-y-auto min-h-[62px] sm:min-h-[72px] flex-1 pt-0"
                        rows={3}
                      />
                      {!prompt && (
                        <div className="absolute left-0 top-[0.4em] w-[2px] h-[1.2em] bg-primary/80 animate-cursor-blink" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Options row */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 px-2 mt-2 sm:mt-4 pb-3">
                {/* Resolution selector */}
                <div className="relative group">
                  <button className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full border border-border/40 bg-secondary/10 text-secondary-foreground/80 hover:bg-secondary/90 flex items-center gap-1">
                    <span className="inline-flex w-5 h-5 items-center justify-center">
                      <span className="border-[1.5px] border-current rounded-[3px] bg-foreground/10 w-4 h-4" />
                    </span>
                    {resolution.label}
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </button>
                  <div className="absolute top-full left-0 mt-1 py-1 rounded-lg border border-border/60 bg-card/95 backdrop-blur-sm shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 min-w-[100px]">
                    {RESOLUTION_OPTIONS.filter(opt => opt.tiers.includes(userTier)).map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => setResolution(opt)}
                        className={`w-full px-3 py-1.5 text-xs text-left hover:bg-primary/20 transition-colors ${resolution.label === opt.label ? 'text-primary bg-primary/10' : 'text-foreground/80'}`}
                      >
                        {opt.label}
                        {opt.label === '720P' && ' (游客)'}
                        {opt.label === '1080P' && ' (免费)'}
                        {opt.label === '4K' && ' (会员)'}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full border border-border/30 bg-secondary/10 text-secondary-foreground/60 hover:bg-secondary/90">
                  无风格
                </button>
                <button className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full border border-border/30 bg-secondary/10 text-secondary-foreground/60 hover:bg-secondary/90">
                  无色彩
                </button>
                <button className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full border border-border/30 bg-secondary/10 text-secondary-foreground/60 hover:bg-secondary/90">
                  无光照
                </button>
                <button className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full border border-border/30 bg-secondary/10 text-secondary-foreground/60 hover:bg-secondary/90">
                  无构图
                </button>
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
                {/* Model selector */}
                <div className="relative w-full md:w-auto">
                  <button className="flex h-10 w-full min-w-[208px] items-center justify-between rounded-full border border-primary/18 bg-primary/10 px-3 text-sm font-medium text-primary outline-none transition-all duration-200 hover:bg-primary/18 md:w-[224px]">
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-black/30">
                        <span className="text-[10px] font-bold text-primary">R</span>
                      </span>
                      <span className="min-w-0 truncate">Raphael Basic</span>
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
                  </button>
                </div>

                {/* Toggles */}
                <div className="flex items-center justify-between md:justify-start gap-3 md:gap-6 ps-1 w-full md:w-auto">
                  <button className="flex items-center gap-2 text-sm">
                    <span className="w-10 h-5 rounded-full p-0.5 bg-secondary">
                      <span className="block w-4 h-4 rounded-full bg-background translate-x-0" />
                    </span>
                    <span className="text-sm flex items-center gap-1 font-medium text-muted-foreground/80">
                      <Zap className="w-3.5 h-3.5" />
                      快速模式
                    </span>
                  </button>
                  <button className="flex items-center gap-2 text-sm">
                    <span className="w-9 h-5 rounded-full p-0.5 bg-secondary">
                      <span className="block w-4 h-4 rounded-full bg-background translate-x-0" />
                    </span>
                    <span className="text-sm text-muted-foreground/80">负面提示词</span>
                  </button>
                </div>
              </div>

              {/* Generate button */}
              <div className="flex items-center gap-2 w-full md:w-auto md:gap-3">
                <button
                  onClick={clearAll}
                  disabled={images.length === 0}
                  className="hidden md:block px-4 h-10 text-sm font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  清除
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || generating}
                  className="relative w-full md:w-auto px-6 h-10 text-sm font-bold tracking-wide rounded-full text-primary-foreground bg-primary shadow-lg hover:shadow-primary/25 active:scale-95 transition-all duration-200 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      生成中...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      生成
                      <span className="inline-flex px-1.5 py-0.5 rounded-full text-xs font-medium bg-amber-500 text-white">
                        Free
                      </span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="flex-1">{error}</span>
              <button onClick={() => setError(null)} className="shrink-0 hover:text-red-300">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Grid */}
      {images.length > 0 && (
        <div className="w-full mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              生成结果
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({images.length} 张)
              </span>
            </h3>
            <button
              onClick={clearAll}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              清除全部
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, i) => (
              <div
                key={img.id}
                className="group relative overflow-hidden rounded-xl border border-border/20 bg-secondary/10"
              >
                <div className="aspect-square relative">
                  <img
                    src={img.url}
                    alt={img.prompt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/512x512/2a1f15/c08b52?text=Error`;
                    }}
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
                    <p className="text-white text-xs line-clamp-2 mb-2 leading-relaxed">
                      {img.prompt}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(img.url, i)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium hover:bg-white/30 transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        下载
                      </button>
                      <button
                        onClick={() => window.open(img.url, "_blank")}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium hover:bg-white/30 transition-colors"
                      >
                        <ImageIcon className="w-3 h-3" />
                        查看
                      </button>
                    </div>
                  </div>
                </div>
                {/* Model badge */}
                <div className="absolute top-2 left-2">
                  <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/50 text-white/80 backdrop-blur-sm">
                    {img.model}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}