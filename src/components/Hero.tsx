import { ArrowRight, Users, Globe, Star } from "lucide-react";
import { Squares } from "@/components/ui/squares-background";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { StarBorder } from "@/components/ui/star-border";
const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  };
  const stats = [
    {
      icon: Users,
      label: "Mii de cursanți",
      value: "În creștere",
    },
    {
      icon: Globe,
      label: "Acoperire",
      value: "Internațională",
    },
    {
      icon: Star,
      label: "Rating",
      value: "Excelent",
    },
  ];
  return (
    <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
      {/* Animated Squares Background */}
      <div className="absolute inset-0 opacity-30">
        <Squares
          direction="diagonal"
          speed={0.1}
          squareSize={40}
          borderColor="rgba(83, 223, 221, 0.3)"
          hoverFillColor="rgba(83, 223, 221, 0.15)"
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <h1 className="flex flex-wrap items-center justify-center lg:justify-start gap-2 leading-tight">
              <LayoutTextFlip
                text="Drumul tău către"
                words={["Libertate financiară", "Bogăție durabilă", "Succes financiar"]}
                duration={3000}
              />
            </h1>

            <p className="text-lg md:text-xl text-white/80 max-w-2xl">
              Cursuri, instrumente și ghidare ca să treci de la zero la libertate financiară.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <StarBorder
                className="text-lg"
                onClick={() => scrollToSection("lead-magnet")}
              >
                <span className="flex items-center justify-center gap-2">
                  Începe gratuit
                  <ArrowRight size={20} />
                </span>
              </StarBorder>
              <StarBorder
                className="text-lg"
                onClick={() => scrollToSection("preturi")}
              >
                Vezi programele
              </StarBorder>
            </div>

            {/* Stats Mini Bar */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm text-white/60">{stat.label}</p>
                  <p className="text-white font-semibold">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - 3D Spline */}
          <div className="relative w-full max-w-md mx-auto h-[500px]">
            <iframe
              src="https://my.spline.design/globaltransactions-djf0FeA8QXVr5uzPp4hZELje/"
              frameBorder="0"
              width="100%"
              height="100%"
            />
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
export default Hero;
