import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Ana M.",
      avatar: "AM",
      text: "Am reușit să economisesc pentru avansul la apartament în 8 luni. Tool-urile mi-au arătat exact cât și unde să pun banii.",
      rating: 5,
    },
    {
      name: "Radu P.",
      avatar: "RP",
      text: "Calculatorul de datorii m-a ajutat să plătesc creditul cu 2 ani mai devreme decât planificasem inițial.",
      rating: 5,
    },
    {
      name: "Maria C.",
      avatar: "MC",
      text: "Cursurile sunt clare și directe. Fără fluff, doar informații pe care le poți aplica imediat.",
      rating: 5,
    },
  ];

  const caseStudy = {
    title: "Studiu de caz: De la datorii la economii",
    before: [
      "4 credite diferite",
      "0 € economii",
      "Stress financiar constant",
    ],
    after: [
      "Toate creditele consolidate",
      "3.500 € economii în 6 luni",
      "Plan clar pentru următorii 3 ani",
    ],
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ce spun utilizatorii
          </h2>
          <p className="text-sm text-muted-foreground">
            Rezultatele pot varia în funcție de situația individuală
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-xl border border-border shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-[hsl(var(--aqua))] text-[hsl(var(--aqua))]"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>

        {/* Case Study */}
        <div className="max-w-4xl mx-auto bg-card rounded-xl border border-border p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-6 text-center">
            {caseStudy.title}
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="inline-block px-4 py-2 bg-destructive/10 text-destructive rounded-full text-sm font-semibold mb-4">
                Înainte
              </div>
              <ul className="space-y-2">
                {caseStudy.before.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-destructive">✗</span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="inline-block px-4 py-2 bg-[hsl(var(--minty-green))]/10 text-[hsl(var(--minty-green))] rounded-full text-sm font-semibold mb-4">
                După
              </div>
              <ul className="space-y-2">
                {caseStudy.after.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-[hsl(var(--minty-green))]">✓</span>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
