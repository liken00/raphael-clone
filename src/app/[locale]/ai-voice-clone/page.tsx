import VoiceCloneClient from "./VoiceCloneClient";

export const metadata = {
  title: "AI 声音克隆 - MY AI",
  description: "免费在线 AI 声音克隆工具，录制声音样本并生成自然语音。支持文字转语音、语音合成。",
};

export default function AIVoiceClonePage() {
  return <VoiceCloneClient />;
}
