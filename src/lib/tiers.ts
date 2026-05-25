// User tier constants for permission分层
export type Tier = 'GUEST' | 'FREE' | 'PRO';

export interface TierConfig {
  tier: Tier;
  label: string;
  resolution: {
    width: number;
    height: number;
    label: string;
  };
  maxImages: number;
  maxVideos: number;
  maxVoiceoverMinutes: number;
  storageDays: number;
  watermark: boolean;
  badge: string;
  badgeColor: string;
}

export const TIERS: Record<Tier, TierConfig> = {
  GUEST: {
    tier: 'GUEST',
    label: '游客',
    resolution: { width: 1280, height: 720, label: '720P' },
    maxImages: 2,
    maxVideos: 1,
    maxVoiceoverMinutes: 0,
    storageDays: 7,
    watermark: true,
    badge: '游客',
    badgeColor: 'bg-gray-600',
  },
  FREE: {
    tier: 'FREE',
    label: '免费用户',
    resolution: { width: 1920, height: 1080, label: '1080P' },
    maxImages: 3,
    maxVideos: 1,
    maxVoiceoverMinutes: 3,
    storageDays: 7,
    watermark: false,
    badge: 'FREE',
    badgeColor: 'bg-amber-500',
  },
  PRO: {
    tier: 'PRO',
    label: '专业会员',
    resolution: { width: 3840, height: 2160, label: '4K' },
    maxImages: -1, // unlimited
    maxVideos: -1,
    maxVoiceoverMinutes: -1,
    storageDays: -1, // permanent
    watermark: false,
    badge: 'PRO',
    badgeColor: 'bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500',
  },
};

// Resolution options for UI selector
export const RESOLUTION_OPTIONS = [
  { width: 1280, height: 720, label: '720P', tiers: ['GUEST', 'FREE', 'PRO'] as Tier[] },
  { width: 1920, height: 1080, label: '1080P', tiers: ['FREE', 'PRO'] as Tier[] },
  { width: 3840, height: 2160, label: '4K', tiers: ['PRO'] as Tier[] },
];

// Helper to get available resolutions for a tier
export function getAvailableResolutions(tier: Tier) {
  return RESOLUTION_OPTIONS.filter(opt => opt.tiers.includes(tier));
}

// Helper to check if tier can use a specific resolution
export function canUseResolution(tier: Tier, width: number, height: number): boolean {
  const option = RESOLUTION_OPTIONS.find(opt => opt.width === width && opt.height === height);
  return option ? option.tiers.includes(tier) : tier === 'GUEST';
}

// Default tier for unknown users
export const DEFAULT_TIER: Tier = 'GUEST';