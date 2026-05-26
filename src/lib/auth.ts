import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { Resend } from "resend";
import { TIERS, type Tier } from "./tiers";

// Extend session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      phone?: string;
      githubId?: string;
      tier: Tier;
    };
  }
  interface User {
    phone?: string;
    githubId?: string;
    tier?: Tier;
  }
}

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Auth GitHub OAuth URL generator
export function getGitHubAuthUrl(): string {
  const clientId = process.env.AUTH_GITHUB_ID || "";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const redirectUri = `${appUrl}/api/auth/github/callback`;
  const scope = "read:user user:email";
  const state = crypto.randomUUID();

  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", scope);
  url.searchParams.set("state", state);

  return url.toString();
}

// Get user tier based on subscription, usage, etc.
export function getUserTier(user: { tier?: Tier; createdAt?: string }): Tier {
  if (user.tier && Object.keys(TIERS).includes(user.tier)) {
    return user.tier;
  }
  return "FREE";
}

// Generate mock verification code (for testing without SMS)
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store for verification codes (shared with API routes)
// In production, use Redis or database
export const verificationCodeStore = new Map<
  string,
  { code: string; expiresAt: number; attempts: number }
>();

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID || "",
      clientSecret: process.env.AUTH_GITHUB_SECRET || "",
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (email === "demo@myai.app" && password === "demo1234") {
          return {
            id: "1",
            email,
            name: "Demo User",
            tier: "PRO",
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        // In production, fetch user tier from database
        session.user.tier = (token.tier as Tier) || "FREE";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.tier = (user as any).tier || "FREE";
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
});