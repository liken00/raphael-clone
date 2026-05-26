'use client';

import { useState } from "react";
import {
  ChevronDown, Mic, Loader2, AlertCircle, X, Download, Volume2, Play
} from "lucide-react";

interface VoiceOption {
  id: string;
  name: string;
  language: string;
  gender: string;
  isPremium: boolean;
}

interface GeneratedAudio {
  id: string;
  url: string;
  text: string;
  voice: string;
  duration?: number;
  browserTts?: boolean;
}

const VOICE_OPTIONS: VoiceOption[] = [
  { id: "zh-CN-xiaoxiao", name: "晓晓", language: "中文", gender: "女", isPremium: false },
  { id: "zh-CN-yunxi", name: "云希", language: "中文", gender: "男", isPremium: false },
  { id: "en-US-jenny", name: "Jenny", language: "英文", gender: "女", isPremium: false },
  { id: "en-US-eric", name: "Eric", language: "英文", gender: "男", isPremium: false },
  { id: "ja-JP-mayu", name: "まゆ", language: "日语", gender: "女", isPremium: true },
  { id: "ja-JP-kenta", name: "健太", language: "日语", gender: "男", isPremium: true },
  { id: "ko-KR-sunhi", name: "선히", language: "韩语", gender: "女", isPremium: true },
  { id: "fr-FR-denise", name: "Denise", language: "法语", gender: "女", isPremium: true },
  { id: "de-DE-katja", name: "Katja", language: "德语", gender: "女", isPremium: true },
  { id: "es-ES-elena", name: "Elena", language: "西班牙语", gender: "女", isPremium: true },
];

