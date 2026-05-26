import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const WANXIANG_API_KEY = process.env.WANXIANG_API_KEY || "sk-5c96b19a67e84dcbbed8e563b9762901";
const WANXIANG_API_URL = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis";
const WANXIANG_TASK_URL = "https://dashscope.aliyuncs.com/api/v1/tasks";

// Fast mode quota: 10 per day for logged-in users
const FAST_MODE_DAILY_QUOTA = 10;

// Guest users get slow mode (minimum wait time in ms)
const GUEST_MIN_WAIT = 5000; // 5 seconds slow mode

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

interface UserQuota {
  date: string;
  fastCount: number;
}

// Debug helper
function debugLog(msg: string, ...args: unknown[]) {
  if (process.env.NODE_ENV === "development") {
    console.debug(`[Wanxiang Debug] ${msg}`, ...args);
  }
}

// Get user quota from cookies (simple client-side tracking)
async function getUserQuotaFromCookies(): Promise<UserQuota> {
  const cookieStore = await cookies();
  const quotaCookie = cookieStore.get('_myai_quota');
  const today = getTodayDate();
  
  if (quotaCookie) {
    try {
      const quota = JSON.parse(quotaCookie.value) as UserQuota;
      // Reset if it's a new day
      if (quota.date !== today) {
        return { date: today, fastCount: 0 };
      }
      return quota;
    } catch {
      return { date: today, fastCount: 0 };
    }
  }
  return { date: today, fastCount: 0 };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, negative_prompt, width = 1024, height = 1024, fastMode = false } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Check API key
    if (!WANXIANG_API_KEY) {
      return NextResponse.json(
        { error: "WANXIANG_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // Check fast mode quota
    const quota = await getUserQuotaFromCookies();
    const hasQuota = quota.fastCount < FAST_MODE_DAILY_QUOTA;
    const isGuest = !request.headers.get('x-user-id');

    // Apply slow mode for guests or when fast mode quota exceeded
    const shouldSlow = isGuest || (fastMode && !hasQuota);
    
    // For guest users, apply minimum wait time to simulate queue
    if (isGuest && !fastMode) {
      debugLog(`Guest user - applying slow mode (${GUEST_MIN_WAIT}ms wait)`);
      await new Promise(resolve => setTimeout(resolve, GUEST_MIN_WAIT));
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
          // Include quota info in response
          fastModeUsed: fastMode,
          remainingQuota: Math.max(0, FAST_MODE_DAILY_QUOTA - quota.fastCount - (fastMode ? 1 : 0)),
          isSlowMode: shouldSlow,
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
