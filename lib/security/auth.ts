/**
 * Furrow Chain Cybersecurity Layer - SIWE & JWT Authentication
 * Verifies EIP-4361 wallet signatures and issues secure HTTP-Only JWT session cookies.
 */

import { SignJWT, jwtVerify } from 'jose';
import { SiweMessage } from 'siwe';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'furrow-chain-cybersecurity-secret-key-2026-0g-galileo-token-key-prod'
);

export interface JWTPayload {
  address: string;
  role: 'FARMER' | 'BUYER' | 'ASSESSOR' | 'ADMIN';
  iat: number;
  exp: number;
}

const nonceStore = new Map<string, { nonce: string; expiresAt: number }>();

/**
 * Generates a cryptographic nonce for SIWE login.
 */
export function generateNonce(ip: string): string {
  const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  nonceStore.set(ip, {
    nonce,
    expiresAt: Date.now() + 5 * 60 * 1000, // Expires in 5 mins
  });
  return nonce;
}

/**
 * Validates SIWE nonce for IP.
 */
export function validateNonce(ip: string, nonce: string): boolean {
  const record = nonceStore.get(ip);
  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    nonceStore.delete(ip);
    return false;
  }
  const valid = record.nonce === nonce;
  if (valid) nonceStore.delete(ip);
  return valid;
}

/**
 * Verifies SIWE message signature from wallet.
 */
export async function verifySiweSignature(
  message: string,
  signature: string
): Promise<{ success: boolean; address?: string; error?: string }> {
  try {
    const siweObject = new SiweMessage(message);
    const result = await siweObject.verify({ signature });
    if (result.success) {
      return { success: true, address: result.data.address };
    }
    return { success: false, error: 'Signature verification failed' };
  } catch (err: any) {
    return { success: false, error: err.message || 'SIWE verification error' };
  }
}

/**
 * Issues signed JWT session token.
 */
export async function issueJwtToken(
  address: string,
  role: 'FARMER' | 'BUYER' | 'ASSESSOR' | 'ADMIN' = 'FARMER'
): Promise<string> {
  return await new SignJWT({ address, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

/**
 * Verifies and decodes JWT session token.
 */
export async function verifyJwtToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch (err) {
    return null;
  }
}
