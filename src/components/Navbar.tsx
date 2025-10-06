import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Home, Wrench, DollarSign, Info } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Cursuri", url: "cursuri", icon: Home },
    { name: "Tool-uri", url: "tool-uri", icon: Wrench },
    { name: "Prețuri", url: "preturi", icon: DollarSign },
    { name: "Despre", url: "despre", icon: Info },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${isScrolled ? "bg-background/80 backdrop-blur-lg shadow-sm" : "bg-transparent"}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] bg-clip-text text-transparent">
              Finora
            </span>
          </div>

          {/* Center Navigation */}
          <div className="hidden md:flex flex-1 justify-center">
            <NavBar items={navItems} className="relative" />
          </div>

          {/* Right Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => scrollToSection("lead-magnet")}
              className="text-foreground/80 hover:text-primary rounded-full px-6"
            >
              Login
            </Button>
            <Button
              className="gradient-primary shadow-glow rounded-full px-6"
              onClick={() => scrollToSection("lead-magnet")}
            >
              Crează cont
            </Button>
          </div>

          {/* Mobile Menu - Simple buttons */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scrollToSection("lead-magnet")}
              className="text-xs"
            >
              Login
            </Button>
            <Button
              size="sm"
              className="gradient-primary shadow-glow text-xs"
              onClick={() => scrollToSection("lead-magnet")}
            >
              Cont
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;