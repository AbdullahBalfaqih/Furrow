const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xtzxxxdjphahxskgalgw.supabase.co';
const supabaseKey = 'sb_publishable_3jJHafjCD6PVs4rhEFFrXA_XdTinJ9J';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedLiveCrops() {
  console.log('Seeding initial records to live Supabase database...');

  const initialCrops = [
    {
      farmer: '0x0388865e1daf2427De6111cf8548ed1871656180',
      crop_type: 'Organic Premium Tomatoes',
      storage_cid: '0g://bafybeic2h4x92c1tomatoes',
      metadata_hash: '0x655a62af8d9c20be655a62af8d9c20be655a62af8d9c20be655a62af8d9c20be',
      harvest_date: Math.floor(Date.now() / 1000) - 86400 * 2,
      created_at: Math.floor(Date.now() / 1000) - 86400 * 2,
      status: 'Listed',
    },
    {
      farmer: '0x0388865e1daf2427De6111cf8548ed1871656180',
      crop_type: 'Sukari Dates Premium',
      storage_cid: '0g://bafybeic2h4x92c1dates',
      metadata_hash: '0x777a62af8d9c20be655a62af8d9c20be655a62af8d9c20be655a62af8d9c20be',
      harvest_date: Math.floor(Date.now() / 1000) - 86400 * 5,
      created_at: Math.floor(Date.now() / 1000) - 86400 * 5,
      status: 'Listed',
    },
  ];

  const { data, error } = await supabase.from('crops').insert(initialCrops).select();

  if (error) {
    console.error('Insert error:', error.message);
  } else {
    console.log('✔ Successfully seeded crops to live Supabase DB!');
    console.log('✔ Inserted Records Count:', data.length);
  }
}

seedLiveCrops();
