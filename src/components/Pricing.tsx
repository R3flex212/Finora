import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Start",
      monthlyPrice: 8,
      annualPrice: 77, // ~2 months free
      description: "Pentru începători",
      features: [
        "Newsletter & ghid gratuit",
        "Mini-curs email 5 zile",
        "5 lecții 101 (video scurte)",
        "Calculatoare de bază: 50/30/20, snowball, obiectiv",
        "Template Buget (Excel/Notion)",
        "Comunitate (citire)",
      ],
      cta: "Alege Start",
      popular: false,
    },
    {
      name: "Smart",
      monthlyPrice: 12,
      annualPrice: 115, // ~2 months free
      description: "Cel mai popular",
      features: [
        "Tot din Start",
        "Cursuri 101 + 201 (module structurate)",
        "Calculatoare avansate: dobândă compusă, FIRE, credit vs. leasing",
        "Template-uri: Buget, Net Worth, Plan economisire",
        "Comunitate activă + 1 Q&A live/lună",
        "Trasee de învățare recomandate (quiz)",
      ],
      cta: "Începe Smart",
      popular: true,
    },
    {
      name: "Freedom",
      monthlyPrice: 16,
      annualPrice: 154, // ~2 months free
      description: "Pentru cei avansați",
      features: [
        "Tot din Smart",
        "Masterclass lunar + office hours de grup",
        "Simulatoare investiții demo + studii de caz",
        "Certificate de finalizare + insigne progres",
        "Suport prioritar",
      ],
      cta: "Treci la Freedom",
      popular: false,
    },
  ];

  return (
    <section id="preturi" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Alege planul potrivit pentru tine
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Simplu. Clar. Fără costuri ascunse.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-4 bg-muted p-1 rounded-full">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full transition-all ${
                !isAnnual
                  ? "bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] text-white shadow-glow"
                  : "text-muted-foreground"
              }`}
            >
              Lunar
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full transition-all ${
                isAnnual
                  ? "bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] text-white shadow-glow"
                  : "text-muted-foreground"
              }`}
            >
              Anual
              <span className="ml-2 text-xs">(2 luni cadou)</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-card rounded-2xl border-2 p-8 transition-all hover:shadow-xl ${
                plan.popular
                  ? "border-[hsl(var(--aqua))] shadow-lg scale-105"
                  : "border-border"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Cel mai popular
                </Badge>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold">
                    {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-muted-foreground">
                    €/{isAnnual ? "an" : "lună"}
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                className={`w-full mb-6 ${
                  plan.popular
                    ? "gradient-primary shadow-glow"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {plan.cta}
              </Button>

              <ul className="space-y-3">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[hsl(var(--minty-green))] flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Anulezi oricând. Fără taxe ascunse.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
