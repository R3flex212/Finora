-- Add is_free_preview to lessons for gating
ALTER TABLE public.lessons
ADD COLUMN is_free_preview BOOLEAN NOT NULL DEFAULT false;

-- Extend user_lesson_progress with detailed tracking
ALTER TABLE public.user_lesson_progress
ADD COLUMN seconds_watched INTEGER NOT NULL DEFAULT 0,
ADD COLUMN last_position_seconds INTEGER NOT NULL DEFAULT 0,
ADD COLUMN duration_seconds INTEGER;

-- Update the view to include more detailed progress
DROP VIEW IF EXISTS public.course_progress_by_user;

CREATE OR REPLACE VIEW public.course_progress_by_user AS
SELECT 
  e.user_id,
  e.course_id,
  c.title as course_title,
  c.slug as course_slug,
  COUNT(DISTINCT l.id) as total_lessons,
  COUNT(DISTINCT CASE WHEN ulp.completed = true THEN ulp.lesson_id END) as completed_lessons,
  CASE 
    WHEN COUNT(DISTINCT l.id) > 0 
    THEN ROUND((COUNT(DISTINCT CASE WHEN ulp.completed = true THEN ulp.lesson_id END)::numeric / COUNT(DISTINCT l.id)::numeric) * 100, 2)
    ELSE 0
  END as progress_percent
FROM public.enrollments e
JOIN public.courses c ON c.id = e.course_id
LEFT JOIN public.chapters ch ON ch.course_id = c.id
LEFT JOIN public.lessons l ON l.chapter_id = ch.id
LEFT JOIN public.user_lesson_progress ulp ON ulp.lesson_id = l.id AND ulp.user_id = e.user_id
GROUP BY e.user_id, e.course_id, c.title, c.slug;

-- Grant view access
GRANT SELECT ON public.course_progress_by_user TO authenticated;