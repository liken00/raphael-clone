import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Raphael AI - Free Unlimited AI Image Generator",
  description: "Raphael AI is a free, unlimited AI image generator aggregating top models like Nano Banana 2 / Pro, Qwen-Image, and Seedream 5.0.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
