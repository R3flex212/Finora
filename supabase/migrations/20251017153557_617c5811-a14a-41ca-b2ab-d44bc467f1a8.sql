-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  short_description TEXT,
  level TEXT NOT NULL CHECK (level IN ('Începător', 'Intermediar', 'Avansat')),
  duration TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chapters table
CREATE TABLE public.chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(course_id, position)
);

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  duration_minutes INTEGER,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(chapter_id, position)
);

-- Create enrollments table
CREATE TABLE public.enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create user_lesson_progress table
CREATE TABLE public.user_lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses (public read for published courses)
CREATE POLICY "Anyone can view published courses"
  ON public.courses FOR SELECT
  USING (published = true);

-- RLS Policies for chapters (public read for published courses)
CREATE POLICY "Anyone can view chapters of published courses"
  ON public.chapters FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = chapters.course_id
      AND courses.published = true
    )
  );

-- RLS Policies for lessons (public read for published courses)
CREATE POLICY "Anyone can view lessons of published courses"
  ON public.lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chapters
      JOIN public.courses ON courses.id = chapters.course_id
      WHERE chapters.id = lessons.chapter_id
      AND courses.published = true
    )
  );

-- RLS Policies for enrollments
CREATE POLICY "Users can view their own enrollments"
  ON public.enrollments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own enrollments"
  ON public.enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own enrollments"
  ON public.enrollments FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for user_lesson_progress
CREATE POLICY "Users can view their own progress"
  ON public.user_lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.user_lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_lesson_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Create view for course progress calculation
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

-- Add updated_at triggers
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_chapters_updated_at
  BEFORE UPDATE ON public.chapters
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_user_lesson_progress_updated_at
  BEFORE UPDATE ON public.user_lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample courses
INSERT INTO public.courses (title, slug, description, short_description, level, duration, published) VALUES
  ('Analiza Fundamentală', 'analiza-fundamentala', 'Învață să evaluezi companiile prin analiza bilanțurilor, rapoartelor financiare și indicatorilor cheie. Acest curs te va învăța să înțelegi sănătatea financiară a unei companii și să identifici oportunități de investiție.', 'Învață să evaluezi companiile prin analiza bilanțurilor, rapoartelor financiare și indicatorilor cheie.', 'Începător', '6 săptămâni', true),
  ('Analiza Tehnică', 'analiza-tehnica', 'Stăpânește graficele, indicatorii tehnici și pattern-urile pentru a identifica oportunitățile de trading. Vei învăța să citești graficele de preț și să anticipezi mișcările pieței.', 'Stăpânește graficele, indicatorii tehnici și pattern-urile pentru a identifica oportunitățile de trading.', 'Intermediar', '8 săptămâni', true),
  ('Managementul Portofoliului', 'managementul-portofoliului', 'Construiește și gestionează un portofoliu diversificat care să-ți atingă obiectivele financiare. Învață strategii de alocare a activelor și rebalansare.', 'Construiește și gestionează un portofoliu diversificat care să-ți atingă obiectivele financiare.', 'Intermediar', '4 săptămâni', true),
  ('Psihologia Investițiilor', 'psihologia-investitiilor', 'Înțelege comportamentul pieței și dezvoltă disciplina mentală necesară pentru succesul pe termen lung. Evită capcanele psihologice ale investițiilor.', 'Înțelege comportamentul pieței și dezvoltă disciplina mentală necesară pentru succesul pe termen lung.', 'Avansat', '5 săptămâni', true);

-- Insert sample chapters for first course
INSERT INTO public.chapters (course_id, title, description, position)
SELECT id, 'Introducere în Analiza Fundamentală', 'Concepte de bază și principii fundamentale', 1
FROM public.courses WHERE slug = 'analiza-fundamentala'
UNION ALL
SELECT id, 'Citirea Rapoartelor Financiare', 'Cum să înțelegi bilanțul și contul de profit și pierdere', 2
FROM public.courses WHERE slug = 'analiza-fundamentala'
UNION ALL
SELECT id, 'Indicatori Cheie', 'P/E ratio, ROE, debt-to-equity și alții', 3
FROM public.courses WHERE slug = 'analiza-fundamentala';

-- Insert sample lessons for first chapter
INSERT INTO public.lessons (chapter_id, title, content, position)
SELECT id, 'Ce este analiza fundamentală?', 'Introducere în principiile analizei fundamentale...', 1
FROM public.chapters WHERE title = 'Introducere în Analiza Fundamentală'
UNION ALL
SELECT id, 'De ce este importantă?', 'Beneficiile analizei fundamentale pentru investitori...', 2
FROM public.chapters WHERE title = 'Introducere în Analiza Fundamentală'
UNION ALL
SELECT id, 'Diferența față de analiza tehnică', 'Comparație între cele două abordări...', 3
FROM public.chapters WHERE title = 'Introducere în Analiza Fundamentală';