import { NextRequest, NextResponse } from "next/server";
import { generateVerificationCode, verificationCodeStore, resend } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "请输入有效的邮箱地址" }, { status: 400 });
    }

    const existing = verificationCodeStore.get(email);
    if (existing) {
      const timeSinceLastCode = Date.now() - (existing.expiresAt - 5 * 60 * 1000);
      if (timeSinceLastCode < 60000) {
        return NextResponse.json(
          { error: "请等待 60 秒后再请求新的验证码" },
          { status: 429 }
        );
      }
    }

    const code = generateVerificationCode();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    verificationCodeStore.set(email, { code, expiresAt, attempts: 0 });

    if (resend) {
      try {
        await resend.emails.send({
          from: "MY AI <noreply@myai.com>",
          to: email,
          subject: "Your MY AI Login Code",
          html: "<div><h2>MY AI Login Code</h2><p>Your code: <strong>" + code + "</strong></p><p>Valid for 5 minutes.</p></div>",
        });
      } catch (emailError) {
        console.error("Failed to send email via Resend:", emailError);
        if (process.env.NODE_ENV === "development") {
          return NextResponse.json({ success: true, message: "Development mode", _devCode: code });
        }
        return NextResponse.json({ error: "Email send failed" }, { status: 500 });
      }
    } else {
      console.log("[DEV] Code for " + email + ": " + code);
      return NextResponse.json({ success: true, message: "Development mode", _devCode: code });
    }

    return NextResponse.json({ success: true, message: "Code sent to your email" });
  } catch (error) {
    console.error("Send code error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}