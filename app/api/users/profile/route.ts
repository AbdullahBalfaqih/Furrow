import { NextRequest, NextResponse } from 'next/server';
import { enforceRateLimit } from '@/lib/security/rate-limiter';
import { applySecurityHeaders } from '@/lib/security/headers';
import { db } from '@/lib/db';
import { walletAddressSchema, sanitizeString } from '@/lib/security/sanitize';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rateLimitError = enforceRateLimit(ip, { limit: 100, windowMs: 60 * 1000 });
  if (rateLimitError) return rateLimitError;

  const url = new URL(req.url);
  const address = url.searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Wallet address query parameter is required' }, { status: 400 });
  }

  const validAddress = walletAddressSchema.safeParse(address);
  if (!validAddress.success) {
    return NextResponse.json({ error: 'Invalid EVM wallet address' }, { status: 400 });
  }

  const profile = db.getUserProfile(validAddress.data);
  const response = NextResponse.json({
    success: true,
    exists: !!profile,
    profile: profile || null,
  });

  return applySecurityHeaders(response);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rateLimitError = enforceRateLimit(ip, { limit: 30, windowMs: 60 * 1000 });
  if (rateLimitError) return rateLimitError;

  try {
    const body = await req.json();
    const { walletAddress, role, name, email, phone, shippingAddress, city } = body;

    const validAddress = walletAddressSchema.safeParse(walletAddress);
    if (!validAddress.success) {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
    }

    if (role !== 'merchant' && role !== 'buyer') {
      return NextResponse.json({ error: 'Role must be either merchant or buyer' }, { status: 400 });
    }

    const updatedProfile = db.saveUserProfile({
      walletAddress: validAddress.data,
      role,
      name: name ? sanitizeString(name) : undefined,
      email: email ? sanitizeString(email) : undefined,
      phone: phone ? sanitizeString(phone) : undefined,
      shippingAddress: shippingAddress ? sanitizeString(shippingAddress) : undefined,
      city: city ? sanitizeString(city) : undefined,
      createdAt: Math.floor(Date.now() / 1000),
    });

    db.logSecurityEvent(ip, 'USER_PROFILE_UPDATED', `Wallet ${walletAddress} updated role to ${role}`, 'ALLOWED');

    const response = NextResponse.json({
      success: true,
      message: 'User profile and role saved successfully',
      profile: updatedProfile,
    });

    return applySecurityHeaders(response);
  } catch (err: any) {
    db.logSecurityEvent(ip, 'USER_PROFILE_ERROR', err.message || 'Server error', 'BLOCKED');
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
  }
}
