import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "data", "images")
  : path.join(process.cwd(), "data", "images");

interface SavedImage {
  id: string;
  url: string;
  prompt: string;
  model: string;
  createdAt: string;
  userId?: string;
}

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getUserFile(userId: string): string {
  return path.join(DATA_DIR, userId + ".json");
}

// Save an image
export async function POST(request: NextRequest) {
  try {
    const { url, prompt, model, userId } = await request.json();
    if (!url || !prompt) {
      return NextResponse.json({ error: "URL and prompt are required" }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    ensureDir();
    const filePath = getUserFile(userId);
    let images: SavedImage[] = [];
    if (fs.existsSync(filePath)) {
      try { images = JSON.parse(fs.readFileSync(filePath, "utf-8")); } catch { images = []; }
    }
    const newImage: SavedImage = {
      id: crypto.randomUUID(),
      url,
      prompt,
      model: model || "wanx2.1-t2i-plus",
      createdAt: new Date().toISOString(),
      userId,
    };
    images.unshift(newImage);
    if (images.length > 500) images = images.slice(0, 500);
    fs.writeFileSync(filePath, JSON.stringify(images, null, 2));
    return NextResponse.json({ success: true, image: newImage });
  } catch (error) {
    console.error("Save image error:", error);
    return NextResponse.json({ error: "Failed to save image" }, { status: 500 });
  }
}

// Get user images
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    const filePath = getUserFile(userId);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ images: [], count: 0 });
    }
    const images: SavedImage[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return NextResponse.json({ images: images.slice(0, limit), count: images.length });
  } catch (error) {
    console.error("Get images error:", error);
    return NextResponse.json({ error: "Failed to get images" }, { status: 500 });
  }
}

// Delete an image
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const imageId = searchParams.get("imageId");
    if (!userId || !imageId) {
      return NextResponse.json({ error: "User ID and Image ID are required" }, { status: 400 });
    }
    const filePath = getUserFile(userId);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "No images found" }, { status: 404 });
    }
    let images: SavedImage[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    images = images.filter((img) => img.id !== imageId);
    fs.writeFileSync(filePath, JSON.stringify(images, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete image error:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}