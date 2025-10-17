import { User } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, TrendingUp, DollarSign, Briefcase } from "lucide-react";

interface CoursesProps {
  user: User;
}

const Courses = ({ user }: CoursesProps) => {
  const courses = [
    {
      id: 1,
      title: "Analiza Fundamentală",
      description: "Învață să evaluezi companiile prin analiza bilanțurilor, rapoartelor financiare și indicatorilor cheie.",
      icon: BookOpen,
      level: "Începător",
      duration: "6 săptămâni",
      color: "aqua",
    },
    {
      id: 2,
      title: "Analiza Tehnică",
      description: "Stăpânește graficele, indicatorii tehnici și pattern-urile pentru a identifica oportunitățile de trading.",
      icon: TrendingUp,
      level: "Intermediar",
      duration: "8 săptămâni",
      color: "minty-green",
    },
    {
      id: 3,
      title: "Managementul Portofoliului",
      description: "Construiește și gestionează un portofoliu diversificat care să-ți atingă obiectivele financiare.",
      icon: DollarSign,
      level: "Intermediar",
      duration: "4 săptămâni",
      color: "aqua",
    },
    {
      id: 4,
      title: "Psihologia Investițiilor",
      description: "Înțelege comportamentul pieței și dezvoltă disciplina mentală necesară pentru succesul pe termen lung.",
      icon: Briefcase,
      level: "Avansat",
      duration: "5 săptămâni",
      color: "minty-green",
    },
  ];

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => {
              const Icon = course.icon;
              return (
                <Card 
                  key={course.id}
                  className="group hover:shadow-glow transition-all duration-300 border-[hsl(var(--aqua))]/20 hover:border-[hsl(var(--aqua))]/50 cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-[hsl(var(--${course.color}))]/10 group-hover:bg-[hsl(var(--${course.color}))]/20 transition-colors`}>
                        <Icon className={`w-6 h-6 text-[hsl(var(--${course.color}))]`} />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {course.level}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl group-hover:text-[hsl(var(--aqua))] transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        {course.duration}
                      </span>
                      <span className="font-medium text-[hsl(var(--aqua))] group-hover:underline">
                        Începe cursul →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 p-8 rounded-lg bg-gradient-to-r from-[hsl(var(--aqua))]/10 to-[hsl(var(--minty-green))]/10 border border-[hsl(var(--aqua))]/20">
            <h2 className="text-2xl font-bold mb-3 text-foreground">
              Gata să începi?
            </h2>
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
