import { NextRequest, NextResponse } from 'next/server';

const GITHUB_CLIENT_ID = process.env.AUTH_GITHUB_ID || '';
const GITHUB_CLIENT_SECRET = process.env.AUTH_GITHUB_SECRET || '';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function GET(request: NextRequest) {
  try {
    if (!GITHUB_CLIENT_ID) {
      return NextResponse.json(
        { error: 'GitHub OAuth is not configured' },
        { status: 500 }
      );
    }

    const redirectUri = `${APP_URL}/api/auth/github/callback`;
    const scope = 'read:user user:email';

    const authUrl = new URL('https://github.com/login/oauth/authorize');
    authUrl.searchParams.set('client_id', GITHUB_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', scope);
    authUrl.searchParams.set('state', crypto.randomUUID());

    return NextResponse.json({ url: authUrl.toString() });

  } catch (error) {
    console.error('GitHub auth URL error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}