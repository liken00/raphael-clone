import { NextRequest, NextResponse } from 'next/server';

const GITHUB_CLIENT_ID = process.env.AUTH_GITHUB_ID || '';
const GITHUB_CLIENT_SECRET = process.env.AUTH_GITHUB_SECRET || '';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface GitHubTokenResponse {
  access_token?: string;
  token_type?: string;
  scope?: string;
  error?: string;
  error_description?: string;
}

interface GitHubUser {
  id: number;
  login: string;
  name?: string;
  email?: string;
  avatar_url?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle OAuth errors (e.g., user denied access)
    if (error) {
      const redirectUrl = new URL(`${APP_URL}/login`);
      redirectUrl.searchParams.set('error', error);
      return NextResponse.redirect(redirectUrl.toString());
    }

    if (!code) {
      return NextResponse.json(
        { error: 'Missing authorization code' },
        { status: 400 }
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: `${APP_URL}/api/auth/github/callback`,
        }),
      }
    );

    const tokenData: GitHubTokenResponse = await tokenResponse.json();

    if (tokenData.error || !tokenData.access_token) {
      console.error('GitHub token error:', tokenData);
      return NextResponse.redirect(
        `${APP_URL}/login?error=${tokenData.error_description || 'auth_failed'}`
      );
    }

    // Get GitHub user info
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/json',
      },
    });

    const githubUser: GitHubUser = await userResponse.json();

    // In production, find or create user in database
    // For now, create mock user and store in localStorage via redirect
    const mockUser = {
      id: `github_${githubUser.id}`,
      githubId: String(githubUser.id),
      name: githubUser.name || githubUser.login,
      email: githubUser.email,
      image: githubUser.avatar_url,
      tier: 'FREE',
      createdAt: new Date().toISOString(),
    };

    // Redirect to home with user data in URL (simplified session handling)
    const redirectUrl = new URL(`${APP_URL}/zh`);
    redirectUrl.searchParams.set('auth', 'github');
    redirectUrl.searchParams.set('user', Buffer.from(JSON.stringify(mockUser)).toString('base64'));

    return NextResponse.redirect(redirectUrl.toString());

  } catch (error) {
    console.error('GitHub callback error:', error);
    return NextResponse.redirect(`${APP_URL}/login?error=server_error`);
  }
}