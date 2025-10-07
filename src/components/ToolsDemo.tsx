import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, Target, Flame, PiggyBank } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ToolsDemo = () => {
  const tools = [
    {
      icon: Calculator,
      title: "Calculator Buget 50/30/20",
      description: "Împarte veniturile optim între nevoi, dorințe și economii",
      badge: "Demo gratuit",
    },
    {
      icon: TrendingUp,
      title: "Calculator Dobândă Compusă",
      description: "Vezi cum cresc investițiile tale în timp",
      badge: "Demo gratuit",
    },
    {
      icon: Flame,
      title: "Snowball Datorii",
      description: "Strategie optimă pentru eliminarea datoriilor",
      badge: "În Smart",
    },
    {
      icon: Target,
      title: "Obiectiv Economii",
      description: "Planifică și urmărește progresul către obiective",
      badge: "În Smart",
    },
    {
      icon: PiggyBank,
      title: "Simulare FIRE",
      description: "Calculează când poți atinge independența financiară",
      badge: "În Freedom",
    },
  ];

  return (
    <section id="tool-uri" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tool-uri inteligente
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Exemple reale, fișe de lucru, calcule automate — totul în câteva click-uri
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-all group relative overflow-hidden"
            >
              <Badge
                className="absolute top-4 right-4 bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] text-white"
              >
                {tool.badge}
              </Badge>
              
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[hsl(var(--aqua))/10] to-[hsl(var(--minty-green))/10] flex items-center justify-center mb-4">
                  <tool.icon className="w-6 h-6 text-[hsl(var(--aqua))]" />
                </div>
                <h3 className="text-lg font-bold mb-2">{tool.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {tool.description}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full group-hover:bg-gradient-to-r group-hover:from-[hsl(var(--aqua))] group-hover:to-[hsl(var(--minty-green))] group-hover:text-white group-hover:border-transparent transition-all"
              >
                Încearcă demo
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsDemo;
