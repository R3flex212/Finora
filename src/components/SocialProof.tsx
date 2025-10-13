import { Star } from "lucide-react";
import { Boxes } from "@/components/ui/background-boxes";

const SocialProof = () => {
  const testimonials = [{
    text: "Am ieșit din roșu în 3 luni",
    initials: "AM"
  }, {
    text: "Știu acum exact unde îmi merg banii",
    initials: "RP"
  }, {
    text: "Template-urile m-au ajutat instant",
    initials: "MC"
  }, {
    text: "Comunitatea e super activă și prietenoasă",
    initials: "DI"
  }];
  return <section className="py-16 bg-muted/30 relative overflow-hidden">
      <Boxes />
      <div className="absolute inset-0 w-full h-full bg-muted/30 z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <div className="container mx-auto px-4 relative z-20">
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Încredere în creștere
          </p>
          
          
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => <div key={index} className="bg-card p-4 rounded-lg border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] flex items-center justify-center text-white text-xs font-bold">
                  {testimonial.initials}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">"{testimonial.text}"</p>
            </div>)}
        </div>
      </div>
    </section>;
};
export default SocialProof;