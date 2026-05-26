import { NextRequest, NextResponse } from "next/server";
import { verificationCodeStore } from "@/lib/auth";

// In-memory user store (in production, use a database)
export const userStore = new Map<string, {
  id: string;
  email: string;
  name: string;
  image?: string;
  tier: "GUEST" | "FREE" | "PRO";
  createdAt: string;
}>();

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
    }

    const stored = verificationCodeStore.get(email);

    if (!stored) {
      return NextResponse.json({ error: "No verification code found. Please request a new one." }, { status: 400 });
    }

    if (Date.now() > stored.expiresAt) {
      verificationCodeStore.delete(email);
      return NextResponse.json({ error: "Code has expired. Please request a new one." }, { status: 400 });
    }

    if (stored.attempts >= 5) {
      verificationCodeStore.delete(email);
      return NextResponse.json({ error: "Too many attempts. Please request a new code." }, { status: 429 });
    }

    stored.attempts += 1;

    if (stored.code !== code) {
      return NextResponse.json({ error: "Invalid code. Please try again." }, { status: 400 });
    }

    // Code verified - clear it
    verificationCodeStore.delete(email);

    // Find or create user
    let user = userStore.get(email);
    if (!user) {
      user = {
        id: "user_" + Date.now(),
        email,
        name: email.split("@")[0],
        tier: "FREE",
        createdAt: new Date().toISOString(),
      };
      userStore.set(email, user);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        tier: user.tier,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Verify code error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}