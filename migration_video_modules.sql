-- 1. Create course_videos table
CREATE TABLE IF NOT EXISTS public.course_videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    youtube_id TEXT NOT NULL,
    points_awarded INTEGER DEFAULT 10,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for course_videos
ALTER TABLE public.course_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to course_videos" ON public.course_videos
    FOR SELECT USING (true);

CREATE POLICY "Allow admins to insert course_videos" ON public.course_videos
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Allow admins to update course_videos" ON public.course_videos
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Allow admins to delete course_videos" ON public.course_videos
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 2. Create student_progress table
CREATE TABLE IF NOT EXISTS public.student_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    video_id UUID REFERENCES public.course_videos(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id, video_id) -- Prevent duplicate completions
);

-- RLS for student_progress
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read own progress" ON public.student_progress
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own progress" ON public.student_progress
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Admins can read all progress" ON public.student_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );
