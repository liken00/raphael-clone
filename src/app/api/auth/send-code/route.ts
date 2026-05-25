import { NextRequest, NextResponse } from 'next/server';

// In-memory store for verification codes (in production, use Redis or database)
// Map<phone:countryCode, { code: string, expiresAt: number, attempts: number }>
const verificationCodes = new Map<string, { code: string; expiresAt: number; attempts: number }>();

// Rate limiting: track last sent time per phone
const lastSentTimes = new Map<string, number>();

// Country calling codes
export const COUNTRY_CODES = [
  { code: '+1', country: 'US', name: '美国' },
  { code: '+86', country: 'CN', name: '中国' },
  { code: '+82', country: 'KR', name: '韩国' },
  { code: '+971', country: 'AE', name: '阿联酋' },
  { code: '+44', country: 'GB', name: '英国' },
  { code: '+81', country: 'JP', name: '日本' },
  { code: '+65', country: 'SG', name: '新加坡' },
  { code: '+60', country: 'MY', name: '马来西亚' },
  { code: '+66', country: 'TH', name: '泰国' },
  { code: '+91', country: 'IN', name: '印度' },
  { code: '+52', country: 'MX', name: '墨西哥' },
  { code: '+55', country: 'BR', name: '巴西' },
  { code: '+39', country: 'IT', name: '意大利' },
  { code: '+49', country: 'DE', name: '德国' },
  { code: '+33', country: 'FR', name: '法国' },
  { code: '+61', country: 'AU', name: '澳大利亚' },
  { code: '+7', country: 'RU', name: '俄罗斯' },
  { code: '+62', country: 'ID', name: '印尼' },
  { code: '+63', country: 'PH', name: '菲律宾' },
  { code: '+84', country: 'VN', name: '越南' },
] as const;

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getPhoneKey(phone: string, countryCode: string): string {
  return `${countryCode}:${phone}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, countryCode } = body;

    if (!phone || !countryCode) {
      return NextResponse.json(
        { error: 'Phone and country code are required' },
        { status: 400 }
      );
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^\d{6,15}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    const phoneKey = getPhoneKey(phone, countryCode);
    const now = Date.now();

    // Check rate limit (60 seconds between sends)
    const lastSent = lastSentTimes.get(phoneKey);
    if (lastSent && now - lastSent < 60000) {
      const remaining = Math.ceil((60000 - (now - lastSent)) / 1000);
      return NextResponse.json(
        { error: `Please wait ${remaining} seconds before requesting another code` },
        { status: 429 }
      );
    }

    // Generate and store code
    const code = generateCode();
    const expiresAt = now + 5 * 60 * 1000; // 5 minutes

    verificationCodes.set(phoneKey, {
      code,
      expiresAt,
      attempts: 0,
    });

    lastSentTimes.set(phoneKey, now);

    // In production, send SMS here via Twilio, AWS SNS, etc.
    // For now, we'll log the code and return it in response for testing
    console.log(`[SMS Mock] To ${countryCode}${phone}: Your code is ${code}`);

    return NextResponse.json({
      success: true,
      message: 'Verification code sent',
      // Include code in response for testing only (remove in production)
      ...(process.env.NODE_ENV !== 'production' && { debugCode: code }),
      expiresIn: 300, // 5 minutes
    });

  } catch (error) {
    console.error('Send code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}