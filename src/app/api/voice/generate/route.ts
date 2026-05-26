import { NextResponse } from "next/server";

// Voice generation using Web Speech API
// For production, replace with a real TTS API like ElevenLabs, Azure, or阿里云语音合成

type VoiceConfig = {
  'zh-CN'?: string;
  'en-US'?: string;
  'ja-JP'?: string;
  'ko-KR'?: string;
  'fr-FR'?: string;
  'de-DE'?: string;
  'es-ES'?: string;
};

// Map frontend voice IDs to Web Speech API voice names
const VOICE_MAP: Record<string, { lang: string; name?: string }> = {
  "zh-CN-xiaoxiao": { lang: "zh-CN", name: "Microsoft YaFei" },
  "zh-CN-yunxi": { lang: "zh-CN", name: "Microsoft Kangkang" },
  "en-US-jenny": { lang: "en-US", name: "Microsoft Zira" },
  "en-US-eric": { lang: "en-US", name: "Microsoft David" },
  "ja-JP-mayu": { lang: "ja-JP", name: "Microsoft Haruka" },
  "ja-JP-kenta": { lang: "ja-JP", name: "Microsoft Keita" },
  "ko-KR-sunhi": { lang: "ko-KR", name: "Microsoft Heami" },
  "fr-FR-denise": { lang: "fr-FR", name: "Microsoft Hortense" },
  "de-DE-katja": { lang: "de-DE", name: "Microsoft Hedda" },
  "es-ES-elena": { lang: "es-ES", name: "Microsoft Helia" },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, voice_id } = body;

    if (!text) {
      return NextResponse.json(
        { error: "请提供配音文本" },
        { status: 400 }
      );
    }

    // Validate voice_id
    const voiceConfig = VOICE_MAP[voice_id || "zh-CN-xiaoxiao"];
    if (!voiceConfig) {
      return NextResponse.json(
        { error: "不支持的音色" },
        { status: 400 }
      );
    }

    // Since we can't generate actual audio files server-side with Web Speech API,
    // return a structured response that tells the frontend to use browser TTS
    // The frontend AIVoice component will handle playback directly
    
    // For now, return a response indicating browser TTS should be used
    // In production, integrate with a real TTS API like:
    // - ElevenLabs API
    // - Azure Speech Services  
    // - 阿里云语音合成 API
    
    return NextResponse.json({
      success: true,
      message: "使用浏览器语音合成",
      use_browser_tts: true,
      voice: voice_id || "zh-CN-xiaoxiao",
      voice_lang: voiceConfig.lang,
      voice_name: voiceConfig.name,
      text: text,
      url: null,
      output: null,
      duration: null,
      note: "浏览器TTS - 前端将直接播放语音"
    });
    
  } catch (error) {
    console.error("Voice generation error:", error);
    return NextResponse.json(
      { error: "服务器错误，请稍后重试" },
      { status: 500 }
    );
  }
}