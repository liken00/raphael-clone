import { NextRequest, NextResponse } from "next/server";

const POYO_API_KEY = process.env.POYO_API_KEY;
const POYO_BASE_URL = "https://api.poyo.ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, model_id = "flux-schnell", negative_prompt, width = 1024, height = 1024 } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Try PoYo API first
    if (POYO_API_KEY) {
      try {
        const apiBody = JSON.stringify({
          model_id,
          prompt,
          negative_prompt: negative_prompt || "",
          width,
          height,
          n: 1,
        });

        const response = await fetch(`${POYO_BASE_URL}/v1/images/generations`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${POYO_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: apiBody,
          signal: AbortSignal.timeout(30000),
        });

        if (response.ok) {
          const data = await response.json();
          const outputUrls = extractUrls(data);
          if (outputUrls.length > 0) {
            return NextResponse.json({
              id: data.id || crypto.randomUUID(),
              status: "succeeded",
              output: outputUrls,
              model: model_id,
            });
          }
        }
      } catch (apiError) {
        console.warn("PoYo API failed, falling back to mock:", apiError);
      }
    }

    // Fallback: return a placeholder image
    return NextResponse.json({
      id: crypto.randomUUID(),
      status: "succeeded",
      output: [`https://placehold.co/${width}x${height}/c08b52/ffffff?text=Raphael+AI`],
      model: model_id,
      note: "Demo mode - configure POYO_API_KEY for real image generation",
    });

  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function extractUrls(data: any): string[] {
  if (data?.data?.length > 0 && data.data[0]?.url) {
    return data.data.map((img: { url: string }) => img.url);
  }
  if (data?.data?.url) return [data.data.url];
  if (data?.output?.length > 0) return data.output;
  if (data?.url) return [data.url];
  if (Array.isArray(data)) return data.map((item: { url?: string }) => item.url).filter((u): u is string => !!u);
  return [];
}