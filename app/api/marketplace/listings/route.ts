import { NextRequest, NextResponse } from 'next/server';
import { enforceRateLimit, flagMaliciousClient } from '@/lib/security/rate-limiter';
import { applySecurityHeaders } from '@/lib/security/headers';
import {
  createListingSchema,
  containsSqlInjectionPayload,
  containsXSSPayload,
  isPrototypePolluted,
} from '@/lib/security/sanitize';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rateLimitError = enforceRateLimit(ip, { limit: 100, windowMs: 60 * 1000 });
  if (rateLimitError) return rateLimitError;

  const listings = db.getListings();
  const response = NextResponse.json({ success: true, count: listings.length, data: listings });
  return applySecurityHeaders(response);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rateLimitError = enforceRateLimit(ip, { limit: 20, windowMs: 60 * 1000 });
  if (rateLimitError) return rateLimitError;

  try {
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);

    // 1. Prototype Pollution Inspection
    if (isPrototypePolluted(body)) {
      flagMaliciousClient(ip);
      db.logSecurityEvent(ip, 'ATTACK_PROTOTYPE_POLLUTION', 'Prototype pollution signature in listing request', 'BLOCKED');
      return NextResponse.json({ error: 'Malicious payload detected' }, { status: 400 });
    }

    // 2. SQL Injection & XSS Inspection
    const rawStringValues = JSON.stringify(body);
    if (containsSqlInjectionPayload(rawStringValues)) {
      flagMaliciousClient(ip);
      db.logSecurityEvent(ip, 'ATTACK_SQL_INJECTION', 'SQLi signature in listing request', 'BLOCKED');
      return NextResponse.json({ error: 'SQL Injection attack detected and blocked' }, { status: 400 });
    }

    if (containsXSSPayload(rawStringValues)) {
      flagMaliciousClient(ip);
      db.logSecurityEvent(ip, 'ATTACK_XSS', 'XSS signature in listing request', 'BLOCKED');
      return NextResponse.json({ error: 'XSS attack vector detected and blocked' }, { status: 400 });
    }

    // 3. Schema Validation
    const validated = createListingSchema.safeParse(body);
    if (!validated.success) {
      db.logSecurityEvent(ip, 'LISTING_CREATE_INVALID', JSON.stringify(validated.error.format()), 'BLOCKED');
      return NextResponse.json(
        { error: 'Invalid listing payload', details: validated.error.format() },
        { status: 400 }
      );
    }

    const { cropId, minimumPrice, durationDays, farmerAddress } = validated.data;

    const crop = db.getCropById(cropId);
    if (!crop) {
      return NextResponse.json({ error: `Crop #${cropId} does not exist` }, { status: 404 });
    }

    const expiresAt = Math.floor(Date.now() / 1000) + durationDays * 86400;

    const newListing = db.addListing({
      cropId,
      farmer: farmerAddress,
      minimumPrice,
      expiresAt,
      active: true,
    });

    db.updateCropStatus(cropId, 'Listed');

    db.logSecurityEvent(ip, 'LISTING_CREATED', `Listing #${newListing.listingId} created for Crop #${cropId}`, 'ALLOWED');

    const response = NextResponse.json({
      success: true,
      message: 'Listing created successfully',
      listing: newListing,
    });

    return applySecurityHeaders(response);
  } catch (err: any) {
    db.logSecurityEvent(ip, 'LISTING_CREATE_ERROR', err.message || 'Server error', 'BLOCKED');
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}
