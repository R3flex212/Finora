import { User } from "@supabase/supabase-js";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import YouTube from "react-youtube";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock, ChevronRight, Play, ArrowLeft, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider, 
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CourseViewProps {
  user: User;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: string;
}

interface Chapter {
  id: string;
  title: string;
  description: string | null;
  position: number;
}

interface Lesson {
  id: string;
  chapter_id: string;
  title: string;
  content: string | null;
  video_url: string | null;
  duration_minutes: number | null;
  position: number;
  is_free_preview: boolean;
}

interface LessonProgress {
  lesson_id: string;
  completed: boolean;
  seconds_watched: number;
  last_position_seconds: number;
  duration_seconds: number | null;
}

const CourseView = ({ user }: CourseViewProps) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);

  const playerRef = useRef<any>(null);
  const ytPlayerRef = useRef<any>(null);
  const progressSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedProgressRef = useRef(0);

  useEffect(() => {
    if (slug) {
      loadCourseData();
    }
  }, [slug, user.id]);

  useEffect(() => {
    // Set first available lesson as current
    if (lessons.length > 0 && !currentLesson) {
      const firstAvailable = lessons.find(
        (l) => l.is_free_preview || isEnrolled
      );
      if (firstAvailable) {
        setCurrentLesson(firstAvailable);
      }
    }
  }, [lessons, isEnrolled, currentLesson]);

  useEffect(() => {
    // Resume from last position when lesson changes
    if (currentLesson) {
      const lessonProgress = progress.find((p) => p.lesson_id === currentLesson.id);
      if (lessonProgress && lessonProgress.last_position_seconds > 0) {
        const resumePosition = lessonProgress.last_position_seconds;
        if (playerRef.current) {
          playerRef.current.seekTo(resumePosition, "seconds");
        }
      }
    }
  }, [currentLesson?.id]);

  const loadCourseData = async () => {
    try {
      setLoading(true);

      // Load course
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (courseError) throw courseError;
      if (!courseData) {
        navigate("/404");
        return;
      }

      setCourse(courseData);

      // Check enrollment
      const { data: enrollmentData } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_id", courseData.id)
        .maybeSingle();

      setIsEnrolled(!!enrollmentData);

      // Load chapters and lessons
      const { data: chaptersData, error: chaptersError } = await supabase
        .from("chapters")
        .select("*")
        .eq("course_id", courseData.id)
        .order("position", { ascending: true });

      if (chaptersError) throw chaptersError;
      setChapters(chaptersData || []);

      const chapterIds = (chaptersData || []).map((c) => c.id);
      if (chapterIds.length > 0) {
        const { data: lessonsData, error: lessonsError } = await supabase
          .from("lessons")
          .select("*")
          .in("chapter_id", chapterIds)
          .order("position", { ascending: true });

        if (lessonsError) throw lessonsError;
        setLessons(lessonsData || []);

        // Load progress if enrolled
        if (enrollmentData) {
          const lessonIds = (lessonsData || []).map((l) => l.id);
          const { data: progressData, error: progressError } = await supabase
            .from("user_lesson_progress")
            .select("*")
            .eq("user_id", user.id)
            .in("lesson_id", lessonIds);

          if (progressError) throw progressError;
          setProgress(progressData || []);
        }
      }
    } catch (error) {
      console.error("Error loading course:", error);
      toast({
        title: "Eroare",
        description: "Nu am putut încărca cursul. Te rugăm să încerci din nou.",
        variant: "destructive",
      });
      navigate("/courses");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!course) return;

    try {
      setEnrolling(true);

      const { error } = await supabase
        .from("enrollments")
        .insert({ user_id: user.id, course_id: course.id });

      if (error && error.code !== "23505") throw error;

      toast({
        title: "Înrolare reușită!",
        description: "Acum poți accesa toate lecțiile cursului.",
      });

      await loadCourseData();
    } catch (error) {
      console.error("Error enrolling:", error);
      toast({
        title: "Eroare",
        description: "Nu am putut finaliza înrolarea. Te rugăm să încerci din nou.",
        variant: "destructive",
      });
    } finally {
      setEnrolling(false);
    }
  };

  const saveProgress = useCallback(
    async (playedSeconds: number, totalDuration: number, forceComplete = false) => {
      if (!currentLesson || !user.id) return;

      const isCompleted =
        forceComplete || playedSeconds >= totalDuration * 0.9;

      try {
        const { error } = await supabase
          .from("user_lesson_progress")
          .upsert({
            user_id: user.id,
            lesson_id: currentLesson.id,
            completed: isCompleted,
            seconds_watched: Math.floor(playedSeconds),
            last_position_seconds: Math.floor(playedSeconds),
            duration_seconds: Math.floor(totalDuration),
            completed_at: isCompleted ? new Date().toISOString() : null,
          });

        if (error) throw error;

        // Update local progress state
        setProgress((prev) => {
          const existing = prev.find((p) => p.lesson_id === currentLesson.id);
          if (existing) {
            return prev.map((p) =>
              p.lesson_id === currentLesson.id
                ? {
                    ...p,
                    completed: isCompleted,
                    seconds_watched: Math.floor(playedSeconds),
                    last_position_seconds: Math.floor(playedSeconds),
                    duration_seconds: Math.floor(totalDuration),
                  }
                : p
            );
          } else {
            return [
              ...prev,
              {
                lesson_id: currentLesson.id,
                completed: isCompleted,
                seconds_watched: Math.floor(playedSeconds),
                last_position_seconds: Math.floor(playedSeconds),
                duration_seconds: Math.floor(totalDuration),
              },
            ];
          }
        });

        if (isCompleted) {
          toast({
            title: "Lecție completată!",
            description: "Progresul tău a fost salvat.",
          });
        }
      } catch (error) {
        console.error("Error saving progress:", error);
      }
    },
    [currentLesson, user.id]
  );

  const handleProgress = (state: any) => {
    if (!seeking) {
      setPlayed(state.played);

      // Debounce progress saving (every 5 seconds)
      const now = Date.now();
      if (now - lastSavedProgressRef.current >= 5000) {
        lastSavedProgressRef.current = now;
        saveProgress(state.playedSeconds, duration);
      }
    }
  };

  const handleDuration = (dur: number) => {
    setDuration(dur);
  };

  const handleMarkComplete = () => {
    if (duration > 0) {
      saveProgress(duration, duration, true);
    }
  };

  const handleNextLesson = () => {
    if (!currentLesson) return;

    const currentIndex = lessons.findIndex((l) => l.id === currentLesson.id);
    if (currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1];
      if (nextLesson.is_free_preview || isEnrolled) {
        setCurrentLesson(nextLesson);
        setPlayed(0);
        setPlaying(true);
      }
    }
  };

  const getLessonProgress = (lessonId: string) => {
    return progress.find((p) => p.lesson_id === lessonId);
  };

  const canAccessLesson = (lesson: Lesson) => {
    return lesson.is_free_preview || isEnrolled;
  };
  
  const isYouTubeUrl = (url: string) => /youtu\.be|youtube\.com/.test(url);
  const getYouTubeId = (url: string) => {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
      const v = u.searchParams.get("v");
      if (v) return v;
      const match = url.match(/embed\/([a-zA-Z0-9_-]{11})/);
      return match ? match[1] : "";
    } catch {
      const match = url.match(/(?:v=|be\/|embed\/)([a-zA-Z0-9_-]{11})/);
      return match ? match[1] : "";
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen w-full flex">
          <Sidebar className="border-r">
            <SidebarContent>
              <Skeleton className="h-full" />
            </SidebarContent>
          </Sidebar>
          <div className="flex-1">
            <header className="h-14 border-b flex items-center px-4">
              <Skeleton className="h-8 w-32" />
            </header>
            <div className="p-8">
              <Skeleton className="aspect-video w-full mb-4" />
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-12 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Cursul nu a fost găsit</h2>
          <p className="text-muted-foreground mb-6">
            Cursul pe care încerci să-l accesezi nu există sau nu este disponibil.
          </p>
          <Button onClick={() => navigate("/courses")}>
            Înapoi la cursuri
          </Button>
        </Card>
      </div>
    );
  }

  const currentChapter = chapters.find(
    (c) => c.id === currentLesson.chapter_id
  );
  const lessonProgress = getLessonProgress(currentLesson.id);
  const canAccess = canAccessLesson(currentLesson);

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <CourseSidebar 
          chapters={chapters}
          lessons={lessons}
          currentLessonId={currentLesson?.id}
          progress={progress}
          isEnrolled={isEnrolled}
          onLessonClick={(lessonId) => {
            const lesson = lessons.find(l => l.id === lessonId);
            if (lesson) {
              setCurrentLesson(lesson);
              setPlayed(0);
              setPlaying(true);
            }
          }}
        />
        
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b flex items-center px-4 gap-2 bg-card sticky top-0 z-10">
            <SidebarTrigger />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/courses")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Înapoi
            </Button>
            <div className="flex-1 flex items-center justify-between">
              <div>
                <h1 className="font-semibold text-lg">{course.title}</h1>
              </div>
              <Badge variant="secondary">{course.level}</Badge>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="container mx-auto max-w-6xl py-8 px-4">
              <div className="space-y-6">
                {/* Video Player */}
                <Card className="overflow-hidden">
                  <div className="relative aspect-video bg-black">
                    {!canAccess ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 p-8 text-center">
                        <Lock className="w-16 h-16 text-white mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">
                          Înrolează-te pentru a continua
                        </h3>
                        <p className="text-white/80 mb-6">
                          Această lecție necesită înrolare la curs
                        </p>
                        <Button
                          size="lg"
                          onClick={handleEnroll}
                          disabled={enrolling}
                        >
                          {enrolling ? "Se înrolează..." : "Înscrie-te gratuit"}
                        </Button>
                      </div>
                    ) : null}

                    {currentLesson.video_url && canAccess ? (
                      isYouTubeUrl(currentLesson.video_url) ? (
                        <div className="absolute inset-0">
                          <YouTube
                            videoId={getYouTubeId(currentLesson.video_url)}
                            opts={{ width: "100%", height: "100%", playerVars: { rel: 0, modestbranding: 1, playsinline: 1 } }}
                            onStateChange={(e: any) => {
                              if (e.data === 0) handleNextLesson();
                              if (e.data === 1) setPlaying(true);
                              if (e.data === 2) setPlaying(false);
                            }}
                          />
                        </div>
                      ) : (
                        <ReactPlayer
                          {...({
                            ref: playerRef,
                            url: currentLesson.video_url,
                            width: "100%",
                            height: "100%",
                            playing: playing,
                            controls: true,
                            onProgress: handleProgress,
                            onDuration: handleDuration,
                            onPlay: () => setPlaying(true),
                            onPause: () => setPlaying(false),
                            onSeek: () => setSeeking(false),
                            onEnded: handleNextLesson,
                            progressInterval: 1000,
                            style: { position: 'absolute', top: 0, left: 0 }
                          } as any)}
                        />
                      )
                    ) : canAccess ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg">Niciun video disponibil</p>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">
                          {currentChapter?.title}
                        </p>
                        <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
                      </div>
                      {lessonProgress?.completed && (
                        <Badge className="bg-[hsl(var(--minty-green))] text-white">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Completat
                        </Badge>
                      )}
                    </div>

                    {lessonProgress && canAccess && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progres</span>
                          <span className="font-semibold">
                            {Math.round(played * 100)}%
                          </span>
                        </div>
                        <Progress value={played * 100} />
                      </div>
                    )}

                    {currentLesson.content && (
                      <p className="text-muted-foreground mb-6">
                        {currentLesson.content}
                      </p>
                    )}

                    {canAccess && (
                      <div className="flex gap-4">
                        <Button
                          onClick={handleMarkComplete}
                          disabled={lessonProgress?.completed}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Marchează complet
                        </Button>
                        <Button variant="outline" onClick={handleNextLesson}>
                          Următorul
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

// Course Sidebar Component
function CourseSidebar({ 
  chapters, 
  lessons, 
  currentLessonId, 
  progress, 
  isEnrolled,
  onLessonClick 
}: {
  chapters: Chapter[];
  lessons: Lesson[];
  progress: LessonProgress[];
  currentLessonId?: string;
  isEnrolled: boolean;
  onLessonClick: (lessonId: string) => void;
}) {
  const getLessonProgress = (lessonId: string) => {
    return progress.find(p => p.lesson_id === lessonId);
  };

  const isLessonCompleted = (lessonId: string) => {
    const prog = getLessonProgress(lessonId);
    return prog?.completed || false;
  };

  return (
    <Sidebar className="border-r border-[hsl(var(--aqua))]/20 bg-card" collapsible="icon">
      <SidebarContent className="bg-card">
        <div className="p-4 border-b border-[hsl(var(--aqua))]/20">
          <h3 className="text-sm font-semibold bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] bg-clip-text text-transparent">
            Conținut Curs
          </h3>
        </div>
        {chapters.map((chapter) => {
          const chapterLessons = lessons.filter(l => l.chapter_id === chapter.id);
          const isChapterOpen = chapterLessons.some(l => l.id === currentLessonId);
          
          return (
            <Collapsible key={chapter.id} defaultOpen={isChapterOpen}>
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex items-center justify-between w-full hover:bg-[hsl(var(--aqua))]/10 px-4 py-3 rounded-lg group transition-colors">
                    <span className="font-semibold text-sm text-foreground">{chapter.title}</span>
                    <ChevronDown className="h-4 w-4 text-[hsl(var(--aqua))] transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {chapterLessons.map((lesson) => {
                        const isCompleted = isLessonCompleted(lesson.id);
                        const isActive = lesson.id === currentLessonId;
                        const isLocked = !lesson.is_free_preview && !isEnrolled;

                        return (
                          <SidebarMenuItem key={lesson.id}>
                            <SidebarMenuButton
                              onClick={() => !isLocked && onLessonClick(lesson.id)}
                              isActive={isActive}
                              disabled={isLocked}
                              className={cn(
                                "w-full justify-start hover:bg-[hsl(var(--aqua))]/10 transition-all duration-200 rounded-lg mx-2 my-1",
                                isActive && "bg-gradient-to-r from-[hsl(var(--aqua))]/20 to-[hsl(var(--minty-green))]/20 border-l-4 border-[hsl(var(--aqua))] shadow-sm"
                              )}
                            >
                              <div className="flex items-center gap-3 w-full py-1">
                                {isLocked ? (
                                  <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                ) : isCompleted ? (
                                  <CheckCircle2 className="h-4 w-4 text-[hsl(var(--minty-green))] flex-shrink-0" />
                                ) : (
                                  <Play className="h-4 w-4 text-[hsl(var(--aqua))] flex-shrink-0" />
                                )}
                                <span className={cn(
                                  "truncate text-sm",
                                  isActive && "font-semibold text-[hsl(var(--aqua))]",
                                  isCompleted && "text-muted-foreground"
                                )}>
                                  {lesson.title}
                                </span>
                              </div>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}

export default CourseView;
