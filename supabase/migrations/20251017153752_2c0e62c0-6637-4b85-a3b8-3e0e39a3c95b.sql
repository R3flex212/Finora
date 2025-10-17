-- Enable RLS on the view by creating a security policy
-- First, we need to enable RLS on the view
ALTER VIEW public.course_progress_by_user SET (security_invoker = true);

-- Create a policy to allow users to view only their own progress
-- Since this is a view, we grant direct access through grants
GRANT SELECT ON public.course_progress_by_user TO authenticated;

-- Revoke from public
REVOKE ALL ON public.course_progress_by_user FROM PUBLIC;