import PricingClient from "./PricingClient";

export const metadata = {
  title: "定价 - MY AI",
  description: "MY AI 定价 - 免费无限制 AI 图像生成器。选择适合您的套餐。",
};

export default function PricingPage() {
  return <PricingClient />;
}
