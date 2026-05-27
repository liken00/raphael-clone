import { NextRequest, NextResponse } from "next/server";

const DEMO_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = body;
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "请输入视频描述" }, { status: 400 });
    }
    const demoUrl = DEMO_VIDEOS[Math.floor(Math.random() * DEMO_VIDEOS.length)];
    return NextResponse.json({
      success: true,
      url: demoUrl,
      isDemo: true,
      message: "视频生成成功",
    });
  } catch (error) {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
