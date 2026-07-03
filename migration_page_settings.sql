-- Create page settings table
CREATE TABLE IF NOT EXISTS public.page_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  about_title TEXT NOT NULL,
  about_subtitle TEXT,
  about_text TEXT NOT NULL,
  about_header_image TEXT,
  contact_title TEXT NOT NULL,
  contact_subtitle TEXT,
  contact_text TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_header_image TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.page_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Page settings are viewable by everyone" 
  ON public.page_settings FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can modify page settings" 
  ON public.page_settings FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Insert default settings based on user request
INSERT INTO public.page_settings (
  id, 
  about_title, 
  about_subtitle,
  about_text,
  about_header_image,
  contact_title, 
  contact_subtitle,
  contact_text, 
  contact_phone,
  contact_header_image
) VALUES (
  1, 
  'About SomSkool', 
  'Empowering the future through education',
  'The SomSkool is a diploma school in Addis Ababa with courses in computer science and english with highly educated teachers.',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80',
  'La xiriir SomSkool', 
  'Fadlan nala soo xiriir haddii aad hayso wax su''aalo ah',
  'SomSkool waxay diyaar u tahay inay ku caawiso. Nala soo xiriir maanta.', 
  '+252 63 XXX XXXX',
  'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80'
) ON CONFLICT (id) DO NOTHING;
