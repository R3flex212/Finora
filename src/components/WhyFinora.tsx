import { Target, FileText, Users, TrendingUp, BookOpen, Calculator } from "lucide-react";
import { CyberneticBentoGrid } from "@/components/ui/cybernetic-bento-grid";

const WhyFinora = () => {
  const bentoItems = [
    {
      title: "Claritate & Structură",
      description: "Trasee în 3 niveluri: Începător, Intermediar, Avansat — alegi ce ți se potrivește și urmezi un plan clar, pas cu pas.",
      className: "col-span-2 row-span-2 bento-aqua",
      icon: <Target className="w-10 h-10 text-white" />,
    },
    {
      title: "Tool-uri practice",
      description: "Template-uri Excel, calculatoare și fișe de lucru gata de folosit imediat.",
      className: "bento-mint",
      icon: <Calculator className="w-8 h-8 text-white" />,
    },
    {
      title: "Educație aplicabilă",
      description: "Cursuri video clare și directe, fără fluff teoretic.",
      className: "bento-aqua-light",
      icon: <BookOpen className="w-8 h-8 text-white" />,
    },
    {
      title: "Comunitate activă",
      description: "Q&A live, suport din partea comunității și responsabilizare reciprocă.",
      className: "row-span-2 bento-mint-light",
      icon: <Users className="w-8 h-8 text-white" />,
    },
    {
      title: "Progres măsurabil",
      description: "Obiective clare, trackere și pași pe care îi vezi cum se îndeplinesc în timp real.",
      className: "col-span-2 bento-gradient",
      icon: <TrendingUp className="w-8 h-8 text-white" />,
    },
    {
      title: "Aplicabil instant",
      description: "Folosești ce înveți în aceeași zi — fără timp pierdut.",
      className: "bento-aqua",
      icon: <FileText className="w-8 h-8 text-white" />,
    },
  ];

  return (
    <section id="de-ce-finora" className="relative py-20 overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[hsl(var(--aqua))] opacity-10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[hsl(var(--minty-green))] opacity-10 rounded-full blur-3xl" />
      
      {/* Frosted glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/5 to-transparent backdrop-blur-[2px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <CyberneticBentoGrid 
          title="De ce Finora?"
          items={bentoItems}
        />
        
        <div className="max-w-3xl mx-auto text-center mt-12">
          <div className="glass-effect rounded-xl p-6 shadow-glow border-[hsl(var(--aqua))]/20">
            <p className="text-foreground">
              <strong className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))]">
                Ce ne diferențiază:
              </strong>{" "}
              Finora îmbină educația structurată cu tool-uri practice și o comunitate activă — totul într-un singur loc.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyFinora;