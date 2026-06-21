const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing connection to:', supabaseUrl);
  
  const { data: profiles, error: pError } = await supabase.from('profiles').select('*').limit(3);
  if (pError) console.error('Error fetching profiles:', pError);
  else console.log('Profiles:', profiles);

  const { data: courses, error: cError } = await supabase.from('courses').select('*').limit(3);
  if (cError) console.error('Error fetching courses:', cError);
  else console.log('Courses:', courses);

  // Test inserting an admin user
  const { data: authAdmin, error: adminErr } = await supabase.auth.admin.listUsers();
  if (adminErr) console.error('Error fetching users:', adminErr);
  else console.log('Auth Users:', authAdmin.users.map(u => ({ email: u.email, id: u.id })));
}

testConnection();
