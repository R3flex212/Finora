import { Target, FileText, Users, TrendingUp, BookOpen, Calculator } from "lucide-react";
import { CyberneticBentoGrid } from "@/components/ui/cybernetic-bento-grid";
import { AuroraBackground } from "@/components/ui/aurora-background";

const WhyFinora = () => {
  const bentoItems = [
    {
      title: "Claritate & Structură",
      description: "Trasee în 3 niveluri: Începător, Intermediar, Avansat — alegi ce ți se potrivește și urmezi un plan clar, pas cu pas.",
      className: "col-span-2 row-span-2",
      icon: <Target className="w-10 h-10 text-[hsl(var(--aqua))]" />,
    },
    {
      title: "Tool-uri practice",
      description: "Template-uri Excel, calculatoare și fișe de lucru gata de folosit imediat.",
      icon: <Calculator className="w-8 h-8 text-[hsl(var(--aqua))]" />,
    },
    {
      title: "Educație aplicabilă",
      description: "Cursuri video clare și directe, fără fluff teoretic.",
      icon: <BookOpen className="w-8 h-8 text-[hsl(var(--aqua))]" />,
    },
    {
      title: "Comunitate activă",
      description: "Q&A live, suport din partea comunității și responsabilizare reciprocă.",
      className: "row-span-2",
      icon: <Users className="w-8 h-8 text-[hsl(var(--aqua))]" />,
    },
    {
      title: "Progres măsurabil",
      description: "Obiective clare, trackere și pași pe care îi vezi cum se îndeplinesc în timp real.",
      className: "col-span-2",
      icon: <TrendingUp className="w-8 h-8 text-[hsl(var(--aqua))]" />,
    },
    {
      title: "Aplicabil instant",
      description: "Folosești ce înveți în aceeași zi — fără timp pierdut.",
      icon: <FileText className="w-8 h-8 text-[hsl(var(--aqua))]" />,
    },
  ];

  return (
    <section id="de-ce-finora" className="relative overflow-hidden bg-muted/30">
      <AuroraBackground className="py-20" showRadialGradient={false}>
        <div className="container mx-auto px-4 relative z-20">
        <CyberneticBentoGrid 
          title="De ce Finora?"
          items={bentoItems}
        />
        
        <div className="max-w-3xl mx-auto text-center mt-12">
          <p className="text-muted-foreground">
            <strong>Ce ne diferențiază:</strong> Finora îmbină educația structurată cu tool-uri practice și o comunitate activă — totul într-un singur loc.
          </p>
        </div>
        </div>
      </AuroraBackground>
    </section>
  );
};

export default WhyFinora;