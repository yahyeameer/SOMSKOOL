-- ============================================================================
-- SECURITY HARDENING MIGRATION
-- Applied to the live SOMSKOOL database; kept here so the repo stays in sync.
-- ============================================================================

-- 0. Schema drift fixes (these existed in the live DB but were missing from repo)
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS reject_reason TEXT;

CREATE TABLE IF NOT EXISTS public.roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- 1. Prevent privilege escalation on profiles.
--    Non-admins may still update their own row (name, avatar) but CANNOT change
--    `role` or `points`. Admins, and trusted server contexts using the service
--    role (auth.uid() IS NULL), are allowed through.
CREATE OR REPLACE FUNCTION public.guard_profile_privileged_cols()
RETURNS trigger AS $$
BEGIN
  IF (NEW.role IS DISTINCT FROM OLD.role) OR (NEW.points IS DISTINCT FROM OLD.points) THEN
    IF auth.uid() IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ) THEN
      RAISE EXCEPTION 'Not allowed to change role or points';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS protect_profile_privileged_cols ON public.profiles;
CREATE TRIGGER protect_profile_privileged_cols
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_profile_privileged_cols();

-- 2. Harden SECURITY DEFINER functions: pin search_path and remove public/REST access.
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.increment_points(uuid, integer) SET search_path = public;

REVOKE ALL ON FUNCTION public.guard_profile_privileged_cols() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
-- increment_points is invoked only from server code via the service role.
REVOKE ALL ON FUNCTION public.increment_points(uuid, integer) FROM PUBLIC, anon, authenticated;
