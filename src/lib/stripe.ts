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
    priceMonthly: 12,
    priceYearly: 96,
  },
  ultimate: {
    name: "Ultimate",
    priceIdMonthly: process.env.STRIPE_ULTIMATE_PRICE_MONTHLY || "",
    priceIdYearly: process.env.STRIPE_ULTIMATE_PRICE_YEARLY || "",
    credits: 5000,
    priceMonthly: 28,
    priceYearly: 224,
  },
} as const;

export type PlanKey = keyof typeof PLANS;