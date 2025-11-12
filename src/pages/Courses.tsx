import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Clock, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CoursesProps {
  user: User;
}

type CategoryType = "all" | "finanțe-personale" | "investiții" | "crypto" | "trading" | "planificare-financiară";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string | null;
  level: string;
  duration: string | null;
  published: boolean;
  category?: string;
  lesson_count?: number;
  is_popular?: boolean;
}

interface Enrollment {
  course_id: string;
}

interface CourseProgress {
  course_id: string;
  total_lessons: number;
  completed_lessons: number;
  progress_percent: number;
}

const categories = [
  { id: "all" as CategoryType, label: "Toate Cursurile" },
  { id: "finanțe-personale" as CategoryType, label: "Finanțe Personale" },
  { id: "investiții" as CategoryType, label: "Investiții" },
  { id: "crypto" as CategoryType, label: "Crypto & Blockchain" },
  { id: "trading" as CategoryType, label: "Trading" },
  { id: "planificare-financiară" as CategoryType, label: "Planificare Financiară" },
];

const Courses = ({ user }: CoursesProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [progress, setProgress] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [user.id]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load published courses with lesson count
      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select(`
          *,
          chapters (
            id,
            lessons:lessons(count)
          )
        `)
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (coursesError) throw coursesError;

      // Transform data to include lesson count
      const coursesWithLessonCount = coursesData?.map(course => {
        const totalLessons = course.chapters?.reduce((sum: number, chapter: any) => {
          return sum + (chapter.lessons?.[0]?.count || 0);
        }, 0) || 0;
        
        return {
          ...course,
          lesson_count: totalLessons,
          is_popular: course.level === "Avansat" || course.level === "Intermediar", // Mark advanced/intermediate as popular
        };
      }) || [];

      // Load user enrollments
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from("enrollments")
        .select("course_id")
        .eq("user_id", user.id);

      if (enrollmentsError) throw enrollmentsError;

      // Load user progress
      const { data: progressData, error: progressError } = await supabase
        .from("course_progress_by_user")
        .select("*")
        .eq("user_id", user.id);

      if (progressError) throw progressError;

      setCourses(coursesWithLessonCount);
      setEnrollments(enrollmentsData || []);
      setProgress(progressData || []);
    } catch (error) {
      console.error("Error loading courses:", error);
      toast({
        title: "Eroare",
        description: "Nu am putut încărca cursurile. Te rugăm să încerci din nou.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = async (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    // Check if already enrolled
    if (isEnrolled(courseId)) {
      navigate(`/course/${course.slug}`);
      return;
    }

    // Enroll user
    try {
      const { error } = await supabase
        .from("enrollments")
        .insert({ user_id: user.id, course_id: courseId });

      if (error && error.code !== "23505") {
        throw error;
      }

      toast({
        title: "Înrolare reușită!",
        description: "Te-ai înscris la curs cu succes.",
      });

      navigate(`/course/${course.slug}`);
    } catch (error) {
      console.error("Error enrolling:", error);
      toast({
        title: "Eroare",
        description: "Nu am putut finaliza înrolarea.",
        variant: "destructive",
      });
    }
  };

  const isEnrolled = (courseId: string) => {
    return enrollments.some((e) => e.course_id === courseId);
  };

  const getCourseProgress = (courseId: string): CourseProgress | undefined => {
    return progress.find((p) => p.course_id === courseId);
  };

  // Filter courses by category
  const filteredCourses = selectedCategory === "all" 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <aside className="w-64 min-h-screen bg-card border-r border-border p-6">
            <Skeleton className="h-8 w-32 mb-6" />
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-full mb-2" />
            ))}
          </aside>
          <main className="flex-1 p-8">
            <Skeleton className="h-12 w-48 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-80 w-full rounded-2xl" />
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 min-h-screen bg-card border-r border-border">
          <div className="p-6 space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg transition-all font-medium",
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-[hsl(var(--aqua))]/10 to-[hsl(var(--minty-green))]/10 text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Cursuri</h1>
            <p className="text-muted-foreground">
              Descoperă și învață cu cele mai bune cursuri de educație financiară
            </p>
          </div>

          {/* Mobile Category Filter */}
          <div className="lg:hidden mb-6 flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all",
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>

          {filteredCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Niciun curs disponibil
              </h3>
              <p className="text-muted-foreground">
                Încearcă să selectezi altă categorie
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const courseProgress = getCourseProgress(course.id);
                const enrolled = isEnrolled(course.id);
                
                return (
                  <div
                    key={course.id}
                    className="group cursor-pointer"
                    onMouseEnter={() => setHoveredCourse(course.id)}
                    onMouseLeave={() => setHoveredCourse(null)}
                    onClick={() => handleCourseClick(course.id)}
                  >
                    {/* Course Image Card */}
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/10] mb-3 bg-gradient-to-br from-[hsl(var(--aqua))]/20 to-[hsl(var(--minty-green))]/20">
                      {/* Placeholder gradient background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--aqua))]/30 to-[hsl(var(--minty-green))]/30 group-hover:scale-105 transition-transform duration-300" />
                      
                      {/* Popular Badge */}
                      {course.is_popular && (
                        <Badge className="absolute top-3 left-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-900 border border-gray-200 dark:border-gray-700">
                          Popular
                        </Badge>
                      )}

                      {/* Play Icon Overlay */}
                      {hoveredCourse === course.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-all">
                          <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center shadow-lg">
                            <Play className="w-8 h-8 text-gray-900 dark:text-white fill-gray-900 dark:fill-white ml-1" />
                          </div>
                        </div>
                      )}

                      {/* Course Stats */}
                      <div className="absolute bottom-3 right-3 bg-gray-900/90 dark:bg-white/90 backdrop-blur-sm text-white dark:text-gray-900 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2">
                        {course.lesson_count && (
                          <>
                            <span>{course.lesson_count} lecții</span>
                            <span>•</span>
                          </>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {course.duration || "2h"}
                        </span>
                      </div>
                    </div>

                    {/* Course Info */}
                    <div>
                      <h3 className="font-bold text-lg mb-1 group-hover:text-[hsl(var(--aqua))] transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {course.short_description || course.description}
                      </p>
                      
                      {enrolled && courseProgress && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))]"
                              style={{ width: `${courseProgress.progress_percent}%` }}
                            />
                          </div>
                          <span>{Math.round(courseProgress.progress_percent)}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Courses;
