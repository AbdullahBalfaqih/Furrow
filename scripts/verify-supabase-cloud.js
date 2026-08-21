const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://xtzxxxdjphahxskgalgw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_3jJHafjCD6PVs4rhEFFrXA_XdTinJ9J';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkCloudDatabase() {
  console.log('=================================================');
  console.log('VERIFYING SUPABASE CLOUD TABLES & INTEGRATION');
  console.log('Target Supabase Project:', SUPABASE_URL);
  console.log('=================================================\n');

  // 1. Query Crops Table
  const { data: crops, error: cropsErr } = await supabase.from('crops').select('*');
  if (cropsErr) {
    console.error('❌ Crops Table Query Error:', cropsErr.message);
  } else {
    console.log(`✔ Crops Table Active! Total Records: ${crops.length}`);
  }

  // 2. Upsert a test user to verify Users Table
  const testWallet = '0x0388865e1daf2427De6111cf8548ed1871656180';
  const { data: userData, error: userErr } = await supabase
    .from('users')
    .upsert({
      wallet_address: testWallet,
      role: 'merchant',
      name: 'Al-Qassim Date & Crop Merchant',
      email: 'merchant@qassim.farm',
      created_at: Math.floor(Date.now() / 1000),
    })
    .select();

  if (userErr) {
    console.log('⚠ Users table needs SQL DDL creation in Supabase SQL Editor:', userErr.message);
  } else {
    console.log('✔ Users Table Active! User synced successfully:', userData[0].wallet_address);
  }

  console.log('\n=================================================');
}

checkCloudDatabase();
