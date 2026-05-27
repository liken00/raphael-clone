import ModelsClient from "./ModelsClient";

export const metadata = {
  title: "MY AI 模型架构 - 6 大模型 + 智能路由",
  description: "了解 MY AI 平台的全部模型支持：Nano Banana Pro/2.0、Flux 2、Z-Image、Qwen-Image、Seedream 5.0，以及自研 Seedance 2.0 和智能路由系统",
};

export default function ModelsPage() {
  return <ModelsClient />;
}
