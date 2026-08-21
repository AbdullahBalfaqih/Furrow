import { NextRequest, NextResponse } from 'next/server';
import { enforceRateLimit, flagMaliciousClient } from '@/lib/security/rate-limiter';
import { applySecurityHeaders } from '@/lib/security/headers';
import {
  makeOfferSchema,
  containsSqlInjectionPayload,
  containsXSSPayload,
  isPrototypePolluted,
} from '@/lib/security/sanitize';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rateLimitError = enforceRateLimit(ip, { limit: 100, windowMs: 60 * 1000 });
  if (rateLimitError) return rateLimitError;

  const url = new URL(req.url);
  const listingIdStr = url.searchParams.get('listingId');

  let offers;
  if (listingIdStr) {
    const listingId = parseInt(listingIdStr, 10);
    offers = db.getOffers(listingId);
  } else {
    offers = db.getOffers(1);
  }

  const response = NextResponse.json({ success: true, count: offers.length, data: offers });
  return applySecurityHeaders(response);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rateLimitError = enforceRateLimit(ip, { limit: 30, windowMs: 60 * 1000 });
  if (rateLimitError) return rateLimitError;

  try {
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);

    // 1. Check Prototype Pollution
    if (isPrototypePolluted(body)) {
      flagMaliciousClient(ip);
      db.logSecurityEvent(ip, 'ATTACK_PROTOTYPE_POLLUTION', 'Prototype pollution in bid offer request', 'BLOCKED');
      return NextResponse.json({ error: 'Malicious payload detected' }, { status: 400 });
    }

    // 2. Check SQLi / XSS Attack Signatures
    const rawStringValues = JSON.stringify(body);
    if (containsSqlInjectionPayload(rawStringValues)) {
      flagMaliciousClient(ip);
      db.logSecurityEvent(ip, 'ATTACK_SQL_INJECTION', 'SQLi signature in bid offer request', 'BLOCKED');
      return NextResponse.json({ error: 'SQL Injection attack detected and blocked' }, { status: 400 });
    }

    if (containsXSSPayload(rawStringValues)) {
      flagMaliciousClient(ip);
      db.logSecurityEvent(ip, 'ATTACK_XSS', 'XSS signature in bid offer request', 'BLOCKED');
      return NextResponse.json({ error: 'XSS attack vector detected and blocked' }, { status: 400 });
    }

    // 3. Validate Payload Schema
    const validated = makeOfferSchema.safeParse(body);
    if (!validated.success) {
      db.logSecurityEvent(ip, 'OFFER_MAKE_INVALID', JSON.stringify(validated.error.format()), 'BLOCKED');
      return NextResponse.json(
        { error: 'Invalid offer payload. EVM wallet connection is required.', details: validated.error.format() },
        { status: 400 }
      );
    }

    const { listingId, offerAmount, buyerAddress } = validated.data;

    // Save bid offer to Supabase Cloud DB & Local Store
    const newOffer = db.addOffer({
      listingId,
      buyer: buyerAddress,
      amount: offerAmount,
      active: true,
    });

    db.logSecurityEvent(ip, 'OFFER_SUBMITTED', `Bid offer of ${offerAmount} submitted by ${buyerAddress}`, 'ALLOWED');

    const response = NextResponse.json({
      success: true,
      message: 'Bid offer recorded successfully in Supabase Cloud DB',
      offer: newOffer,
    });

    return applySecurityHeaders(response);
  } catch (err: any) {
    db.logSecurityEvent(ip, 'OFFER_MAKE_ERROR', err.message || 'Server error', 'BLOCKED');
    return NextResponse.json({ error: 'Failed to record bid offer' }, { status: 500 });
  }
}
