'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tier, DEFAULT_TIER, TIERS } from '@/lib/tiers';

export interface User {
  id: string;
  phone?: string;
  email?: string;
  githubId?: string;
  name?: string;
  image?: string;
  tier: Tier;
  createdAt: string;
}

type Freetier = 'FREE' | 'PRO' | 'GUEST';

interface AuthContextType {
  user: User | null;
  tier: Tier;
  tierConfig: typeof TIERS[Freetier];
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  updateTier: (tier: Tier) => void;
}

const defaultTierConfig = TIERS.FREE;

const AuthContext = createContext<AuthContextType>({
  user: null,
  tier: DEFAULT_TIER,
  tierConfig: defaultTierConfig,
  isLoading: true,
  isAuthenticated: false,
  setUser: () => {},
  updateTier: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for persisted user session
    const stored = localStorage.getItem('myai_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('myai_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('myai_user');
    }
  }, [user]);

  const tier = user?.tier || DEFAULT_TIER;
  const tierConfig = TIERS[tier] || defaultTierConfig;

  return (
    <AuthContext.Provider
      value={{
        user,
        tier,
        tierConfig,
        isLoading,
        isAuthenticated: !!user,
        setUser,
        updateTier: (newTier: Tier) => {
          if (user) {
            setUser({ ...user, tier: newTier });
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}