import createMiddleware from "next-intl/middleware";

const locales = ["en", "zh"] as const;
const defaultLocale = "zh";

export default createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
  localePrefix: "always",
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};