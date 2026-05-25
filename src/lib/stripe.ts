import Stripe from "stripe";

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export const PLANS = {
  pro: {
    name: "Pro",
    priceIdMonthly: process.env.STRIPE_PRO_PRICE_MONTHLY || "",
    priceIdYearly: process.env.STRIPE_PRO_PRICE_YEARLY || "",
    credits: 2000,
    priceMonthly: 4.96, // 成本 × 31（通义万相 API ¥0.16 × 31 ≈ ¥4.96）
    priceYearly: 99, // 海外基础会员 $99/年
  },
  ultimate: {
    name: "Ultimate",
    priceIdMonthly: process.env.STRIPE_ULTIMATE_PRICE_MONTHLY || "",
    priceIdYearly: process.env.STRIPE_ULTIMATE_PRICE_YEARLY || "",
    credits: 5000,
    priceMonthly: 9.92, // 成本 × 31（通义万相 API ¥0.32 × 31 ≈ ¥9.92）
    priceYearly: 119.04,
  },
} as const;

export type PlanKey = keyof typeof PLANS;