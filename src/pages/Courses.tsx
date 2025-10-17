import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, CheckCircle2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CoursesProps {
  user: User;
}

type FilterType = "all" | "enrolled" | "completed";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string | null;
  level: string;
  duration: string | null;
  published: boolean;
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

const Courses = ({ user }: CoursesProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [progress, setProgress] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [user.id]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load published courses
      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (coursesError) throw coursesError;

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

      setCourses(coursesData || []);
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

  const handleEnroll = async (courseId: string) => {
    try {
      setEnrollingCourseId(courseId);

      const { error } = await supabase
        .from("enrollments")
        .insert({ user_id: user.id, course_id: courseId });

      if (error) {
        // If already enrolled (unique constraint violation), just continue
        if (error.code === "23505") {
          const course = courses.find((c) => c.id === courseId);
          if (course) {
            navigate(`/course/${course.slug}`);
          }
          return;
        }
        throw error;
      }

      toast({
        title: "Înrolare reușită!",
        description: "Te-ai înscris la curs cu succes. Mult succes!",
      });

      // Reload data to update enrollments
      await loadData();

      // Navigate to course page
      const course = courses.find((c) => c.id === courseId);
      if (course) {
        navigate(`/course/${course.slug}`);
      }
    } catch (error) {
      console.error("Error enrolling:", error);
      toast({
        title: "Eroare",
        description: "Nu am putut finaliza înrolarea. Te rugăm să încerci din nou.",
        variant: "destructive",
      });
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const isEnrolled = (courseId: string) => {
    return enrollments.some((e) => e.course_id === courseId);
  };

  const getCourseProgress = (courseId: string): CourseProgress | undefined => {
    return progress.find((p) => p.course_id === courseId);
  };

  const filteredCourses = courses.filter((course) => {
    if (filter === "enrolled") {
      return isEnrolled(course.id);
    }
    if (filter === "completed") {
      const courseProgress = getCourseProgress(course.id);
      return courseProgress && courseProgress.progress_percent === 100;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 text-center">
              <Skeleton className="h-12 w-96 mx-auto mb-4" />
              <Skeleton className="h-6 w-[600px] mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] bg-clip-text text-transparent">
              Cursurile Tale Finora
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Bine ai venit, <span className="font-semibold text-foreground">{user.email}</span>!
              Descoperă cursurile noastre și începe călătoria spre libertate financiară.
            </p>
          </div>

          {/* Filters */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              Toate
            </Button>
            <Button
              variant={filter === "enrolled" ? "default" : "outline"}
              onClick={() => setFilter("enrolled")}
            >
              Înscris
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              onClick={() => setFilter("completed")}
            >
              Finalizate
            </Button>
          </div>

          {filteredCourses.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <BookOpen className="w-16 h-16 text-muted-foreground" />
                <h3 className="text-2xl font-semibold">
                  {filter === "enrolled" && "Nu ești înscris la niciun curs încă"}
                  {filter === "completed" && "Nu ai finalizat niciun curs încă"}
                  {filter === "all" && "Nu există cursuri disponibile"}
                </h3>
                <p className="text-muted-foreground">
                  {filter === "enrolled" && "Explorează cursurile disponibile și începe să înveți!"}
                  {filter === "completed" && "Continuă să înveți pentru a finaliza cursurile!"}
                  {filter === "all" && "Cursurile vor apărea aici în curând."}
                </p>
                {filter !== "all" && (
                  <Button onClick={() => setFilter("all")}>
                    Vezi toate cursurile
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCourses.map((course) => {
                const enrolled = isEnrolled(course.id);
                const courseProgress = getCourseProgress(course.id);
                const hasProgress = courseProgress && courseProgress.total_lessons > 0;

                return (
                  <Card
                    key={course.id}
                    className="group hover:shadow-glow transition-all duration-300 border-[hsl(var(--aqua))]/20 hover:border-[hsl(var(--aqua))]/50"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <Badge variant="secondary" className="text-xs">
                          {course.level}
                        </Badge>
                        {enrolled && courseProgress?.progress_percent === 100 && (
                          <Badge className="bg-[hsl(var(--minty-green))] text-white">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Completat
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-2xl group-hover:text-[hsl(var(--aqua))] transition-colors">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="text-base mt-2">
                        {course.short_description || course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {enrolled && hasProgress && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progres</span>
                            <span className="font-semibold text-[hsl(var(--aqua))]">
                              {courseProgress.progress_percent}%
                            </span>
                          </div>
                          <Progress value={courseProgress.progress_percent} />
                          <p className="text-xs text-muted-foreground">
                            {courseProgress.completed_lessons} din {courseProgress.total_lessons} lecții completate
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        {course.duration && (
                          <span className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {course.duration}
                          </span>
                        )}
                        <Button
                          onClick={() => {
                            if (enrolled) {
                              navigate(`/course/${course.slug}`);
                            } else {
                              handleEnroll(course.id);
                            }
                          }}
                          disabled={enrollingCourseId === course.id}
                          className="ml-auto"
                        >
                          {enrollingCourseId === course.id ? (
                            "Se înrolează..."
                          ) : enrolled ? (
                            "Continuă →"
                          ) : (
                            "Înscrie-te (gratuit)"
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="mt-12 p-8 rounded-lg bg-gradient-to-r from-[hsl(var(--aqua))]/10 to-[hsl(var(--minty-green))]/10 border border-[hsl(var(--aqua))]/20">
            <h2 className="text-2xl font-bold mb-3 text-foreground">Gata să începi?</h2>
            <p className="text-muted-foreground mb-4">
              Toate cursurile includ lecții video interactive, exerciții practice și acces la comunitatea noastră de investitori.
            </p>
            <p className="text-sm text-muted-foreground">
              💡 <strong>Pro Tip:</strong> Începe cu Analiza Fundamentală dacă ești nou în lumea investițiilor!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Courses;
