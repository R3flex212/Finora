import { ArrowRight, Users, Globe, Star } from "lucide-react";
import { Squares } from "@/components/ui/squares-background";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { StarBorder } from "@/components/ui/star-border";
const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  const stats = [{
    icon: Users,
    label: "Mii de cursanți",
    value: "În creștere"
  }, {
    icon: Globe,
    label: "Acoperire",
    value: "Internațională"
  }, {
    icon: Star,
    label: "Rating",
    value: "Excelent"
  }];
  return <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
      {/* Animated Squares Background */}
      <div className="absolute inset-0 opacity-30">
        <Squares direction="diagonal" speed={0.1} squareSize={40} borderColor="rgba(83, 223, 221, 0.3)" hoverFillColor="rgba(83, 223, 221, 0.15)" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <h1 className="flex flex-wrap items-center justify-center lg:justify-start gap-2 leading-tight">
              <LayoutTextFlip text="Educație financiară pentru" words={["Libertate financiară", "Independență financiară", "Bogăție durabilă", "Succes financiar"]} duration={3000} />
            </h1>

            <p className="text-lg md:text-xl text-white/80 max-w-2xl">
              Învață să gestionezi banii inteligent, să ieși din datorii și să construiești economii — chiar dacă pornești de la zero.
            </p>

            <div className="space-y-3 text-white/90 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[hsl(var(--minty-green))] flex items-center justify-center flex-shrink-0">
                  <span className="text-black text-xs">✓</span>
                </div>
                <span className="text-sm">Cursuri pas cu pas, de la începător la avansat</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[hsl(var(--minty-green))] flex items-center justify-center flex-shrink-0">
                  <span className="text-black text-xs">✓</span>
                </div>
                <span className="text-sm">Calculatoare și template-uri gata de folosit</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[hsl(var(--minty-green))] flex items-center justify-center flex-shrink-0">
                  <span className="text-black text-xs">✓</span>
                </div>
                <span className="text-sm">Comunitate activă și Q&A cu experți</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <StarBorder as="button" className="shadow-glow" color="hsl(var(--aqua))" speed="6s" onClick={() => scrollToSection("lead-magnet")}>
                  <span className="text-lg font-semibold">
                    Începe acum
                    <ArrowRight className="ml-2 inline" size={20} />
                  </span>
                </StarBorder>
                <StarBorder as="button" className="bg-white/5" color="hsl(var(--minty-green))" speed="8s" onClick={() => scrollToSection("de-ce-finora")}>
                  <span className="text-lg">De ce Finora</span>
                </StarBorder>
              </div>
              
            </div>

            {/* Stats Mini Bar */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              {stats.map((stat, index) => <div key={index} className="text-center">
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-[hsl(var(--aqua))]" />
                  <p className="text-sm font-semibold text-white">{stat.value}</p>
                  <p className="text-xs text-white/70">{stat.label}</p>
                </div>)}
            </div>
          </div>

          {/* Right Content - 3D Spline */}
          <div className="relative w-full max-w-md mx-auto h-[500px]">
            <iframe src="https://my.spline.design/globaltransactions-djf0FeA8QXVr5uzPp4hZELje/" frameBorder="0" width="100%" height="100%" />
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>;
};
export default Hero;