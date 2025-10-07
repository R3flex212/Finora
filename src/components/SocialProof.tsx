import { Star } from "lucide-react";

const SocialProof = () => {
  const testimonials = [
    { text: "Am ieșit din roșu în 3 luni", initials: "AM" },
    { text: "Știu acum exact unde îmi merg banii", initials: "RP" },
    { text: "Template-urile m-au ajutat instant", initials: "MC" },
    { text: "Comunitatea e super activă și prietenoasă", initials: "DI" },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Încredere în creștere
          </p>
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[hsl(var(--aqua))] text-[hsl(var(--aqua))]" />
            ))}
            <span className="ml-2 text-sm font-medium">4.8/5</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Scor bazat pe feedback-ul utilizatorilor
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card p-4 rounded-lg border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] flex items-center justify-center text-white text-xs font-bold">
                  {testimonial.initials}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
