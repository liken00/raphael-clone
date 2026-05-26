'use client';

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    const trimmed = prompt.trim();
    if (!trimmed || generating) return;

    setGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: trimmed,
          model_id: "nano-banana-2",
          width: 1024,
          height: 1024,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "生成失败");
      // Handle new images
      if (data.output?.length > 0) {
        // Images handled by parent or state
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Main card */}
      <div className="rounded-2xl border border-zinc-800/50 bg-[#12121a]/80 backdrop-blur-xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-amber-400">图像生成</h2>
        </div>

        {/* Input area */}
        <div className="flex gap-4 mb-6">
          {/* Upload button */}
          <div className="flex-shrink-0">
            <button
              type="button"
              className="w-20 h-20 rounded-2xl border-2 border-dashed border-zinc-700 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all flex items-center justify-center"
              aria-label="上传参考图"
            >
              <Plus className="w-8 h-8 text-zinc-500" />
            </button>
          </div>

          {/* Text input */}
          <div className="flex-1 relative">
            <textarea
              placeholder="描述您想生成的图像..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-20 bg-[#1a1a24] border border-zinc-800 rounded-2xl px-4 py-3 text-white placeholder:text-zinc-600 resize-none focus:outline-none focus:border-amber-500/50 transition-colors"
              rows={3}
            />
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="flex items-center justify-end">
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || generating}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-500/20"
          >
            {generating ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                生成中...
              </div>
            ) : (
              "生成"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}