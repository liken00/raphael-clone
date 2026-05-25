import { NextRequest, NextResponse } from "next/server";

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const REPLICATE_API_URL = "https://api.replicate.com/v1/predictions";

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

    if (!REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: "REPLICATE_API_TOKEN is not configured" },
        { status: 500 }
      );
    }

    // Create a prediction with Replicate
    const createResponse = await fetch(REPLICATE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "777e10b05ad04f63a2ed3e5e3b3e3d3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3",
        input: {
          prompt,
          negative_prompt: negative_prompt || "",
          width: Number(width),
          height: Number(height),
          num_outputs: 1,
        },
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error("Replicate create error:", errorText);
      return NextResponse.json(
        { error: "Failed to create prediction" },
        { status: 500 }
      );
    }

    const prediction = await createResponse.json();
    const predictionUrl = prediction.urls?.cancel ? prediction.urls.prediction : `${REPLICATE_API_URL}/${prediction.id}`;

    // Poll for completion with timeout
    const maxWaitTime = 120000; // 2 minutes
    const pollInterval = 2000; // 2 seconds
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      const pollResponse = await fetch(predictionUrl, {
        headers: {
          Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
        },
        signal: AbortSignal.timeout(30000),
      });

      if (!pollResponse.ok) {
        return NextResponse.json(
          { error: "Failed to poll prediction status" },
          { status: 500 }
        );
      }

      const updatedPrediction = await pollResponse.json();

      if (updatedPrediction.status === "succeeded") {
        return NextResponse.json({
          id: updatedPrediction.id,
          status: "succeeded",
          output: updatedPrediction.output,
          model: "stability-ai/sdxl",
        });
      }

      if (updatedPrediction.status === "failed") {
        return NextResponse.json(
          { error: updatedPrediction.error || "Prediction failed" },
          { status: 500 }
        );
      }

      if (updatedPrediction.status === "canceled") {
        return NextResponse.json(
          { error: "Prediction was canceled" },
          { status: 500 }
        );
      }

      // Wait before polling again
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    // Timeout - try to cancel the prediction
    try {
      await fetch(`${REPLICATE_API_URL}/${prediction.id}/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
        },
      });
    } catch (_) {
      // Ignore cancel errors
    }

    return NextResponse.json(
      { error: "Prediction timed out" },
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
