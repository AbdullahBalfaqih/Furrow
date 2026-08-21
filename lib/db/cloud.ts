/**
 * Furrow Chain Live Supabase Cloud Database Client (`lib/db/cloud.ts`)
 * Interfaces with live Supabase production project instance.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xtzxxxdjphahxskgalgw.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_3jJHafjCD6PVs4rhEFFrXA_XdTinJ9J';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
