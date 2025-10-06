import { AlertCircle } from "lucide-react";

const Disclaimer = () => {
  return (
    <section id="despre" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-card rounded-xl border border-border p-8">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-[hsl(var(--aqua))] flex-shrink-0 mt-1" />
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Notă importantă</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Conținutul oferit de Finora are rol educațional și nu reprezintă consultanță
                financiară individualizată. Deciziile financiare trebuie luate în funcție de
                situația personală și, dacă este necesar, cu sprijinul unui consultant autorizat.
                Tool-urile și calculatoarele oferă estimări bazate pe informațiile introduse și nu
                garantează rezultate specifice. Investițiile comportă riscuri, iar performanțele
                trecute nu garantează rezultate viitoare.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <a
                  href="#"
                  className="text-[hsl(var(--aqua))] hover:underline font-medium"
                >
                  Termeni și Condiții
                </a>
                <a
                  href="#"
                  className="text-[hsl(var(--aqua))] hover:underline font-medium"
                >
                  Politica de Confidențialitate
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Disclaimer;
