import { NextRequest, NextResponse } from "next/server";

const WANXIANG_API_KEY = process.env.WANXIANG_API_KEY;
const WANXIANG_API_URL = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis";
const WANXIANG_TASK_URL = "https://dashscope.aliyuncs.com/api/v1/tasks";

// Debug helper - in production, remove or disable this
function debugLog(msg: string, ...args: unknown[]) {
  if (process.env.NODE_ENV === "development") {
    console.debug(`[Wanxiang Debug] ${msg}`, ...args);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, negative_prompt, width = 1024, height = 1024 } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Check API key with detailed error message
    if (!WANXIANG_API_KEY) {
      debugLog("WANXIANG_API_KEY is not set. Available env vars:", Object.keys(process.env).filter(k => k.includes("WANXIANG") || k.includes("API")));
      return NextResponse.json(
        { error: "WANXIANG_API_KEY is not configured. Please set the WANXIANG_API_KEY environment variable in Vercel project settings." },
        { status: 500 }
      );
    }

    debugLog("API key found, starting image generation with prompt:", prompt);

    // Create async task with Wanxiang
    const createResponse = await fetch(WANXIANG_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WANXIANG_API_KEY}`,
        "Content-Type": "application/json",
        "X-DashScope-Async": "enable",
      },
      body: JSON.stringify({
        model: "wanx2.1-t2i-plus",
        input: {
          prompt,
          ...(negative_prompt && { negative_prompt }),
        },
        parameters: {
          size: `${width}*${height}`,
          n: 1,
        },
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error("Wanxiang create error:", errorText);
      return NextResponse.json(
        { error: "Failed to create Wanxiang task" },
        { status: 500 }
      );
    }

    const taskData = await createResponse.json();
    const taskId = taskData.output?.task_id;

    if (!taskId) {
      console.error("Wanxiang response missing task_id:", taskData);
      return NextResponse.json(
        { error: "Invalid Wanxiang response" },
        { status: 500 }
      );
    }

    // Poll for completion with timeout
    const maxWaitTime = 120000; // 2 minutes
    const pollInterval = 3000; // 3 seconds
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      const pollResponse = await fetch(`${WANXIANG_TASK_URL}/${taskId}`, {
        headers: {
          Authorization: `Bearer ${WANXIANG_API_KEY}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(30000),
      });

      if (!pollResponse.ok) {
        return NextResponse.json(
          { error: "Failed to poll task status" },
          { status: 500 }
        );
      }

      const updatedTask = await pollResponse.json();
      const taskStatus = updatedTask.output?.task_status;

      if (taskStatus === "SUCCEEDED") {
        const results = updatedTask.output?.results || [];
        const imageUrls = results.map((r: { url: string }) => r.url);
        return NextResponse.json({
          id: taskId,
          status: "succeeded",
          output: imageUrls,
          model: "wanx2.1-t2i-plus",
        });
      }

      if (taskStatus === "FAILED") {
        return NextResponse.json(
          { error: "Task failed" },
          { status: 500 }
        );
      }

      // Wait before polling again
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    return NextResponse.json(
      { error: "Task timed out" },
      { status: 504 }
    );

  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
