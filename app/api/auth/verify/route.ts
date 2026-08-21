import { NextRequest, NextResponse } from 'next/server';
import { enforceRateLimit } from '@/lib/security/rate-limiter';
import { verifySiweSignature, issueJwtToken } from '@/lib/security/auth';
import { applySecurityHeaders } from '@/lib/security/headers';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

  // Enforce Rate Limit (Max 10 per minute)
  const rateLimitError = enforceRateLimit(ip, { limit: 10, windowMs: 60 * 1000 });
  if (rateLimitError) return rateLimitError;

  try {
    const { message, signature } = await req.json();

    if (!message || !signature) {
      db.logSecurityEvent(ip, 'AUTH_FAILED', 'Missing SIWE message or signature', 'BLOCKED');
      return NextResponse.json({ error: 'Missing message or signature' }, { status: 400 });
    }

    const verification = await verifySiweSignature(message, signature);

    if (!verification.success || !verification.address) {
      db.logSecurityEvent(ip, 'AUTH_FAILED', `Invalid signature from IP ${ip}`, 'BLOCKED');
      return NextResponse.json({ error: verification.error || 'Invalid signature' }, { status: 401 });
    }

    const address = verification.address;
    const token = await issueJwtToken(address, 'FARMER');

    db.logSecurityEvent(ip, 'AUTH_SUCCESS', `Authenticated wallet ${address}`, 'ALLOWED');

    const response = NextResponse.json({
      success: true,
      address,
      message: 'Authenticated successfully',
    });

    // Set Secure HTTP-Only Cookie
    response.cookies.set('furrow_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return applySecurityHeaders(response);
  } catch (err: any) {
    db.logSecurityEvent(ip, 'AUTH_ERROR', err.message || 'Server error', 'BLOCKED');
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
