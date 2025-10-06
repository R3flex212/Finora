import { UserPlus, Route, Zap } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Înregistrează-te",
      description: "Crează contul gratuit în 2 minute",
    },
    {
      icon: Route,
      title: "Alege traseul tău",
      description: "Începător, Intermediar sau Avansat",
    },
    {
      icon: Zap,
      title: "Aplică rapid",
      description: "Folosește tool-urile Finora direct",
    },
  ];

  return (
    <section id="cursuri" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Cum funcționează?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simplu. Clar. Aplicabil.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-card p-8 rounded-xl border border-border hover:shadow-lg transition-all group"
            >
              <div className="absolute -top-4 left-8 w-12 h-12 rounded-full bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] flex items-center justify-center text-white font-bold text-lg shadow-glow">
                {index + 1}
              </div>
              <div className="mt-8">
                <step.icon className="w-12 h-12 mb-4 text-[hsl(var(--aqua))] group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
