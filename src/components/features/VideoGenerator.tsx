'use client';

import { useState } from "react";
import {
  ChevronDown, Video, Loader2, AlertCircle, X, Play, Download
} from "lucide-react";

interface GeneratedVideo {
  id: string;
  url: string;
  prompt: string;
  resolution: string;
  duration: number;
}

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [resolution, setResolution] = useState<"720p" | "1080p" | "4k">("720p");
  const [duration, setDuration] = useState<10 | 15>(10);
  const [showResolutionMenu, setShowResolutionMenu] = useState(false);
  const [showDurationMenu, setShowDurationMenu] = useState(false);

  const handleGenerate = async () => {
    const trimmed = prompt.trim();
    if (!trimmed || generating) return;

    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: trimmed,
          resolution,
          duration,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      const newVideo: GeneratedVideo = {
        id: crypto.randomUUID(),
        url: data.url || data.output || "",
        prompt: trimmed,
        resolution,
        duration,
      };

      setVideos((prev) => [newVideo, ...prev]);
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

  const handleDownload = async (url: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `raphael-video-${Date.now()}.mp4`;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  const clearAll = () => {
    setVideos([]);
    setError(null);
  };

  const resolutionLabels = {
    "720p": "720P (未登录)",
    "1080p": "1080P (登录)",
    "4k": "4K (会员)",
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="w-full mx-auto">
          {/* Generator Card */}
          <div className="border border-border/40 bg-card/40 rounded-xl px-3 sm:px-6 py-3">
            <div className="mb-2.5 sm:mb-3">
              <h2 className="text-[1.7rem] leading-none sm:text-[2rem] font-serif font-semibold text-foreground">
                AI 视频生成器
              </h2>
            </div>

            {/* Prompt input */}
            <div className="rounded-xl px-2 bg-secondary/50 mb-2 sm:mb-3 py-0.5 border border-border/60">
              <div className="rounded-lg relative p-2 sm:p-3">
                <div className="flex items-stretch min-h-[132px] sm:min-h-[148px] gap-2 sm:gap-3">
                  {/* Video icon placeholder */}
                  <div className="flex-shrink-0 flex items-center self-stretch">
                    <div className="w-[80px] sm:w-[88px] aspect-[3/4] rounded-[16px] border-2 border-dashed border-white/16 bg-white/[0.03] flex items-center justify-center">
                      <Video className="h-8 w-8 text-white/30" />
                    </div>
                  </div>

                  {/* Prompt textarea */}
                  <div className="flex-1 min-w-0 flex flex-col justify-start pt-0">
                    <div className="flex items-center justify-end gap-1.5 mb-2 text-xs text-muted-foreground/80">
                      <span>🎬</span>
                      <span>描述您想生成的视频场景</span>
                    </div>
                    <div className="relative flex-1 flex flex-col">
                      <textarea
                        id="video-generator-prompt"
                        placeholder="描述视频场景：例如，一只在海边奔跑的金毛犬，夕阳西下..."
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
                <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full border border-border/30 bg-secondary/10 text-secondary-foreground/60">
                  🎥 视频生成
                </span>
                <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full border border-border/30 bg-secondary/10 text-secondary-foreground/60">
                  ✨ 默认风格
                </span>
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
                {/* Resolution selector */}
                <div className="relative w-full md:w-auto">
                  <button
                    onClick={() => setShowResolutionMenu(!showResolutionMenu)}
                    className="flex h-10 w-full min-w-[208px] items-center justify-between rounded-full border border-primary/18 bg-primary/10 px-3 text-sm font-medium text-primary outline-none transition-all duration-200 hover:bg-primary/18 md:w-[224px]"
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-black/30">
                        <span className="text-[10px] font-bold text-primary">R</span>
                      </span>
                      <span className="min-w-0 truncate">{resolutionLabels[resolution]}</span>
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
                  </button>
                  {showResolutionMenu && (
                    <div className="absolute z-10 mt-2 w-full rounded-xl border border-border/40 bg-card shadow-lg overflow-hidden">
                      {(["720p", "1080p", "4k"] as const).map((res) => (
                        <button
                          key={res}
                          onClick={() => { setResolution(res); setShowResolutionMenu(false); }}
                          className={`w-full px-4 py-2.5 text-left text-sm hover:bg-secondary/50 ${resolution === res ? "text-primary font-medium" : "text-foreground"}`}
                        >
                          {resolutionLabels[res]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Duration selector */}
                <div className="relative w-full md:w-auto">
                  <button
                    onClick={() => setShowDurationMenu(!showDurationMenu)}
                    className="flex h-10 w-full min-w-[160px] items-center justify-between rounded-full border border-border/40 bg-secondary/10 px-3 text-sm text-secondary-foreground outline-none transition-all duration-200 hover:bg-secondary/30 md:w-[180px]"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span>⏱️</span>
                      <span className="min-w-0 truncate">{duration}秒</span>
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
                  </button>
                  {showDurationMenu && (
                    <div className="absolute z-10 mt-2 w-full rounded-xl border border-border/40 bg-card shadow-lg overflow-hidden">
                      {([10, 15] as const).map((dur) => (
                        <button
                          key={dur}
                          onClick={() => { setDuration(dur); setShowDurationMenu(false); }}
                          className={`w-full px-4 py-2.5 text-left text-sm hover:bg-secondary/50 ${duration === dur ? "text-primary font-medium" : "text-foreground"}`}
                        >
                          {dur}秒 {dur === 10 ? "(未登录)" : "(登录)"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Generate button */}
              <div className="flex items-center gap-2 w-full md:w-auto md:gap-3">
                <button
                  onClick={clearAll}
                  disabled={videos.length === 0}
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
                      生成视频
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

      {/* Results */}
      {videos.length > 0 && (
        <div className="w-full mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              生成结果
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({videos.length} 个)
              </span>
            </h3>
            <button
              onClick={clearAll}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              清除全部
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video) => (
              <div
                key={video.id}
                className="group relative overflow-hidden rounded-xl border border-border/20 bg-secondary/10"
              >
                <div className="aspect-video relative bg-black/50">
                  {video.url ? (
                    <video
                      src={video.url}
                      controls
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLVideoElement).poster = "";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="h-12 w-12 text-white/30" />
                    </div>
                  )}
                </div>
                {/* Info overlay */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                  <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/50 text-white/80 backdrop-blur-sm">
                    {video.resolution} • {video.duration}秒
                  </span>
                  {video.url && (
                    <button
                      onClick={() => handleDownload(video.url)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 text-white text-xs font-medium backdrop-blur-sm hover:bg-black/70 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  )}
                </div>
                {/* Prompt */}
                <div className="p-3 border-t border-border/20">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {video.prompt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}