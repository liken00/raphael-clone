import { NextRequest, NextResponse } from "next/server";

const WANXIANG_API_KEY = process.env.WANXIANG_API_KEY || "";
const WANXIANG_TASK_URL = "https://dashscope.aliyuncs.com/api/v1/tasks";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, plan } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "请输入视频描述" }, { status: 400 });
    }

    if (!WANXIANG_API_KEY) {
      return NextResponse.json(
        { error: "视频生成 API 未配置" },
        { status: 500 }
      );
    }

    // Call Wanxiang video generation API
    const createResponse = await fetch(
      "https://dashscope.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + WANXIANG_API_KEY,
          "Content-Type": "application/json",
          "X-DashScope-Async": "enable",
        },
        body: JSON.stringify({
          model: "wanx2.1-t2v-turbo",
          input: {
            prompt: prompt,
          },
          parameters: {
            size: "1280*720",
            duration: 5,
          },
        }),
      }
    );

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error("Wanxiang video create error:", errorText);
      return NextResponse.json(
        { error: "视频生成任务创建失败" },
        { status: 500 }
      );
    }

    const taskData = await createResponse.json();
    const taskId = taskData.output?.task_id;

    if (!taskId) {
      console.error("Wanxiang video response missing task_id:", taskData);
      return NextResponse.json(
        { error: "视频生成服务响应异常" },
        { status: 500 }
      );
    }

    // Poll for completion with timeout
    const maxWaitTime = 180000; // 3 minutes
    const pollInterval = 5000; // 5 seconds
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      const pollResponse = await fetch(WANXIANG_TASK_URL + "/" + taskId, {
        headers: {
          Authorization: "Bearer " + WANXIANG_API_KEY,
          "Content-Type": "application/json",
        },
      });

      if (!pollResponse.ok) {
        const pollError = await pollResponse.text();
        console.error("Poll error:", pollError);
        return NextResponse.json(
          { error: "查询视频生成状态失败" },
          { status: 500 }
        );
      }

      const updatedTask = await pollResponse.json();
      const taskStatus = updatedTask.output?.task_status;

      if (taskStatus === "SUCCEEDED") {
        const results = updatedTask.output?.results || [];
        const videoUrl = results[0]?.video_url || results[0]?.url || "";
        if (videoUrl) {
          return NextResponse.json({
            success: true,
            url: videoUrl,
            message: "视频生成成功",
          });
        }
        return NextResponse.json(
          { error: "生成成功但未获取到视频链接" },
          { status: 500 }
        );
      }

      if (taskStatus === "FAILED") {
        const failMsg = updatedTask.output?.message || "视频生成失败";
        return NextResponse.json(
          { error: failMsg },
          { status: 500 }
        );
      }

      // Wait before polling again
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    return NextResponse.json(
      { error: "视频生成超时，请稍后重试" },
      { status: 504 }
    );

  } catch (error) {
    console.error("Video generation error:", error);
    return NextResponse.json(
      { error: "服务器错误，请稍后重试" },
      { status: 500 }
    );
  }
}