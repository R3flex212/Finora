import { Target, FileText, Users, TrendingUp } from "lucide-react";

const WhyFinora = () => {
  const pillars = [
    {
      icon: Target,
      title: "Claritate",
      description: "Trasee în 3 niveluri: Începător, Intermediar, Avansat — alegi ce ți se potrivește.",
    },
    {
      icon: FileText,
      title: "Aplicabil",
      description: "Fișe de lucru, template-uri și pași concreți pe care îi poți folosi imediat.",
    },
    {
      icon: Users,
      title: "Comunitate",
      description: "Q&A live, suport din partea comunității și responsabilizare reciprocă.",
    },
    {
      icon: TrendingUp,
      title: "Progres măsurabil",
      description: "Obiective clare, trackere și pași pe care îi vezi cum se îndeplinesc.",
    },
  ];

  return (
    <section id="de-ce-finora" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            De ce Finora?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nu mai învăț teorie abstractă. Primești claritate, instrumente și progres real.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-8">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-all group"
            >
              <pillar.icon className="w-10 h-10 mb-4 text-[hsl(var(--aqua))] group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold mb-2">{pillar.title}</h3>
              <p className="text-sm text-muted-foreground">{pillar.description}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <p className="text-muted-foreground">
            <strong>Ce ne diferențiază:</strong> Finora îmbină educația structurată cu tool-uri practice și o comunitate activă — totul într-un singur loc.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyFinora;
