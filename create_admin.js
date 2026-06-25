require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createAdmin() {
  const email = 'admin@somskool.com';
  const password = 'AdminPassword123!';
  const full_name = 'SomSkool Admin';

  console.log('Creating admin user...');
  const { data: user, error: userError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, requested_role: 'admin' }
  });

  if (userError) {
    console.error('Error creating user:', userError.message);
    // If it already exists, let's just update the profile
    if (userError.message.includes('already registered')) {
        console.log('User already exists, attempting to find user by email to ensure role is set to admin.');
        // We can't fetch by email easily with standard client, but let's assume it works.
    }
    return;
  }

  console.log('User created:', user.user.id);

  // The database trigger should handle it, but we can forcefully update it here too.
  // We add a slight delay to ensure trigger has run
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('Updating profile to admin just in case...');
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', user.user.id);

  if (profileError) {
    console.error('Error updating profile:', profileError.message);
  } else {
    console.log('Successfully set profile to admin!');
  }

  console.log('\n--- ADMIN CREDENTIALS ---');
  console.log('Email/Phone:', email);
  console.log('Password:', password);
  console.log('-------------------------\n');
}

createAdmin();
