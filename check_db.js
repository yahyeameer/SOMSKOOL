const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  const { data, error } = await supabase
    .from('video_settings')
    .select('*')
    .eq('id', 1)
    .single();
  
  if (error) {
    console.error('Error fetching:', error.message);
  } else {
    console.log('Successfully fetched video_settings row:');
    console.log(data);
  }
}

check();
