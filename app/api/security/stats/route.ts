import { NextRequest, NextResponse } from 'next/server';
import { applySecurityHeaders } from '@/lib/security/headers';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const logs = db.getSecurityLogs();
  
  const totalEvents = logs.length;
  const blockedEvents = logs.filter((l) => l.status === 'BLOCKED').length;
  const allowedEvents = logs.filter((l) => l.status === 'ALLOWED').length;

  const response = NextResponse.json({
    status: 'ACTIVE',
    securityEngine: 'Furrow Chain Sentinel 1.0',
    network: '0G Galileo Testnet (Chain ID 16602)',
    metrics: {
      totalEvents,
      allowedEvents,
      blockedEvents,
      threatsBlockedPercent: totalEvents > 0 ? ((blockedEvents / totalEvents) * 100).toFixed(1) + '%' : '0%',
    },
    recentLogs: logs.slice(-20).reverse(),
  });

  return applySecurityHeaders(response);
}
