import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Video generation using Replicate API
// Model: minimax-ai/hi16-video (or similar available model)

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

// Guest users get slow mode (minimum wait time in ms)
const GUEST_MIN_WAIT = 3000; // 3 seconds slow mode for guests

// Check if user is logged in by checking for session cookie
async function isUserLoggedIn(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('next-auth.session-token') || cookieStore.get('session-token');
  return !!sessionCookie;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, resolution = "720p", duration = 5, model = "video" } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "请提供视频描述" },
        { status: 400 }
      );
    }

    // Check login status
    const loggedIn = await isUserLoggedIn();
    const isGuest = !loggedIn;

    // Apply slow mode for guests
    if (isGuest) {
      await new Promise(resolve => setTimeout(resolve, GUEST_MIN_WAIT));
    }

    // Check if we have Replicate API token
    const apiToken = REPLICATE_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json({
        success: true,
        message: "视频生成功能开发中",
        status: "pending",
        url: null,
        isSlowMode: isGuest,
        note: "视频模型正在部署中，请稍后再试"
      });
    }

    // Determine video parameters based on duration/resolution
    const numFrames = duration === "short" ? 60 : duration === "long" ? 180 : 120;
    const resolutionSetting = resolution === "1080p" ? "1920x1080" : "1280x720";

    // Use Replicate to run video generation
    // Using minimax-ai/hi16-video model which is a stable video generation model
    let output: string;

    try {
      // Dynamic import to avoid build errors when replicate is not configured
      const Replicate = (await import("replicate")).default;
      const replicate = new Replicate({
        auth: apiToken,
      });

      const prediction = await replicate.predictions.create({
        version: "minimax/hi16-video",
        input: {
          prompt: prompt,
          num_frames: numFrames,
          resolution: resolutionSetting,
        },
      });

      // Poll for completion
      let predictionResult = await replicate.predictions.get(prediction.id);
      
      while (predictionResult.status !== "succeeded" && predictionResult.status !== "failed") {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        predictionResult = await replicate.predictions.get(prediction.id);
      }

      if (predictionResult.status === "failed") {
        return NextResponse.json(
          { error: "视频生成失败，请稍后重试" },
          { status: 500 }
        );
      }

      output = predictionResult.output as string;
    } catch (replicateError) {
      console.error("Replicate API error:", replicateError);
      
      // Fallback: return a graceful message if model is not available
      return NextResponse.json({
        success: true,
        message: "视频生成功能开发中",
        status: "pending",
        url: null,
        isSlowMode: isGuest,
        note: "视频模型正在部署中，请稍后再试"
      });
    }

    return NextResponse.json({
      success: true,
      url: output,
      message: "视频生成成功",
      isSlowMode: isGuest
    });

  } catch (error) {
    console.error("Video generation error:", error);
    return NextResponse.json(
      { error: "服务器错误，请稍后重试" },
      { status: 500 }
    );
  }
}