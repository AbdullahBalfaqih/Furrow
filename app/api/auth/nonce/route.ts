import { NextRequest, NextResponse } from 'next/server';
import { enforceRateLimit } from '@/lib/security/rate-limiter';
import { generateNonce } from '@/lib/security/auth';
import { applySecurityHeaders } from '@/lib/security/headers';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  
  // Enforce Rate Limit (Max 20 per minute)
  const rateLimitError = enforceRateLimit(ip, { limit: 20, windowMs: 60 * 1000 });
  if (rateLimitError) return rateLimitError;

  const nonce = generateNonce(ip);
  db.logSecurityEvent(ip, 'SIWE_NONCE_GENERATED', `Nonce generated for IP ${ip}`, 'ALLOWED');

  const response = NextResponse.json({ nonce, timestamp: Date.now() });
  return applySecurityHeaders(response);
}
