-- ==========================================
-- SOMSKOOL DATABASE SCHEMA & RLS POLICIES
-- ==========================================

-- Enable the uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked to auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profile Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Student'),
    CASE WHEN new.email ILIKE '%admin%' THEN 'admin' WHEN new.email ILIKE '%teacher%' THEN 'teacher' ELSE 'student' END,
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. COURSES TABLE
CREATE TABLE public.courses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  thumbnail_url TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  is_free BOOLEAN NOT NULL DEFAULT false,
  level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  duration_minutes INTEGER NOT NULL,
  instructor_name TEXT NOT NULL,
  instructor_avatar TEXT NOT NULL,
  rating NUMERIC DEFAULT 0,
  total_students INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on courses
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Course Policies
CREATE POLICY "Courses are viewable by everyone" ON public.courses FOR SELECT USING (is_published = true);
CREATE POLICY "Only admins can modify courses" ON public.courses FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);


-- 3. PAYMENTS TABLE
CREATE TABLE public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) NOT NULL,
  course_id UUID REFERENCES public.courses(id) NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('zaad', 'edahab', 'evc_plus', 'golis')),
  transaction_reference TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Payment Policies
CREATE POLICY "Admins can view all payments" ON public.payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Students can view their own payments" ON public.payments FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Students can insert their own payments" ON public.payments FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Only admins can update payment status" ON public.payments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);


-- 4. ENROLLMENTS TABLE
CREATE TABLE public.enrollments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) NOT NULL,
  course_id UUID REFERENCES public.courses(id) NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(student_id, course_id)
);

-- Enable RLS on enrollments
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Enrollment Policies
CREATE POLICY "Students can view their own enrollments" ON public.enrollments FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Admins can view all enrollments" ON public.enrollments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can insert enrollments" ON public.enrollments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);


-- 5. CONTACT MESSAGES TABLE
CREATE TABLE public.contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on contact messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Contact Messages Policies
CREATE POLICY "Anyone can insert a contact message" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can view contact messages" ON public.contact_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);


-- 6. VIDEO SETTINGS (Single row table for homepage video)
CREATE TABLE public.video_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  youtube_id TEXT NOT NULL,
  channel_name TEXT NOT NULL,
  channel_url TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.video_settings ENABLE ROW LEVEL SECURITY;

-- Video Settings Policies
CREATE POLICY "Video settings are viewable by everyone" ON public.video_settings FOR SELECT USING (true);
CREATE POLICY "Only admins can modify video settings" ON public.video_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Insert default video settings
INSERT INTO public.video_settings (youtube_id, channel_name, channel_url) 
VALUES ('ScMzIvxBSi4', 'SomSkool Academy', 'https://youtube.com/@somskool')
ON CONFLICT (id) DO NOTHING;


-- 7. SEED INITIAL COURSES DATA
INSERT INTO public.courses (title, slug, description, thumbnail_url, price, is_free, level, duration_minutes, instructor_name, instructor_avatar, rating, total_students, is_published)
VALUES 
  ('Barashada Web Development (HTML/CSS)', 'web-dev-html-css', 'Baro aasaaska samaynta websites-ka adigoo isticmaalaya HTML5 iyo CSS3. Koorsadan waxay si qoto dheer kuugu sharixi doontaa sida loo dhiso website qurux badan.', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', 25.00, false, 'Beginner', 480, 'Axmed Cali', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', 4.8, 1240, true),
  ('React JS & Next.js Advanced', 'react-nextjs-advanced', 'Dhis web applications casri ah oo xawaare sare leh. Waxaad ku baran doontaa React hooks, state management, iyo Next.js server components.', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee', 45.00, false, 'Advanced', 720, 'Khadar Maxamed', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', 4.9, 850, true),
  ('UI/UX Design Masterclass', 'ui-ux-design', 'Baro sida loo naqshadeeyo barnaamijyo iyo websites ay fududahay in la isticmaalo. Waxaan isticmaali doonaa Figma iyo mabaadiida design-ka.', 'https://images.unsplash.com/photo-1561070791-2526d30994b5', 30.00, false, 'Intermediate', 360, 'Suhur Cabdi', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', 4.7, 520, true)
ON CONFLICT (slug) DO NOTHING;
