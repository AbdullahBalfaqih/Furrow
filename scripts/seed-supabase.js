const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xtzxxxdjphahxskgalgw.supabase.co';
const supabaseKey = 'sb_publishable_3jJHafjCD6PVs4rhEFFrXA_XdTinJ9J';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndSeedDatabase() {
  console.log('=================================================');
  console.log('TESTING LIVE SUPABASE CONNECTION & TABLES:');
  console.log('=================================================');

  try {
    const { data: crops, error: cropsErr } = await supabase.from('crops').select('*');
    if (cropsErr) {
      console.log('❌ Supabase Tables Notice:', cropsErr.message);
      console.log('\n👉 NOTE: Tables need to be created in Supabase SQL Editor once.');
    } else {
      console.log('✔ Connected to Supabase Successfully!');
      console.log('✔ Live Crops Table Count:', crops.length);
    }
  } catch (err) {
    console.error('Error connecting to Supabase:', err.message);
  }
  console.log('=================================================');
}

checkAndSeedDatabase();
