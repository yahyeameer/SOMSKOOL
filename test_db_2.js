const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  // Fix the admin user
  console.log('Fixing admin user...');
  const { data: updateData, error: updateError } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('full_name', 'Yahya Mohamed');
    
  if (updateError) console.error('Error updating profile:', updateError);
  else console.log('Successfully set admin role for Yahya Mohamed.');

  const { data: vs, error: vsError } = await supabase.from('video_settings').select('video_title');
  if (vsError) console.error('Error fetching video settings:', vsError);
  else console.log('Video Settings:', vs);
}

testConnection();
