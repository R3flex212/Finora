-- Enable realtime for admin tables
ALTER TABLE public.courses REPLICA IDENTITY FULL;
ALTER TABLE public.chapters REPLICA IDENTITY FULL;
ALTER TABLE public.lessons REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.courses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chapters;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lessons;