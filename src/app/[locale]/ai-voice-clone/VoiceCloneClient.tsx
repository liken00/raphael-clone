'use client';

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Square, Mic, Volume2, Download, AlertCircle, Loader2 } from "lucide-react";

export default function VoiceCloneClient() {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [status, setStatus] = useState("");
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) {
        setVoices(available);
        const zhVoices = available.filter((v: SpeechSynthesisVoice) => v.lang.startsWith("zh"));
        const enVoices = available.filter((v: SpeechSynthesisVoice) => v.lang.startsWith("en"));
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
      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;
      audioChunks.current = [];
      recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) audioChunks.current.push(URL.createObjectURL(e.data));
      };
      recorder.onstop = () => {
        const url = audioChunks.current[0];
        setRecordedUrl(url || null);
        stream.getTracks().forEach(t => t.stop());
      };
      recorder.start();
      setIsRecording(true);
      setStatus("录音中...");
    } catch {
      setStatus("无法访问麦克风");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current?.state === "recording") {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setStatus("录音完成");
    }
  }, []);

  const speak = useCallback(() => {
    if (!text.trim() || !selectedVoice) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = selectedVoice;
    utter.rate = rate;
    utter.pitch = pitch;
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utter);
  }, [text, selectedVoice, rate, pitch]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const downloadAudio = useCallback(() => {
    if (!recordedUrl) return;
    const a = document.createElement("a");
    a.href = recordedUrl;
    a.download = "recording.wav";
    a.click();
  }, [recordedUrl]);

  return (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-2xl border border-border/40 p-6 space-y-4">
        <h3 className="text-lg font-medium">录制声音样本</h3>
        <p className="text-sm text-muted-foreground">点击录制按钮，对着麦克风说话，至少录制5秒</p>
        <div className="flex gap-3">
          {!isRecording ? (
            <button onClick={startRecording} className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors">
              <Mic className="w-4 h-4" /> 开始录制
            </button>
          ) : (
            <button onClick={stopRecording} className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-600 text-white hover:bg-zinc-700 transition-colors">
              <Square className="w-4 h-4" /> 停止
            </button>
          )}
          {recordedUrl && (
            <button onClick={downloadAudio} className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/40 hover:bg-white/5 transition-colors">
              <Download className="w-4 h-4" /> 下载
            </button>
          )}
        </div>
        {isRecording && <div className="flex items-center gap-2 text-red-400"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> 录音中...</div>}
        {status && !isRecording && <p className="text-sm text-muted-foreground">{status}</p>}
      </div>

      <div className="bg-white/5 rounded-2xl border border-border/40 p-6 space-y-4">
        <h3 className="text-lg font-medium">文字转语音</h3>
        <textarea value={text} onChange={e => setText(e.target.value)} rows={4} placeholder="输入文字，点击播放按钮听效果..." className="w-full bg-white/5 border border-border/40 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        <div className="flex gap-2">
          {voices.length > 0 && (
            <select value={selectedVoice?.voiceURI || ""} onChange={e => { const v = voices.find(x => x.voiceURI === e.target.value); if (v) setSelectedVoice(v); }} className="bg-white/5 border border-border/40 rounded-lg px-3 py-2 text-sm">
              {voices.map(v => <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>)}
            </select>
          )}
          <button onClick={isSpeaking ? stopSpeaking : speak} disabled={!text.trim() || !selectedVoice} className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {isSpeaking ? <><Square className="w-4 h-4" /> 停止</> : <><Play className="w-4 h-4" /> 播放</>}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground block mb-1">语速: {rate.toFixed(1)}x</label>
            <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={e => setRate(parseFloat(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-1">音调: {pitch.toFixed(1)}</label>
            <input type="range" min="0.5" max="2" step="0.1" value={pitch} onChange={e => setPitch(parseFloat(e.target.value))} className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
