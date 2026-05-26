'use client';

import { useState } from "react";
import {
  ChevronDown, Video, Loader2, AlertCircle, X, Play, Download, Sparkles, Shuffle, Clock, Zap
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Video pricing tiers
const VIDEO_PLANS = [
  {
    id: "basic",
    name: "MY AI Video",
    tier: "基础",
    resolution: "480P-720P",
    duration: "5秒",
    time: "~1分钟",
    credits: "5+ credits",
    badge: null,
  },
  {
    id: "plus",
    name: "MY AI Video Plus",
    tier: "进阶",
    resolution: "480P-720P",
    duration: "4-12秒",
    time: "~2分钟",
    credits: "25+ credits",
    badge: "热门",
  },
  {
    id: "pro",
    name: "MY AI Video Pro",
    tier: "专业",
    resolution: "480P-720P",
    duration: "4-12秒",
    time: "~3分钟",
    credits: "60+ credits",
    badge: "高端",
  },
];

// Random prompt suggestions
const RANDOM_PROMPTS = [
  "A serene sunset over the ocean, waves gently rolling, golden hour lighting, cinematic composition, ultra realistic...",
  "A bustling city street at night, neon signs reflecting on wet pavement, people walking by, cyberpunk atmosphere...",
  "A magical forest with floating particles, soft volumetric light streaming through the canopy, enchanted atmosphere...",
];

interface GeneratedVideo {
  id: string;
  url: string;
  prompt: string;
  plan: string;
  duration: number;
}

export default function VideoGenerator() {
  const { user, tier, tierConfig } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>("plus");
  const [showPlanMenu, setShowPlanMenu] = useState(false);
  const [isSlowMode, setIsSlowMode] = useState(false);

  // Check user status
  const isLoggedIn = !!user;
  const needsWatermark = tierConfig.watermark;

  const handleGenerate = async () => {
    const trimmed = prompt.trim();
    if (!trimmed || generating) return;

    setGenerating(true);
    setError(null);

    const plan = VIDEO_PLANS.find(p => p.id === selectedPlan) || VIDEO_PLANS[1];

    try {
      const res = await fetch("/api/video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: trimmed,
          plan: selectedPlan,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed (" + res.status + ")");
      }

      // Update slow mode status from response
      if (data.isSlowMode !== undefined) {
        setIsSlowMode(data.isSlowMode);
      }

      // Handle pending/development status
      if (data.status === "pending" || !data.url) {
        const newVideo: GeneratedVideo = {
          id: crypto.randomUUID(),
          url: "",
          prompt: trimmed,
          plan: plan.name,
          duration: parseInt(plan.duration) || 5,
        };
        setVideos((prev) => [newVideo, ...prev]);
        return;
      }

      const newVideo: GeneratedVideo = {
        id: crypto.randomUUID(),
        url: data.url || data.output || "",
        prompt: trimmed,
        plan: plan.name,
        duration: parseInt(plan.duration) || 5,
      };

      setVideos((prev) => [newVideo, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败，请重试");
    } finally {
      setGenerating(false);
    }
  };

  const handleRandomPrompt = () => {
    const randomPrompt = RANDOM_PROMPTS[Math.floor(Math.random() * RANDOM_PROMPTS.length)];
    setPrompt(randomPrompt);
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
      a.download = `myai-video-${Date.now()}.mp4`;
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

  const currentPlan = VIDEO_PLANS.find(p => p.id === selectedPlan) || VIDEO_PLANS[1];

  const planLabels = {
    "basic": "MY AI Video (基础)",
    "plus": "MY AI Video Plus (进阶)",
    "pro": "MY AI Video Pro (专业)",
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

              {/* Random prompt suggestions */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 px-2 mt-2 sm:mt-4 pb-3">
                <button
                  onClick={handleRandomPrompt}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full border border-border/30 bg-secondary/10 text-secondary-foreground/60 hover:bg-secondary/30 hover:text-secondary-foreground/80 transition-all flex items-center gap-1"
                >
                  <Shuffle className="w-3 h-3" />
                  随机提示词
                </button>
                <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full border border-border/30 bg-secondary/10 text-secondary-foreground/60">
                  ✨ 默认风格
                </span>
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
                {/* Plan selector */}
                <div className="relative w-full md:w-auto">
                  <button
                    onClick={() => setShowPlanMenu(!showPlanMenu)}
                    className="flex h-10 w-full min-w-[240px] items-center justify-between rounded-full border border-primary/18 bg-primary/10 px-3 text-sm font-medium text-primary outline-none transition-all duration-200 hover:bg-primary/18 md:w-[280px]"
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-black/30">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </span>
                      <span className="min-w-0 truncate">{planLabels[selectedPlan as keyof typeof planLabels]}</span>
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
                  </button>
                  {showPlanMenu && (
                    <div className="absolute z-10 mt-2 w-full rounded-xl border border-border/40 bg-card shadow-lg overflow-hidden">
                      {VIDEO_PLANS.map((plan) => (
                        <button
                          key={plan.id}
                          onClick={() => { setSelectedPlan(plan.id); setShowPlanMenu(false); }}
                          className={`w-full px-4 py-3 text-left hover:bg-secondary/50 ${selectedPlan === plan.id ? "text-primary font-medium bg-primary/5" : "text-foreground"}`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{plan.name}</span>
                                {plan.badge && (
                                  <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                    plan.badge === "热门" ? "bg-amber-500/20 text-amber-400" : "bg-purple-500/20 text-purple-400"
                                  }`}>
                                    {plan.badge}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {plan.resolution} · {plan.duration} · {plan.time}
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">{plan.credits}</span>
                          </div>
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
                        {currentPlan.credits}
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
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-foreground">
                生成结果
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({videos.length} 个)
                </span>
              </h3>
              {/* Login speed badge */}
              {!isLoggedIn && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Zap className="w-3 h-3" />
                  登录以获得更快速度
                </span>
              )}
              {/* Watermark badge for non-members */}
              {needsWatermark && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  已应用水印
                </span>
              )}
              {/* Slow mode badge */}
              {isSlowMode && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  慢速模式
                </span>
              )}
            </div>
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
                    {video.plan} · {video.duration}秒
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