import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, FileText, Mail, Table } from "lucide-react";
import { toast } from "sonner";

const LeadMagnet = () => {
  const [email, setEmail] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const benefits = [
    { icon: FileText, text: "Checklist PDF: Primii 7 pași spre un buget sănătos" },
    { icon: Mail, text: "Mini-curs pe email 5 zile: Restart Financiar" },
    { icon: Table, text: "Template de buget (Notion/Excel)" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !gdprConsent) {
      toast.error("Te rugăm să completezi email-ul și să accepți termenii GDPR");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Perfect! Verifică inbox-ul pentru confirmarea abonării.");
      setEmail("");
      setGdprConsent(false);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section id="lead-magnet" className="py-20 bg-gradient-to-br from-[hsl(var(--aqua))/5] to-[hsl(var(--minty-green))/5]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left - Benefits */}
            <div className="p-8 md:p-12 bg-gradient-to-br from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] text-white">
              <h2 className="text-3xl font-bold mb-4">
                Ia ghidul gratuit
              </h2>
              <p className="text-lg mb-8 text-white/90">
                Primii 7 pași spre un buget sănătos
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">{benefit.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Form */}
            <div className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Adresa ta de email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nume@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="gdpr"
                    checked={gdprConsent}
                    onCheckedChange={(checked) => setGdprConsent(checked as boolean)}
                  />
                  <label htmlFor="gdpr" className="text-sm text-muted-foreground leading-relaxed">
                    Sunt de acord cu prelucrarea datelor conform{" "}
                    <a href="#" className="text-[hsl(var(--aqua))] hover:underline">
                      Politicii de Confidențialitate
                    </a>{" "}
                    și doresc să primesc ghidul gratuit
                  </label>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full gradient-primary shadow-glow text-lg"
                >
                  {isSubmitting ? "Se trimite..." : "Trimite-mi ghidul"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Vei primi un email de confirmare (double opt-in). Datele tale sunt protejate conform GDPR.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnet;
