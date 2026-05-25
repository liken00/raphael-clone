'use client';

import { useState } from 'react';
import { Github, Loader2 } from 'lucide-react';

interface GitHubLoginProps {
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
}

export default function GitHubLogin({ onSuccess, onError }: GitHubLoginProps) {
  const [loading, setLoading] = useState(false);

  const handleGitHubLogin = async () => {
    setLoading(true);

    try {
      // Get GitHub OAuth URL from our API
      const response = await fetch('/api/auth/github');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get GitHub auth URL');
      }

      // Redirect to GitHub OAuth
      window.location.href = data.url;
    } catch (err: any) {
      setLoading(false);
      onError?.(err.message || 'GitHub login failed');
    }
  };

  return (
    <button
      onClick={handleGitHubLogin}
      disabled={loading}
      className="w-full rounded-full border border-border/40 py-2.5 text-sm font-medium text-foreground/80 hover:bg-foreground/5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          <Github className="w-4 h-4" />
          使用 GitHub 登录
        </>
      )}
    </button>
  );
}