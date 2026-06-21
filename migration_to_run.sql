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