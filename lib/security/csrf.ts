/**
 * Furrow Chain Cybersecurity Layer - Anti-CSRF Protection Helper
 * Implements Double-Submit Cookie Pattern to block Cross-Site Request Forgery attacks.
 */

import { NextRequest, NextResponse } from 'next/server';
import { randomBytes, createHmac } from 'crypto';

const CSRF_SECRET = process.env.CSRF_SECRET || 'furrow-chain-csrf-secret-key-2026-prod';

/**
 * Generates a cryptographic CSRF token.
 */
export function generateCsrfToken(): string {
  const nonce = randomBytes(16).toString('hex');
  const hmac = createHmac('sha256', CSRF_SECRET).update(nonce).digest('hex');
  return `${nonce}.${hmac}`;
}

/**
 * Validates incoming CSRF token against secret HMAC signature.
 */
export function validateCsrfToken(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [nonce, hmac] = parts;
  const expectedHmac = createHmac('sha256', CSRF_SECRET).update(nonce).digest('hex');
  return hmac === expectedHmac;
}

/**
 * Enforces CSRF token check for state-changing HTTP methods.
 */
export function enforceCsrfProtection(req: NextRequest): NextResponse | null {
  const method = req.method.toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return null; // Safe methods
  }

  const csrfHeader = req.headers.get('x-csrf-token') || req.headers.get('csrf-token');
  const csrfCookie = req.cookies.get('furrow_csrf')?.value;

  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie || !validateCsrfToken(csrfHeader)) {
    return NextResponse.json(
      {
        error: 'Forbidden',
        message: 'Invalid or missing Anti-CSRF security token.',
      },
      { status: 403 }
    );
  }

  return null;
}
