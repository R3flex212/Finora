import { ArrowRight } from "lucide-react";
import consultant1 from "@/assets/consultant-1.jpg";
import consultant2 from "@/assets/consultant-2.jpg";
import consultant3 from "@/assets/consultant-3.jpg";
import { BentoCell, BentoGrid, ContainerScale, ContainerScroll } from "@/components/ui/hero-gallery-scroll-animation";
import { Button } from "@/components/ui/button";
import cursuriImage from "@/assets/cursuri-hero-new.svg";
import comunitateImage from "@/assets/comunitate-hero.svg";
import taurSeifImage from "@/assets/taur-seif.svg";
import bullHeroImage from "@/assets/bull-hero.jpeg";
import greenBackgroundImage from "@/assets/green-background.svg";
import taurButonImage from "@/assets/taur-buton.svg";
import statsBackgroundImage from "@/assets/stats-background.svg";
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
  type: "gradient",
  colors: "from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))]"
}, {
  type: "gradient",
  colors: "from-[hsl(var(--deep-teal))] to-[hsl(var(--aqua))]"
}, {
  type: "solid",
  color: "bg-[hsl(var(--aqua))]"
}, {
  type: "solid",
  color: "bg-[#51c781]"
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
              <div className={`size-full ${index === 0 ? 'bg-cover bg-center' : index === 1 ? 'bg-cover bg-center' : index === 2 ? 'bg-cover bg-center' : index === 3 ? 'bg-cover bg-center' : index === 4 ? 'bg-cover bg-center' : element.type === "gradient" ? `bg-gradient-to-br ${element.colors}` : element.color}`} style={index === 0 ? {
            backgroundImage: `url(${comunitateImage})`
          } : index === 1 ? {
            backgroundImage: `url(${greenBackgroundImage})`
          } : index === 2 ? {
            backgroundImage: `url(${cursuriImage})`
          } : index === 3 ? {
            backgroundImage: `url(${statsBackgroundImage})`
          } : index === 4 ? {
            backgroundImage: `url(${taurButonImage})`,
            backgroundPosition: 'center 60%'
          } : {}}>
                {index === 0 ? <div className="size-full flex items-center justify-between p-8 md:p-12">
                    <div className="flex-1 pr-8">
                      <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                        Tot ce trebuie să știi despre finanțe            
                      </h2>
                      <div className="h-px my-4 bg-slate-900"></div>
                      <ul className="list-disc list-inside space-y-2 mb-4 text-slate-800">
                        <li className="text-base md:text-lg">Cursuri - invata de la experti in domeniul financiar</li>
                        <li className="text-base md:text-lg">Gestioneaza datoriile SMART</li>
                        <li className="text-base md:text-lg">Creaza si urmareste propriul portofoliu</li>
                      </ul>
                      
                    </div>
                    <div className="flex-shrink-0 h-full flex items-center">
                      <img src={taurSeifImage} alt="Comunitate Finora" className="h-full w-auto" />
                    </div>
                  </div> : <div className="text-center p-8 flex flex-col items-center justify-center size-full gap-4">
                    {index === 4 && <>
                      
                      
                      <Button size="lg" className="font-semibold px-8" onClick={() => window.location.href = '/auth'}>
                        Creează cont gratuit
                        <ArrowRight className="ml-2" size={20} />
                      </Button>
                    </>}
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