export default function AIVoice() {
  const [text, setText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioList, setAudioList] = useState<GeneratedAudio[]>([]);
  const [selectedVoice, setSelectedVoice] = useState(VOICE_OPTIONS[0]);
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);
  const [showLangFilter, setShowLangFilter] = useState(false);
  const [langFilter, setLangFilter] = useState<string>("全部");

  const languages = ["全部", "中文", "英文", "日语", "韩语", "法语", "德语", "西班牙语"];

  const filteredVoices = langFilter === "全部"
    ? VOICE_OPTIONS
    : VOICE_OPTIONS.filter(v => v.language === langFilter);

  const handleGenerate = async () => {
    const trimmed = text.trim();
    if (!trimmed || generating) return;

    setGenerating(true);
    setError(null);

    try {
      // Use browser's Web Speech API for TTS
      const synth = window.speechSynthesis;
      
      if (!synth) {
        throw new Error("浏览器不支持语音合成");
      }

      // Create utterance
      const utterance = new SpeechSynthesisUtterance(trimmed);
      
      // Map voice ID to browser voice
      const voiceIdMap: Record<string, string> = {
        "zh-CN-xiaoxiao": "Microsoft YaFei (zh-CN)",
        "zh-CN-yunxi": "Microsoft Kangkang (zh-CN)",
        "en-US-jenny": "Microsoft Zira (en-US)",
        "en-US-eric": "Microsoft David (en-US)",
        "ja-JP-mayu": "Microsoft Haruka (ja-JP)",
        "ja-JP-kenta": "Microsoft Keita (ja-JP)",
        "ko-KR-sunhi": "Microsoft Heami (ko-KR)",
        "fr-FR-denise": "Microsoft Hortense (fr-FR)",
        "de-DE-katja": "Microsoft Hedda (de-DE)",
        "es-ES-elena": "Microsoft Helia (es-ES)",
      };
      
      const targetVoiceName = voiceIdMap[selectedVoice.id] || voiceIdMap["zh-CN-xiaoxiao"];
      const voices = synth.getVoices();
      const matchedVoice = voices.find(v => v.name === targetVoiceName);
      
      if (matchedVoice) {
        utterance.voice = matchedVoice;
        utterance.lang = matchedVoice.lang;
      }

      // Estimate duration (rough calculation)
      const estimatedDuration = trimmed.length / 5; // ~5 chars per second

      const newAudio: GeneratedAudio = {
        id: crypto.randomUUID(),
        url: "", // Browser TTS doesn't produce downloadable URL
        text: trimmed,
        voice: selectedVoice.name,
        duration: estimatedDuration,
        browserTts: true,
      };

      setAudioList((prev) => [newAudio, ...prev]);

      // Auto-play the generated speech
      synth.speak(utterance);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败，请重试");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (url: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `myai-voice-${Date.now()}.mp3`;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  const clearAll = () => {
    setAudioList([]);
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
                AI 配音生成器
              </h2>
            </div>

            {/* Text input */}
            <div className="rounded-xl px-2 bg-secondary/50 mb-2 sm:mb-3 py-0.5 border border-border/60">
              <div className="rounded-lg relative p-2 sm:p-3">
                <div className="flex items-stretch min-h-[132px] sm:min-h-[148px] gap-2 sm:gap-3">
                  {/* Microphone icon */}
                  <div className="flex-shrink-0 flex items-center self-stretch">
                    <div className="w-[80px] sm:w-[88px] aspect-[3/4] rounded-[16px] border-2 border-dashed border-white/16 bg-white/[0.03] flex items-center justify-center">
                      <Mic className="h-8 w-8 text-white/30" />
                    </div>
                  </div>

                  {/* Text textarea */}
                  <div className="flex-1 min-w-0 flex flex-col justify-start pt-0">
                    <div className="flex items-center justify-end gap-1.5 mb-2 text-xs text-muted-foreground/80">
                      <span>🎙️</span>
                      <span>输入要转换为语音的文本</span>
                    </div>
                    <div className="relative flex-1 flex flex-col">
                      <textarea
                        id="voice-generator-text"
                        placeholder="输入配音文本，例如：欢迎使用MY AI智能体，您的创意伙伴..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full bg-transparent focus:outline-none mb-2 text-foreground resize-none text-base placeholder:text-base placeholder:text-muted-foreground/60 overflow-y-auto min-h-[62px] sm:min-h-[72px] flex-1 pt-0"
                        rows={3}
                      />
                      {!text && (
                        <div className="absolute left-0 top-[0.4em] w-[2px] h-[1.2em] bg-primary/80 animate-cursor-blink" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Info row */}
              <div className="flex flex-wrap items-center gap-2 px-2 mt-2 sm:mt-4 pb-3">
                <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full border border-border/30 bg-secondary/10 text-secondary-foreground/60">
                  🎤 语音合成
                </span>
                <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full border border-border/30 bg-amber-500/10 text-amber-500/80">
                  ⏱️ 3分钟免费额度（登录后）
                </span>
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
                {/* Language filter */}
                <div className="relative w-full md:w-auto">
                  <button
                    onClick={() => setShowLangFilter(!showLangFilter)}
                    className="flex h-10 w-full min-w-[120px] items-center justify-between rounded-full border border-border/40 bg-secondary/10 px-3 text-sm text-secondary-foreground outline-none transition-all duration-200 hover:bg-secondary/30 md:w-[140px]"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span>🌐</span>
                      <span className="min-w-0 truncate">{langFilter}</span>
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
                  </button>
                  {showLangFilter && (
                    <div className="absolute z-10 mt-2 w-full rounded-xl border border-border/40 bg-card shadow-lg overflow-hidden">
                      {languages.map((lang) => (
                        <button
                          key={lang}
                          onClick={() => { setLangFilter(lang); setShowLangFilter(false); }}
                          className={`w-full px-4 py-2.5 text-left text-sm hover:bg-secondary/50 ${langFilter === lang ? "text-primary font-medium" : "text-foreground"}`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Voice selector */}
                <div className="relative w-full md:w-auto">
                  <button
                    onClick={() => setShowVoiceMenu(!showVoiceMenu)}
                    className="flex h-10 w-full min-w-[200px] items-center justify-between rounded-full border border-primary/18 bg-primary/10 px-3 text-sm font-medium text-primary outline-none transition-all duration-200 hover:bg-primary/18 md:w-[224px]"
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-black/30">
                        <Volume2 className="h-4 w-4 text-primary/80" />
                      </span>
                      <span className="min-w-0 truncate">
                        {selectedVoice.name}
                        <span className="text-muted-foreground/60 ml-1">({selectedVoice.language})</span>
                      </span>
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
                  </button>
                  {showVoiceMenu && (
                    <div className="absolute z-10 mt-2 w-full rounded-xl border border-border/40 bg-card shadow-lg overflow-hidden max-h-[300px] overflow-y-auto">
                      {filteredVoices.map((voice) => (
                        <button
                          key={voice.id}
                          onClick={() => { setSelectedVoice(voice); setShowVoiceMenu(false); }}
                          className={`w-full px-4 py-2.5 text-left text-sm hover:bg-secondary/50 flex items-center justify-between ${selectedVoice.id === voice.id ? "text-primary font-medium" : "text-foreground"}`}
                        >
                          <span>
                            {voice.name} <span className="text-muted-foreground/60">({voice.language}·{voice.gender})</span>
                          </span>
                          {voice.isPremium && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500">会员</span>
                          )}
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
                  disabled={audioList.length === 0}
                  className="hidden md:block px-4 h-10 text-sm font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  清除
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={!text.trim() || generating}
                  className="relative w-full md:w-auto px-6 h-10 text-sm font-bold tracking-wide rounded-full text-primary-foreground bg-primary shadow-lg hover:shadow-primary/25 active:scale-95 transition-all duration-200 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      生成中...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      生成配音
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
      {audioList.length > 0 && (
        <div className="w-full mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              生成结果
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({audioList.length} 个)
              </span>
            </h3>
            <button
              onClick={clearAll}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              清除全部
            </button>
          </div>
          <div className="space-y-3">
            {audioList.map((audio) => (
              <div
                key={audio.id}
                className="group relative overflow-hidden rounded-xl border border-border/20 bg-secondary/10 p-4"
              >
                <div className="flex items-center gap-4">
                  {/* Play button */}
                  <button
                    onClick={() => {
                      if (audio.browserTts) {
                        // Re-play using browser TTS
                        const synth = window.speechSynthesis;
                        if (synth) {
                          const utterance = new SpeechSynthesisUtterance(audio.text);
                          const voiceIdMap: Record<string, string> = {
                            "晓晓": "Microsoft YaFei (zh-CN)",
                            "云希": "Microsoft Kangkang (zh-CN)",
                            "Jenny": "Microsoft Zira (en-US)",
                            "Eric": "Microsoft David (en-US)",
                          };
                          const targetVoiceName = voiceIdMap[audio.voice] || voiceIdMap["晓晓"];
                          const voices = synth.getVoices();
                          const matchedVoice = voices.find(v => v.name === targetVoiceName);
                          if (matchedVoice) {
                            utterance.voice = matchedVoice;
                            utterance.lang = matchedVoice.lang;
                          }
                          synth.speak(utterance);
                        }
                      } else if (audio.url) {
                        new Audio(audio.url).play();
                      }
                    }}
                    className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
                  >
                    {(audio.url || audio.browserTts) ? (
                      <Play className="w-5 h-5 text-primary fill-primary" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>

                  {/* Audio info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/20 text-primary">
                        {audio.voice}
                      </span>
                      {audio.duration && (
                        <span className="text-xs text-muted-foreground">
                          {audio.duration.toFixed(1)}秒
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {audio.text}
                    </p>
                  </div>

                  {/* Download */}
                  {audio.url && (
                    <button
                      onClick={() => handleDownload(audio.url)}
                      className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-secondary/70 transition-colors"
                    >
                      <Download className="w-4 h-4 text-foreground/70" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}