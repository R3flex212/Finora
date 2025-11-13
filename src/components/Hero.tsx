import { ArrowRight } from "lucide-react";
import consultant1 from "@/assets/consultant-1.jpg";
import consultant2 from "@/assets/consultant-2.jpg";
import consultant3 from "@/assets/consultant-3.jpg";
import { BentoCell, BentoGrid, ContainerScale, ContainerScroll } from "@/components/ui/hero-gallery-scroll-animation";
import { Button } from "@/components/ui/button";
import cursuriImage from "@/assets/cursuri-hero-new.svg";
import comunitateImage from "@/assets/comunitate-hero.svg";
import taurSeifImage from "@/assets/taur-seif.svg";
import { useEffect, useState } from "react";
const AnimatedCounter = ({
  end,
  duration = 2000,
  suffix = ""
}: {
  end: number;
  duration?: number;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  return <span>{count}{suffix}</span>;
};
const VISUAL_ELEMENTS = [{
  type: "gradient",
  colors: "from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))]"
}, {
  type: "solid",
  color: "bg-[hsl(var(--minty-green))]"
}, {
  type: "gradient",
  colors: "from-[hsl(var(--deep-teal))] to-[hsl(var(--aqua))]"
}, {
  type: "solid",
  color: "bg-[hsl(var(--aqua))]"
}, {
  type: "gradient",
  colors: "from-[hsl(var(--minty-green))] to-[hsl(var(--deep-teal))]"
}];
const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  return <section className="relative">
      <ContainerScroll className="h-[350vh] bg-gradient-to-br from-[hsl(var(--deep-teal))] to-[hsl(var(--background))]">
        <BentoGrid className="sticky left-0 top-0 z-0 h-screen w-full p-4">
          {VISUAL_ELEMENTS.map((element, index) => <BentoCell key={index} className="overflow-hidden rounded-xl shadow-2xl">
              <div className={`size-full ${index === 0 ? 'bg-cover bg-center' : index === 2 ? 'bg-cover bg-center' : index === 4 ? 'bg-[#00f2f2]' : element.type === "gradient" ? `bg-gradient-to-br ${element.colors}` : element.color}`} style={index === 0 ? {
            backgroundImage: `url(${comunitateImage})`
          } : index === 2 ? {
            backgroundImage: `url(${cursuriImage})`
          } : {}}>
                {index === 0 ? <div className="size-full flex items-center justify-between p-8 md:p-12">
                    <div className="flex-1 pr-8">
                      <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                        Tot ce trebuie să știi despre finanțe            
                      </h2>
                      <p className="text-lg md:text-xl text-slate-800 leading-relaxed">
                        Conectează-te cu alți consultanți financiari și învață împreună
                      </p>
                    </div>
                    <div className="flex-shrink-0 h-full flex items-center">
                      <img src={taurSeifImage} alt="Comunitate Finora" className="h-full w-auto" />
                    </div>
                  </div> : <div className="text-center p-8 flex items-center justify-center size-full">
                    {index === 1 && <span className="text-white/20 font-bold text-4xl">Tool-uri</span>}
                    {index === 3 && <div className="flex flex-row gap-8 md:gap-16 items-start justify-center">
                      <div className="flex flex-col items-center">
                        <div className="text-3xl md:text-4xl font-bold mb-1 text-slate-900">
                          <AnimatedCounter end={50} suffix="+" />
                        </div>
                        <div className="text-sm md:text-base text-slate-900">Cursuri</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-3xl md:text-4xl font-bold mb-1 text-slate-900">
                          <AnimatedCounter end={15} suffix="+" />
                        </div>
                        <div className="text-sm md:text-base text-slate-900">Tool-uri</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-3xl md:text-4xl font-bold mb-1 text-slate-900">
                          <AnimatedCounter end={20} suffix="+" />
                        </div>
                        <div className="text-sm md:text-base text-slate-900">Teste practice</div>
                      </div>
                    </div>}
                  {index === 4 && <div className="flex flex-row items-center gap-4 md:gap-6 px-4 py-2">
                    <div className="flex items-center -space-x-2">
                      <img src={consultant1} alt="Consultant 1" className="w-12 h-12 md:w-14 md:h-14 rounded-full border-3 border-white object-cover" />
                      <img src={consultant2} alt="Consultant 2" className="w-12 h-12 md:w-14 md:h-14 rounded-full border-3 border-white object-cover" />
                      <img src={consultant3} alt="Consultant 3" className="w-12 h-12 md:w-14 md:h-14 rounded-full border-3 border-white object-cover" />
                    </div>
                    <div className="flex flex-col items-start gap-0.5">
                      <div className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">100+</div>
                      <div className="text-sm md:text-base text-slate-800 leading-snug">Consultanți financiar<br />recomandă Finora</div>
                    </div>
                  </div>}
                  </div>}
              </div>
            </BentoCell>)}
        </BentoGrid>

        <ContainerScale className="relative z-10 text-center">
          <h1 className="max-w-3xl md:text-6xl font-bold tracking-tight text-foreground drop-shadow-lg mx-0 my-0 px-[40px] text-5xl">
            Educație completă pentru{" "}
            <span className="bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] bg-clip-text text-transparent">
              libertate financiară
            </span>
          </h1>
          <p className="my-6 max-w-2xl text-base md:text-lg text-foreground/80 drop-shadow">
            Învață să gestionezi banii inteligent, să ieși din datorii și să construiești economii — chiar dacă pornești
            de la zero.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="font-semibold px-8 shadow-glow" onClick={() => scrollToSection("lead-magnet")}>
              Începe acum
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button size="lg" variant="outline" className="border-foreground/20 text-foreground hover:bg-foreground/10" onClick={() => scrollToSection("de-ce-finora")}>
              De ce Finora
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Creează cont gratuit • 1 minut</p>
        </ContainerScale>
      </ContainerScroll>
    </section>;
};
export default Hero;