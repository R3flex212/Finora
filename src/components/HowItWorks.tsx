import { UserPlus, Route, Zap, CheckCircle2 } from "lucide-react";
import { Timeline } from "@/components/ui/timeline";

const HowItWorks = () => {
  const timelineData = [
    {
      title: "Pasul 1",
      content: (
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] flex items-center justify-center shadow-glow">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Te înregistrezi
              </h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Contul gratuit îți ia mai puțin de 60 de secunde
              </p>
            </div>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 mb-6">
            <p className="text-foreground text-sm md:text-base mb-4">
              Începe fără investiție inițială. Completezi câteva date de bază și ai acces imediat la platforma Finora.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground text-xs md:text-sm">
                <CheckCircle2 className="w-4 h-4 text-[hsl(var(--minty-green))]" />
                Fără card bancar necesar
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-xs md:text-sm">
                <CheckCircle2 className="w-4 h-4 text-[hsl(var(--minty-green))]" />
                Acces instant la resurse gratuite
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-xs md:text-sm">
                <CheckCircle2 className="w-4 h-4 text-[hsl(var(--minty-green))]" />
                Proces simplu și rapid
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/placeholder.svg"
              alt="Înregistrare simplă"
              className="rounded-lg object-cover h-32 md:h-48 w-full shadow-lg"
            />
            <img
              src="/placeholder.svg"
              alt="Dashboard Finora"
              className="rounded-lg object-cover h-32 md:h-48 w-full shadow-lg"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Pasul 2",
      content: (
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] flex items-center justify-center shadow-glow">
              <Route className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Îți alegi traseul
              </h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Începător, Intermediar sau Avansat — ce ți se potrivește
              </p>
            </div>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 mb-6">
            <p className="text-foreground text-sm md:text-base mb-4">
              Alegi nivelul care se potrivește experienței tale financiare actuale. Fiecare traseu are un plan structurat și progresiv.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-background rounded-lg border border-[hsl(var(--aqua))]/20">
                <h4 className="font-bold text-foreground mb-2">Începător</h4>
                <p className="text-xs text-muted-foreground">Bazele finanțelor personale</p>
              </div>
              <div className="p-4 bg-background rounded-lg border border-[hsl(var(--aqua))]/20">
                <h4 className="font-bold text-foreground mb-2">Intermediar</h4>
                <p className="text-xs text-muted-foreground">Investiții și strategie</p>
              </div>
              <div className="p-4 bg-background rounded-lg border border-[hsl(var(--minty-green))]/20">
                <h4 className="font-bold text-foreground mb-2">Avansat</h4>
                <p className="text-xs text-muted-foreground">Optimizare și diversificare</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/placeholder.svg"
              alt="Trasee disponibile"
              className="rounded-lg object-cover h-32 md:h-48 w-full shadow-lg"
            />
            <img
              src="/placeholder.svg"
              alt="Plan personalizat"
              className="rounded-lg object-cover h-32 md:h-48 w-full shadow-lg"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Pasul 3",
      content: (
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] flex items-center justify-center shadow-glow">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Aplici cu tool-urile Finora
              </h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Calculatoare, template-uri și lecții scurte — rezultate imediate
              </p>
            </div>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 mb-6">
            <p className="text-foreground text-sm md:text-base mb-4">
              Folosești instrumentele practice imediat după ce înveți conceptele. Vezi progresul în timp real și atingi obiectivele stabilite.
            </p>
            <div className="mb-4">
              <h4 className="font-bold text-foreground mb-3">Tool-uri disponibile:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-xs md:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[hsl(var(--aqua))]" />
                  Calculator buget personal
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-xs md:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[hsl(var(--aqua))]" />
                  Template-uri Excel pentru investiții
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-xs md:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[hsl(var(--aqua))]" />
                  Tracker obiective financiare
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-xs md:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[hsl(var(--aqua))]" />
                  Fișe de lucru pentru planificare
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/placeholder.svg"
              alt="Tool-uri practice"
              className="rounded-lg object-cover h-32 md:h-48 w-full shadow-lg"
            />
            <img
              src="/placeholder.svg"
              alt="Rezultate măsurabile"
              className="rounded-lg object-cover h-32 md:h-48 w-full shadow-lg"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="cursuri" className="w-full">
      <Timeline data={timelineData} />
    </section>
  );
};

export default HowItWorks;
