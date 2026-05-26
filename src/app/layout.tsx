import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MY AI - Free Unlimited AI Image Generator",
  description: "MY AI is a free, unlimited AI image generator aggregating top models like Nano Banana 2 / Pro, Qwen-Image, and Seedream 5.0.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
