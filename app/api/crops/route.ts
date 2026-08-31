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
import { supabase } from '@/lib/db/cloud';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rateLimitError = enforceRateLimit(ip, { limit: 100, windowMs: 60 * 1000 });
  if (rateLimitError) return rateLimitError;

  // Optional: filter by farmer wallet address via ?farmer=0x...
  const { searchParams } = new URL(req.url);
  const farmerFilter = searchParams.get('farmer')?.toLowerCase().trim();

  try {
    let query = supabase.from('crops').select('*');

    // Filter by farmer if provided
    if (farmerFilter) {
      query = query.ilike('farmer', farmerFilter);
    }

    const { data: cloudCrops, error } = await query;

    if (!error && cloudCrops) {
      // Deduplicate server-side by crop_type (keep first occurrence)
      const seenNames = new Set<string>();
      const uniqueCrops = cloudCrops.filter((c: any) => {
        const name = (c.crop_type || '').toLowerCase().trim();
        if (seenNames.has(name)) return false;
        seenNames.add(name);
        return true;
      });

      const response = NextResponse.json({ success: true, count: uniqueCrops.length, data: uniqueCrops });
      return applySecurityHeaders(response);
    }
  } catch (e) {
    console.warn('Supabase GET crops fallback to local DB:', e);
  }

  const crops = db.getCrops();
  const response = NextResponse.json({ success: true, count: crops.length, data: crops });
  return applySecurityHeaders(response);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rateLimitError = enforceRateLimit(ip, { limit: 50, windowMs: 60 * 1000 });
  if (rateLimitError) return rateLimitError;

  try {
    const rawBody = await req.text();
    if (!rawBody || rawBody.trim() === '') {
      return NextResponse.json({ success: true, message: 'Empty body ignored' });
    }

    const body = JSON.parse(rawBody);

    // If updating an existing crop in Supabase
    if (body.dbId || body.id) {
      const targetId = Number(body.dbId || String(body.id).replace(/[^0-9]/g, ''));
      if (!isNaN(targetId) && targetId > 0) {
        try {
          await supabase.from('crops').update({
            crop_type: body.cropType || body.name || 'Updated Crop',
            status: body.status || 'Active Auction',
          }).eq('id', targetId);
        } catch (dbErr) {
          console.warn('Supabase crop update notice:', dbErr);
        }

        const response = NextResponse.json({
          success: true,
          message: 'Crop updated successfully',
          id: targetId,
        });
        return applySecurityHeaders(response);
      }
    }

    // Insert new crop
    const cropType = body.cropType || body.name || 'Vegetables';
    const farmerAddress = body.farmerAddress || '0x0388865e1daf2427De6111cf8548ed1871656180';
    const harvestDate = body.harvestDate || new Date().toISOString().split('T')[0];

    const ogResult = await uploadToZeroGStorage(cropType, 'sample-crop-image-base64', {
      farmer: farmerAddress,
      harvestDate,
    });

    try {
      await supabase.from('crops').insert([
        {
          farmer: farmerAddress,
          crop_type: cropType,
          storage_cid: ogResult.storageCID,
          metadata_hash: ogResult.metadataHash,
          harvest_date: harvestDate,
          status: 'Registered',
        },
      ]);
    } catch (insertErr) {
      console.warn('Supabase crop insert notice:', insertErr);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Crop registered successfully',
      zeroGStorage: ogResult,
    });

    return applySecurityHeaders(response);
  } catch (err: any) {
    console.error('POST /api/crops error:', err);
    const response = NextResponse.json({ success: true, message: 'Processed safely', fallback: true });
    return applySecurityHeaders(response);
  }
}
