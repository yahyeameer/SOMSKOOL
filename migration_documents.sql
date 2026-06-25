-- Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    course_title TEXT NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for documents
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view documents
CREATE POLICY "Allow public read access to documents" ON public.documents
    FOR SELECT USING (true);

-- Allow admins to insert documents
CREATE POLICY "Allow admins to insert documents" ON public.documents
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Allow admins to update documents
CREATE POLICY "Allow admins to update documents" ON public.documents
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Allow admins to delete documents
CREATE POLICY "Allow admins to delete documents" ON public.documents
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );
