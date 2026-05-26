import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { PLANS } from "@/lib/stripe";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    const { plan, interval, email, userId } = await request.json();

    if (!plan || !interval) {
      return NextResponse.json({ error: "Plan and interval are required" }, { status: 400 });
    }

    const planConfig = PLANS[plan as keyof typeof PLANS];
    if (!planConfig) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const priceId = interval === "yearly" ? planConfig.priceIdYearly : planConfig.priceIdMonthly;

    // If no Stripe configured or no price IDs, return mock checkout
    if (!stripe || !priceId) {
      // Mock success for development
      console.log("[DEV] Mock checkout for plan:", plan, interval, email);
      return NextResponse.json({
        success: true,
        url: APP_URL + "/zh/membership?checkout=success&plan=" + plan,
        mock: true,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email || undefined,
      client_reference_id: userId,
      success_url: APP_URL + "/zh/membership?checkout=success&session_id={CHECKOUT_SESSION_ID}",
      cancel_url: APP_URL + "/zh/pricing",
      metadata: { plan, userId: userId || "" },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}