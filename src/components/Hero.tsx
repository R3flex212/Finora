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
      <div className="absolute inset-0 opacity-20">
        <Squares direction="diagonal" speed={0.1} squareSize={40} borderColor="rgba(83, 223, 221, 0.2)" hoverFillColor="rgba(83, 223, 221, 0.1)" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content - Bold Headline */}
          <div className="space-y-8 text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] text-white tracking-tight">
              Educație financiară pentru{" "}
              <span className="bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] bg-clip-text text-transparent">
                libertate financiară
              </span>
            </h1>

            <p className="text-lg md:text-xl lg:text-2xl text-white/80 max-w-xl leading-relaxed">
              Învață să gestionezi banii inteligent, să ieși din datorii și să construiești economii — chiar dacă pornești de la zero.
            </p>

            <div className="pt-4">
              <StarBorder 
                as="button" 
                className="shadow-glow text-lg px-8 py-5" 
                color="hsl(var(--minty-green))" 
                speed="6s" 
                onClick={() => scrollToSection("lead-magnet")}
              >
                <span className="text-xl font-semibold flex items-center gap-2">
                  Începe acum
                  <ArrowRight size={24} />
                </span>
              </StarBorder>
              <p className="text-sm text-white/60 mt-3">Fără card • 1 minut</p>
            </div>
          </div>

          {/* Right Content - Visual with Rating Badge */}
          <div className="relative w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto">
            {/* Rating Badge */}
            <div className="absolute -top-4 right-8 lg:right-0 z-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 flex items-center gap-2">
              <Star className="w-4 h-4 fill-[hsl(var(--minty-green))] text-[hsl(var(--minty-green))]" />
              <span className="text-white font-semibold text-sm">Mii de cursanți</span>
            </div>

            {/* 3D Spline */}
            <div className="relative h-[500px] lg:h-[600px] rounded-2xl overflow-hidden">
              <iframe 
                src="https://my.spline.design/globaltransactions-djf0FeA8QXVr5uzPp4hZELje/" 
                frameBorder="0" 
                width="100%" 
                height="100%"
                title="Financial Education Animation"
              />
            </div>

            {/* Floating Stats Cards */}
            <div className="absolute -bottom-6 left-4 lg:left-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-3 z-20">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-[hsl(var(--aqua))]" />
                <div>
                  <p className="text-white font-semibold text-sm">Acoperire</p>
                  <p className="text-white/70 text-xs">Internațională</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>;
};
export default Hero;