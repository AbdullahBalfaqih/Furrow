/**
 * Furrow Chain Cybersecurity Layer - Sliding Window Rate Limiter & IP Auto-Blacklisting
 * Protects API routes against DDoS attacks, brute force, and automated vulnerability scanners.
 */

import { NextResponse } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetTime: number;
  offenseCount: number;
  blacklistedUntil: number;
}

const clientStore = new Map<string, RateLimitRecord>();

// Cleanup stale records every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of clientStore.entries()) {
      if (now > record.resetTime && now > record.blacklistedUntil) {
        clientStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  limit?: number;        // Max allowed requests in window
  windowMs?: number;     // Window duration in milliseconds
}

/**
 * Flag an IP for malicious payload attempts. Auto-blacklists after 5 offenses.
 */
export function flagMaliciousClient(clientIdentifier: string) {
  const record = clientStore.get(clientIdentifier) || {
    count: 0,
    resetTime: Date.now() + 60 * 1000,
    offenseCount: 0,
    blacklistedUntil: 0,
  };

  record.offenseCount += 1;
  if (record.offenseCount >= 5) {
    record.blacklistedUntil = Date.now() + 60 * 60 * 1000; // Blacklisted for 1 hour
    console.warn(`[CYBERSECURITY ALERT] IP/Client ${clientIdentifier} HAS BEEN AUTO-BLACKLISTED FOR 1 HOUR.`);
  }

  clientStore.set(clientIdentifier, record);
}

/**
 * Checks if incoming client IP has exceeded rate limit bounds or is blacklisted.
 */
export function checkRateLimit(
  clientIdentifier: string,
  options: RateLimitOptions = {}
): { allowed: boolean; remaining: number; resetTime: number; isBlacklisted: boolean } {
  const limit = options.limit || 60; // Default: 60 requests
  const windowMs = options.windowMs || 60 * 1000; // Default: 1 minute
  const now = Date.now();

  const record = clientStore.get(clientIdentifier);

  if (record && record.blacklistedUntil > now) {
    return { allowed: false, remaining: 0, resetTime: record.blacklistedUntil, isBlacklisted: true };
  }

  if (!record || now > record.resetTime) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + windowMs,
      offenseCount: record?.offenseCount || 0,
      blacklistedUntil: 0,
    };
    clientStore.set(clientIdentifier, newRecord);
    return { allowed: true, remaining: limit - 1, resetTime: newRecord.resetTime, isBlacklisted: false };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime, isBlacklisted: false };
  }

  record.count += 1;
  clientStore.set(clientIdentifier, record);

  return { allowed: true, remaining: limit - record.count, resetTime: record.resetTime, isBlacklisted: false };
}

/**
 * Middleware helper returning HTTP 429 / HTTP 403 response if rate limit exceeded or client blacklisted.
 */
export function enforceRateLimit(
  clientIdentifier: string,
  options: RateLimitOptions = {}
): NextResponse | null {
  const result = checkRateLimit(clientIdentifier, options);

  if (result.isBlacklisted) {
    return NextResponse.json(
      {
        error: 'Forbidden',
        message: 'IP Address has been blacklisted due to multiple security violations.',
        blacklistedUntil: new Date(result.resetTime).toISOString(),
      },
      { status: 403 }
    );
  }

  if (!result.allowed) {
    return NextResponse.json(
      {
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please wait before retrying.',
        retryAfterSeconds: Math.ceil((result.resetTime - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((result.resetTime - Date.now()) / 1000)),
          'X-RateLimit-Limit': String(options.limit || 60),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(result.resetTime),
        },
      }
    );
  }

  return null;
}
