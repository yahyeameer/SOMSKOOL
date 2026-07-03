-- 1. Create indexes for performance on high-traffic queries
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON public.payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_course_id ON public.payments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_videos_course_id ON public.course_videos(course_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_course_id ON public.student_progress(course_id);

-- 2. Create RPC function for atomic points incrementation
CREATE OR REPLACE FUNCTION public.increment_points(user_id UUID, points_to_add INT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET points = COALESCE(points, 0) + points_to_add
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
