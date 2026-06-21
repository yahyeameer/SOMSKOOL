const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  console.log('🔧 Running SQL migrations via rpc...\n');

  // Use the postgrest SQL execution via a temporary function
  const migrationSQL = `
    -- Add points column to profiles
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;
    
    -- Add video_title and video_thumbnail_url to video_settings
    ALTER TABLE public.video_settings ADD COLUMN IF NOT EXISTS video_title TEXT DEFAULT '';
    ALTER TABLE public.video_settings ADD COLUMN IF NOT EXISTS video_thumbnail_url TEXT DEFAULT '';
    
    -- Add category_slug to courses
    ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS category_slug TEXT;
    
    -- Create documents table
    CREATE TABLE IF NOT EXISTS public.documents (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title TEXT NOT NULL,
      course_id UUID REFERENCES public.courses(id),
      course_title TEXT,
      type TEXT NOT NULL DEFAULT 'pdf',
      url TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );
    
    -- Enable RLS on documents
    ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
    
    -- Documents policies
    DO $$ BEGIN
      CREATE POLICY "Documents are viewable by everyone" ON public.documents FOR SELECT USING (true);
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    
    DO $$ BEGIN
      CREATE POLICY "Only admins can modify documents" ON public.documents FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
      );
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `;

  // We need to execute this via the SQL Editor in dashboard since supabase-js doesn't support raw SQL.
  // Instead, let's write it to a file and instruct the user.
  
  const fs = require('fs');
  fs.writeFileSync('migration_to_run.sql', migrationSQL.trim());
  
  console.log('✅ Migration SQL written to: migration_to_run.sql');
  console.log('\n📋 You need to run this SQL in your Supabase Dashboard:');
  console.log(`   1. Go to https://supabase.com/dashboard/project/azicxlgaodpdjggzqoyr/sql`);
  console.log('   2. Paste the contents of migration_to_run.sql');
  console.log('   3. Click "Run"\n');
  console.log('--- SQL Preview ---');
  console.log(migrationSQL.trim());
}

runMigration();
