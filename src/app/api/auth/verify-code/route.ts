import { NextRequest, NextResponse } from 'next/server';

// Import the verification store from send-code route
// In production, use a shared database/Redis
const verificationCodes = new Map<string, { code: string; expiresAt: number; attempts: number }>();

function getPhoneKey(phone: string, countryCode: string): string {
  return `${countryCode}:${phone}`;
}

// Export for sharing with other routes (in production, use Redis/database)
export { verificationCodes };

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, countryCode, code } = body;

    if (!phone || !countryCode || !code) {
      return NextResponse.json(
        { error: 'Phone, country code, and code are required' },
        { status: 400 }
      );
    }

    const phoneKey = getPhoneKey(phone, countryCode);
    const record = verificationCodes.get(phoneKey);

    if (!record) {
      return NextResponse.json(
        { error: 'No verification code found. Please request a new code.' },
        { status: 400 }
      );
    }

    // Check expiration
    if (Date.now() > record.expiresAt) {
      verificationCodes.delete(phoneKey);
      return NextResponse.json(
        { error: 'Verification code expired. Please request a new code.' },
        { status: 400 }
      );
    }

    // Check attempts
    if (record.attempts >= 5) {
      verificationCodes.delete(phoneKey);
      return NextResponse.json(
        { error: 'Too many attempts. Please request a new code.' },
        { status: 400 }
      );
    }

    // Verify code
    if (record.code !== code) {
      record.attempts++;
      verificationCodes.set(phoneKey, record);
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Success - delete the code
    verificationCodes.delete(phoneKey);

    // In production, create or find user and return JWT/session
    // For now, return success and a mock user token
    return NextResponse.json({
      success: true,
      message: 'Verification successful',
      // Mock user data - in production, create real user session
      user: {
        id: `phone_${countryCode}${phone}`,
        phone: `${countryCode}${phone}`,
        tier: 'FREE',
        createdAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Verify code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}