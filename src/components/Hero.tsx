import { ArrowRight } from "lucide-react";
import { BentoCell, BentoGrid, ContainerScale, ContainerScroll } from "@/components/ui/hero-gallery-scroll-animation";
import { Button } from "@/components/ui/button";
import cursuriImage from "@/assets/cursuri-hero.jpeg";
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
              <div className={`size-full flex items-center justify-center ${index === 0 ? 'bg-cover bg-center' : element.type === "gradient" ? `bg-gradient-to-br ${element.colors}` : element.color}`} style={index === 0 ? { backgroundImage: `url(${cursuriImage})` } : {}}>
                <div className="text-center p-8 text-white/20 font-bold text-4xl">
                  {index === 1 && "Tool-uri"}
                  {index === 2 && "Comunitate"}
                  {index === 3 && "Progres"}
                  {index === 4 && "Succes"}
                </div>
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