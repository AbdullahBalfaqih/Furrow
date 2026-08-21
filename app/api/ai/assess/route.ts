import { NextRequest, NextResponse } from 'next/server';
import { enforceRateLimit, flagMaliciousClient } from '@/lib/security/rate-limiter';
import { applySecurityHeaders } from '@/lib/security/headers';
import {
  aiAssessmentSchema,
  containsSqlInjectionPayload,
  containsXSSPayload,
  isPrototypePolluted,
} from '@/lib/security/sanitize';
import { uploadToZeroGStorage } from '@/lib/og-storage';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  
  // Strict Rate Limiting for AI Inference (Max 10 per minute per IP)
  const rateLimitError = enforceRateLimit(ip, { limit: 10, windowMs: 60 * 1000 });
  if (rateLimitError) return rateLimitError;

  try {
    const rawBody = await req.text();

    // Check Payload Size Limit (Max 100KB for AI raw data)
    if (Buffer.byteLength(rawBody, 'utf-8') > 100 * 1024) {
      db.logSecurityEvent(ip, 'PAYLOAD_TOO_LARGE', 'AI payload exceeded 100KB size limit', 'BLOCKED');
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    const body = JSON.parse(rawBody);

    // 1. Prototype Pollution Check
    if (isPrototypePolluted(body)) {
      flagMaliciousClient(ip);
      db.logSecurityEvent(ip, 'ATTACK_PROTOTYPE_POLLUTION', 'Prototype pollution in AI assessment payload', 'BLOCKED');
      return NextResponse.json({ error: 'Malicious payload detected' }, { status: 400 });
    }

    // 2. Attack Signature Check (SQLi / XSS)
    const rawStringValues = JSON.stringify(body);
    if (containsSqlInjectionPayload(rawStringValues)) {
      flagMaliciousClient(ip);
      db.logSecurityEvent(ip, 'ATTACK_SQL_INJECTION', 'SQLi payload detected in AI assessment endpoint', 'BLOCKED');
      return NextResponse.json({ error: 'SQL Injection attack detected and blocked' }, { status: 400 });
    }

    if (containsXSSPayload(rawStringValues)) {
      flagMaliciousClient(ip);
      db.logSecurityEvent(ip, 'ATTACK_XSS', 'XSS payload detected in AI assessment endpoint', 'BLOCKED');
      return NextResponse.json({ error: 'XSS attack vector detected and blocked' }, { status: 400 });
    }

    // 3. Schema Validation
    const validated = aiAssessmentSchema.safeParse(body);
    if (!validated.success) {
      db.logSecurityEvent(ip, 'AI_ASSESS_INVALID', JSON.stringify(validated.error.format()), 'BLOCKED');
      return NextResponse.json(
        { error: 'Invalid AI assessment payload', details: validated.error.format() },
        { status: 400 }
      );
    }

    const { cropId, qualityScore, grade, estimatedValue, modelVersion, rawPayload } = validated.data;

    const crop = db.getCropById(cropId);
    if (!crop) {
      return NextResponse.json({ error: `Crop #${cropId} does not exist` }, { status: 404 });
    }

    // Upload raw AI vision payload to 0G Storage
    const ogResult = await uploadToZeroGStorage(crop.cropType, 'ai-vision-heatmap', rawPayload);

    const assessmentRecord = db.addAssessment({
      cropId,
      qualityScore,
      grade,
      estimatedValue,
      modelVersion,
      assessmentHash: ogResult.metadataHash,
      timestamp: Math.floor(Date.now() / 1000),
      assessor: '0x0388865e1daf2427De6111cf8548ed1871656180',
    });

    db.logSecurityEvent(ip, 'AI_ASSESSMENT_SUBMITTED', `Crop #${cropId} evaluated with score ${qualityScore}`, 'ALLOWED');

    const response = NextResponse.json({
      success: true,
      message: 'AI Assessment processed and recorded',
      assessment: assessmentRecord,
      zeroGStorage: ogResult,
    });

    return applySecurityHeaders(response);
  } catch (err: any) {
    db.logSecurityEvent(ip, 'AI_ASSESS_ERROR', err.message || 'Server error', 'BLOCKED');
    return NextResponse.json({ error: 'AI assessment processing failed' }, { status: 500 });
  }
}
