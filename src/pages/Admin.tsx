import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, BookOpen, Edit, Trash2, Plus, FileText, Video, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AdminProps {
  user: User;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string | null;
  level: string;
  duration: string | null;
  published: boolean;
  created_at: string;
}

interface Chapter {
  id: string;
  course_id: string;
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

const Admin = ({ user }: AdminProps) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
  }, [user.id]);

  // Realtime subscriptions
  useEffect(() => {
    if (!isAdmin) return;

    const coursesChannel = supabase
      .channel('admin-courses-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, () => {
        loadAllData();
      })
      .subscribe();

    const chaptersChannel = supabase
      .channel('admin-chapters-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chapters' }, () => {
        loadAllData();
      })
      .subscribe();

    const lessonsChannel = supabase
      .channel('admin-lessons-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lessons' }, () => {
        loadAllData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(coursesChannel);
      supabase.removeChannel(chaptersChannel);
      supabase.removeChannel(lessonsChannel);
    };
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setIsAdmin(false);
        return;
      }

      setIsAdmin(true);
      await loadAllData();
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const loadAllData = async () => {
    try {
      const [coursesRes, chaptersRes, lessonsRes] = await Promise.all([
        supabase.from("courses").select("*").order("created_at", { ascending: false }),
        supabase.from("chapters").select("*").order("position", { ascending: true }),
        supabase.from("lessons").select("*").order("position", { ascending: true }),
      ]);

      if (coursesRes.error) throw coursesRes.error;
      if (chaptersRes.error) throw chaptersRes.error;
      if (lessonsRes.error) throw lessonsRes.error;

      setCourses(coursesRes.data || []);
      setChapters(chaptersRes.data || []);
      setLessons(lessonsRes.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Eroare",
        description: "Nu am putut încărca datele. Te rugăm să reîmprospătezi pagina.",
        variant: "destructive",
      });
    }
  };

  const handleCreateCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const { error } = await supabase.from("courses").insert({
        title: formData.get("title") as string,
        slug: formData.get("slug") as string,
        description: formData.get("description") as string,
        short_description: formData.get("short_description") as string,
        level: formData.get("level") as string,
        duration: formData.get("duration") as string,
        published: false,
      });

      if (error) throw error;

      toast({ title: "Succes!", description: "Cursul a fost creat." });
      await loadAllData();
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast({
        title: "Eroare",
        description: error.message || "Nu am putut crea cursul.",
        variant: "destructive",
      });
    }
  };

  const handleTogglePublish = async (courseId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("courses")
        .update({ published: !currentStatus })
        .eq("id", courseId);

      if (error) throw error;

      toast({
        title: "Succes!",
        description: `Cursul a fost ${!currentStatus ? "publicat" : "depublicat"}.`,
      });
      await loadAllData();
    } catch (error: any) {
      toast({
        title: "Eroare",
        description: error.message || "Nu am putut actualiza cursul.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Sigur vrei să ștergi acest curs? Această acțiune nu poate fi anulată.")) return;

    try {
      const { error } = await supabase.from("courses").delete().eq("id", courseId);

      if (error) throw error;

      toast({ title: "Succes!", description: "Cursul a fost șters." });
      await loadAllData();
    } catch (error: any) {
      toast({
        title: "Eroare",
        description: error.message || "Nu am putut șterge cursul.",
        variant: "destructive",
      });
    }
  };

  const handleCreateChapter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!selectedCourse) {
      toast({ title: "Eroare", description: "Selectează un curs mai întâi.", variant: "destructive" });
      return;
    }

    try {
      const courseChapters = chapters.filter((c) => c.course_id === selectedCourse);
      const maxPosition = courseChapters.length > 0 ? Math.max(...courseChapters.map((c) => c.position)) : 0;

      const { error } = await supabase.from("chapters").insert({
        course_id: selectedCourse,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        position: maxPosition + 1,
      });

      if (error) throw error;

      toast({ title: "Succes!", description: "Capitolul a fost creat." });
      await loadAllData();
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast({
        title: "Eroare",
        description: error.message || "Nu am putut crea capitolul.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm("Sigur vrei să ștergi acest capitol? Toate lecțiile din el vor fi șterse.")) return;

    try {
      const { error } = await supabase.from("chapters").delete().eq("id", chapterId);

      if (error) throw error;

      toast({ title: "Succes!", description: "Capitolul a fost șters." });
      await loadAllData();
    } catch (error: any) {
      toast({
        title: "Eroare",
        description: error.message || "Nu am putut șterge capitolul.",
        variant: "destructive",
      });
    }
  };

  const handleCreateLesson = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!selectedChapter) {
      toast({ title: "Eroare", description: "Selectează un capitol mai întâi.", variant: "destructive" });
      return;
    }

    try {
      const chapterLessons = lessons.filter((l) => l.chapter_id === selectedChapter);
      const maxPosition = chapterLessons.length > 0 ? Math.max(...chapterLessons.map((l) => l.position)) : 0;

      const { error } = await supabase.from("lessons").insert({
        chapter_id: selectedChapter,
        title: formData.get("title") as string,
        content: formData.get("content") as string,
        video_url: formData.get("video_url") as string,
        duration_minutes: parseInt(formData.get("duration_minutes") as string) || null,
        position: maxPosition + 1,
        is_free_preview: formData.get("is_free_preview") === "on",
      });

      if (error) throw error;

      toast({ title: "Succes!", description: "Lecția a fost creată." });
      await loadAllData();
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast({
        title: "Eroare",
        description: error.message || "Nu am putut crea lecția.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Sigur vrei să ștergi această lecție?")) return;

    try {
      const { error } = await supabase.from("lessons").delete().eq("id", lessonId);

      if (error) throw error;

      toast({ title: "Succes!", description: "Lecția a fost ștearsă." });
      await loadAllData();
    } catch (error: any) {
      toast({
        title: "Eroare",
        description: error.message || "Nu am putut șterge lecția.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Nu ai permisiunea de a accesa această pagină. Doar administratorii pot vizualiza panoul admin.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  const filteredChapters = selectedCourse
    ? chapters.filter((c) => c.course_id === selectedCourse)
    : [];

  const filteredLessons = selectedChapter
    ? lessons.filter((l) => l.chapter_id === selectedChapter)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] bg-clip-text text-transparent">
              Panou Admin
            </h1>
            <p className="text-muted-foreground">Gestionează cursurile, capitolele și lecțiile platformei.</p>
          </div>

          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Cursuri
              </TabsTrigger>
              <TabsTrigger value="chapters" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Capitole
              </TabsTrigger>
              <TabsTrigger value="lessons" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Lecții
              </TabsTrigger>
            </TabsList>

            {/* COURSES TAB */}
            <TabsContent value="courses" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Creare Curs Nou</CardTitle>
                  <CardDescription>Completează detaliile cursului. Poți publica cursul mai târziu.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateCourse} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Titlu *</Label>
                        <Input id="title" name="title" required placeholder="Ex: Analiza Fundamentală" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slug">Slug (URL) *</Label>
                        <Input id="slug" name="slug" required placeholder="Ex: analiza-fundamentala" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="short_description">Descriere Scurtă</Label>
                      <Input id="short_description" name="short_description" placeholder="Maxim 100 caractere" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Descriere Completă *</Label>
                      <Textarea id="description" name="description" required rows={4} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="level">Nivel *</Label>
                        <Select name="level" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Selectează nivel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Începător">Începător</SelectItem>
                            <SelectItem value="Intermediar">Intermediar</SelectItem>
                            <SelectItem value="Avansat">Avansat</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Durată</Label>
                        <Input id="duration" name="duration" placeholder="Ex: 4 săptămâni" />
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Creare Curs
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lista Cursuri ({courses.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titlu</TableHead>
                        <TableHead>Nivel</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Acțiuni</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{course.level}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={course.published ? "default" : "secondary"}>
                              {course.published ? "Publicat" : "Draft"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleTogglePublish(course.id, course.published)}
                            >
                              {course.published ? "Depublică" : "Publică"}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteCourse(course.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* CHAPTERS TAB */}
            <TabsContent value="chapters" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Creare Capitol Nou</CardTitle>
                  <CardDescription>Selectează un curs și adaugă un capitol nou.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateChapter} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="course-select">Curs *</Label>
                      <Select value={selectedCourse} onValueChange={setSelectedCourse} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selectează curs" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chapter-title">Titlu Capitol *</Label>
                      <Input id="chapter-title" name="title" required placeholder="Ex: Introducere în Analiza Fundamentală" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chapter-description">Descriere</Label>
                      <Textarea id="chapter-description" name="description" rows={3} />
                    </div>
                    <Button type="submit" className="w-full" disabled={!selectedCourse}>
                      <Plus className="w-4 h-4 mr-2" />
                      Creare Capitol
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lista Capitole</CardTitle>
                  <CardDescription>
                    {selectedCourse
                      ? `Afișare capitole pentru: ${courses.find((c) => c.id === selectedCourse)?.title}`
                      : "Selectează un curs pentru a vedea capitolele"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredChapters.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Poziție</TableHead>
                          <TableHead>Titlu</TableHead>
                          <TableHead className="text-right">Acțiuni</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredChapters.map((chapter) => (
                          <TableRow key={chapter.id}>
                            <TableCell>
                              <Badge>{chapter.position}</Badge>
                            </TableCell>
                            <TableCell className="font-medium">{chapter.title}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteChapter(chapter.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      {selectedCourse ? "Nu există capitole pentru acest curs." : "Selectează un curs mai întâi."}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* LESSONS TAB */}
            <TabsContent value="lessons" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Creare Lecție Nouă</CardTitle>
                  <CardDescription>Selectează un capitol și adaugă o lecție nouă.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateLesson} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="lesson-course">Curs *</Label>
                        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selectează curs" />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map((course) => (
                              <SelectItem key={course.id} value={course.id}>
                                {course.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lesson-chapter">Capitol *</Label>
                        <Select
                          value={selectedChapter}
                          onValueChange={setSelectedChapter}
                          disabled={!selectedCourse}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selectează capitol" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredChapters.map((chapter) => (
                              <SelectItem key={chapter.id} value={chapter.id}>
                                {chapter.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lesson-title">Titlu Lecție *</Label>
                      <Input id="lesson-title" name="title" required placeholder="Ex: Ce este capitalul de piață?" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lesson-video">URL Video</Label>
                      <Input id="lesson-video" name="video_url" type="url" placeholder="https://youtube.com/watch?v=..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lesson-content">Conținut Text</Label>
                      <Textarea id="lesson-content" name="content" rows={4} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="lesson-duration">Durată (minute)</Label>
                        <Input id="lesson-duration" name="duration_minutes" type="number" placeholder="15" />
                      </div>
                      <div className="flex items-center space-x-2 pt-8">
                        <Switch id="is_free_preview" name="is_free_preview" />
                        <Label htmlFor="is_free_preview">Preview Gratuit</Label>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={!selectedChapter}>
                      <Plus className="w-4 h-4 mr-2" />
                      Creare Lecție
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lista Lecții</CardTitle>
                  <CardDescription>
                    {selectedChapter
                      ? `Afișare lecții pentru: ${chapters.find((c) => c.id === selectedChapter)?.title}`
                      : "Selectează un capitol pentru a vedea lecțiile"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredLessons.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Poziție</TableHead>
                          <TableHead>Titlu</TableHead>
                          <TableHead>Durată</TableHead>
                          <TableHead>Video</TableHead>
                          <TableHead className="text-right">Acțiuni</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLessons.map((lesson) => (
                          <TableRow key={lesson.id}>
                            <TableCell>
                              <Badge>{lesson.position}</Badge>
                            </TableCell>
                            <TableCell className="font-medium">{lesson.title}</TableCell>
                            <TableCell>{lesson.duration_minutes ? `${lesson.duration_minutes} min` : "—"}</TableCell>
                            <TableCell>
                              {lesson.video_url ? (
                                <Badge variant="default">Da</Badge>
                              ) : (
                                <Badge variant="secondary">Nu</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteLesson(lesson.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      {selectedChapter ? "Nu există lecții pentru acest capitol." : "Selectează un capitol mai întâi."}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Admin;
