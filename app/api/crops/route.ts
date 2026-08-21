import { NextRequest, NextResponse } from 'next/server';
import { enforceRateLimit, flagMaliciousClient } from '@/lib/security/rate-limiter';
import { applySecurityHeaders } from '@/lib/security/headers';
import {
  registerCropSchema,
  containsSqlInjectionPayload,
  containsXSSPayload,
  isPrototypePolluted,
} from '@/lib/security/sanitize';
import { uploadToZeroGStorage } from '@/lib/og-storage';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rateLimitError = enforceRateLimit(ip, { limit: 100, windowMs: 60 * 1000 });
  if (rateLimitError) return rateLimitError;

  const crops = db.getCrops();
  const response = NextResponse.json({ success: true, count: crops.length, data: crops });
  return applySecurityHeaders(response);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rateLimitError = enforceRateLimit(ip, { limit: 20, windowMs: 60 * 1000 });
  if (rateLimitError) return rateLimitError;

  try {
    const rawBody = await req.text();
    
    // Check Payload Size Limit (Max 1MB)
    if (Buffer.byteLength(rawBody, 'utf-8') > 1024 * 1024) {
      db.logSecurityEvent(ip, 'PAYLOAD_TOO_LARGE', 'Crop payload exceeded 1MB size limit', 'BLOCKED');
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    const body = JSON.parse(rawBody);

    // 1. Check Prototype Pollution
    if (isPrototypePolluted(body)) {
      flagMaliciousClient(ip);
      db.logSecurityEvent(ip, 'ATTACK_PROTOTYPE_POLLUTION', 'Prototype pollution signature detected', 'BLOCKED');
      return NextResponse.json({ error: 'Malicious payload detected' }, { status: 400 });
    }

    // 2. Check SQL Injection & XSS Attack Signatures across string fields
    const rawStringValues = JSON.stringify(body);
    if (containsSqlInjectionPayload(rawStringValues)) {
      flagMaliciousClient(ip);
      db.logSecurityEvent(ip, 'ATTACK_SQL_INJECTION', `SQLi signature blocked: ${rawStringValues.substring(0, 100)}`, 'BLOCKED');
      return NextResponse.json({ error: 'SQL Injection attack detected and blocked' }, { status: 400 });
    }

    if (containsXSSPayload(rawStringValues)) {
      flagMaliciousClient(ip);
      db.logSecurityEvent(ip, 'ATTACK_XSS', `XSS signature blocked: ${rawStringValues.substring(0, 100)}`, 'BLOCKED');
      return NextResponse.json({ error: 'XSS attack vector detected and blocked' }, { status: 400 });
    }

    // 3. Schema Validation
    const validated = registerCropSchema.safeParse(body);
    if (!validated.success) {
      db.logSecurityEvent(ip, 'CROP_REGISTER_INVALID', JSON.stringify(validated.error.format()), 'BLOCKED');
      return NextResponse.json(
        { error: 'Invalid crop data payload', details: validated.error.format() },
        { status: 400 }
      );
    }

    const { cropType, farmerAddress, harvestDate, storageCID: providedCID, metadataHash: providedHash } = validated.data;

    // Upload payload to 0G Storage
    const ogResult = await uploadToZeroGStorage(cropType, 'sample-crop-image-base64', {
      farmer: farmerAddress,
      harvestDate,
    });

    const newCrop = db.addCrop({
      farmer: farmerAddress,
      cropType,
      storageCID: providedCID || ogResult.storageCID,
      metadataHash: providedHash || ogResult.metadataHash,
      harvestDate,
      status: 'Registered',
    });

    db.logSecurityEvent(ip, 'CROP_REGISTERED', `Crop #${newCrop.id} registered by ${farmerAddress}`, 'ALLOWED');

    const response = NextResponse.json({
      success: true,
      message: 'Crop registered successfully',
      crop: newCrop,
      zeroGStorage: ogResult,
    });

    return applySecurityHeaders(response);
  } catch (err: any) {
    db.logSecurityEvent(ip, 'CROP_REGISTER_ERROR', err.message || 'Server error', 'BLOCKED');
    return NextResponse.json({ error: 'Failed to register crop' }, { status: 500 });
  }
}
