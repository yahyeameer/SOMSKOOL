import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in environment");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixImages() {
  console.log("Fetching courses...");
  const { data: courses, error } = await supabase.from('courses').select('id, thumbnail_url');
  
  if (error) {
    console.error("Error fetching courses:", error);
    return;
  }

  for (const course of courses) {
    if (!course.thumbnail_url.includes('?')) {
      const fixedUrl = `${course.thumbnail_url}?auto=format&fit=crop&w=800&h=450&q=80`;
      console.log(`Fixing thumbnail for course ${course.id}...`);
      const { error: updateError } = await supabase
        .from('courses')
        .update({ thumbnail_url: fixedUrl })
        .eq('id', course.id);
        
      if (updateError) {
        console.error(`Failed to update course ${course.id}:`, updateError);
      } else {
        console.log(`Course ${course.id} updated.`);
      }
    } else {
      console.log(`Course ${course.id} already has URL params.`);
    }
  }
  console.log("Done.");
}

fixImages();
