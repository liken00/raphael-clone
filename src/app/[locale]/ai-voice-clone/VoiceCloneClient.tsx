'use client';

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Square, Mic, Volume2, Download, AlertCircle, Loader2 } from "lucide-react";

export default function VoiceCloneClient() {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [status, setStatus] = useState("");
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const audioRef = useRef(null);

  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) {
        setVoices(available);
        const zhVoices = available.filter(v => v.lang.startsWith("zh"));
        const enVoices = available.filter(v => v.lang.startsWith("en"));
        setSelectedVoice(zhVoices[0] || enVoices[0] || available[0]);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedUrl(url);
        stream.getTracks().forEach(t => t.stop());
        setStatus("录音完成");
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setStatus("正在录音...");
    } catch (err) {
      setStatus("无法访问麦克风: " + err.message);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  }, []);

  const speakText = useCallback(() => {
    if (!text.trim()) { setStatus("请输入要朗读的文字"); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.onstart = () => { setIsSpeaking(true); setStatus("正在朗读..."); };
    utterance.onend = () => { setIsSpeaking(false); setStatus("朗读完成"); };
    utterance.onerror = () => { setIsSpeaking(false); setStatus("朗读出错"); };
    window.speechSynthesis.speak(utterance);
  }, [text, selectedVoice, rate, pitch]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setStatus("已停止");
  }, []);

  const clearRecording = useCallback(() => {
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    setRecordedUrl(null);
    setStatus("");
  }, [recordedUrl]);

  return (
    <div className="container mx-auto px-4 py-12 sm:py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-3 py-1 text-xs font-medium bg-primary/5 text-primary mb-6">
            <span>🎤</span> 免费 · 无需 API
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">AI 声音克隆 & 语音合成</h1>
          <p className="mt-4 text-lg text-foreground/70">使用浏览器内置语音引擎，完全免费、无需注册、无需 API Key</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-border/40 bg-card p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Mic className="w-5 h-5 text-primary" /> 录制声音样本</h2>
            <p className="text-sm text-foreground/60 mb-4">录制一段声音，用于克隆样本。点击录制后授权麦克风权限。</p>
            <div className="flex gap-3 mb-4">
              {!isRecording ? (
                <button onClick={startRecording} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all">
                  <Mic className="w-4 h-4" /> 开始录制
                </button>
              ) : (
                <button onClick={stopRecording} className="inline-flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition-all animate-pulse">
                  <Square className="w-4 h-4" /> 停止录制
                </button>
              )}
              {recordedUrl && (
                <button onClick={clearRecording} className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary/80 transition-all">
                  清除录音
                </button>
              )}
            </div>
            {recordedUrl && (
              <div className="mt-2">
                <audio ref={audioRef} src={recordedUrl} controls className="w-full h-10 rounded-lg" />
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border/40 bg-card p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Volume2 className="w-5 h-5 text-primary" /> 文字转语音</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground/70 mb-1">选择声音</label>
              <select
                value={selectedVoice ? selectedVoice.name : ""}
                onChange={(e) => {
                  const v = voices.find(v => v.name === e.target.value);
                  if (v) setSelectedVoice(v);
                }}
                className="w-full rounded-lg border border-border/40 bg-background px-3 py-2 text-sm text-foreground"
              >
                {voices.map((v) => (
                  <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1">语速: {rate}x</label>
                <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1">音调: {pitch}</label>
                <input type="range" min="0.5" max="2" step="0.1" value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))} className="w-full" />
              </div>
            </div>
            <div className="mb-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="输入要转换为语音的文字..."
                className="w-full h-24 rounded-lg border border-border/40 bg-background px-3 py-2 text-sm text-foreground resize-none"
              />
            </div>
            <div className="flex gap-3">
              {!isSpeaking ? (
                <button onClick={speakText} disabled={!text.trim()} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50">
                  <Play className="w-4 h-4" /> 朗读
                </button>
              ) : (
                <button onClick={stopSpeaking} className="inline-flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition-all">
                  <Square className="w-4 h-4" /> 停止
                </button>
              )}
            </div>
          </div>
        </div>

        {status && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
            {isRecording ? <Loader2 className="w-4 h-4 animate-spin" /> : isSpeaking ? <Volume2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{status}</span>
          </div>
        )}

        <div className="mt-12 rounded-2xl border border-border/40 bg-card p-6">
          <h2 className="text-lg font-bold mb-4">可用的浏览器语音</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {voices.map((v) => (
              <div key={v.name} className="rounded-lg border border-border/20 bg-background/50 p-3 text-sm">
                <p className="font-medium text-foreground">{v.name}</p>
                <p className="text-xs text-foreground/50">{v.lang} {v.default ? "(默认)" : ""}</p>
              </div>
            ))}
            {voices.length === 0 && <p className="text-sm text-foreground/50">正在加载语音列表...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
