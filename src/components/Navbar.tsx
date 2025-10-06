import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

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
    { name: "Cursuri", url: "cursuri" },
    { name: "Tool-uri", url: "tool-uri" },
    { name: "Prețuri", url: "preturi" },
    { name: "Despre", url: "despre" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-smooth">
      <div className="mx-4 mt-4 md:mx-8 md:mt-6">
        <div className="glass-effect border border-white/10 rounded-2xl px-6 py-4 bg-black/40">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] bg-clip-text text-transparent">
                Finora
              </span>
            </div>

            {/* Center Navigation */}
            <div className="hidden md:flex flex-1 justify-center">
              <div className="flex items-center gap-1">
                {navItems.map((item, index) => (
                  <React.Fragment key={item.name}>
                    <button
                      onClick={() => scrollToSection(item.url)}
                      className="px-5 py-2 text-sm font-medium text-foreground/80 hover:text-[hsl(var(--aqua))] transition-colors"
                    >
                      {item.name}
                    </button>
                    {index < navItems.length - 1 && (
                      <div className="h-5 w-px bg-white/10" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Right Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => scrollToSection("lead-magnet")}
                className="text-foreground/80 hover:text-[hsl(var(--aqua))] hover:bg-transparent px-6"
              >
                Login
              </Button>
              <Button
                className="bg-[hsl(var(--minty-green))] hover:bg-[hsl(var(--minty-green))]/90 text-black font-semibold rounded-full px-6 shadow-glow"
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
                className="text-xs text-foreground/80"
              >
                Login
              </Button>
              <Button
                size="sm"
                className="bg-[hsl(var(--minty-green))] hover:bg-[hsl(var(--minty-green))]/90 text-black font-semibold text-xs rounded-full"
                onClick={() => scrollToSection("lead-magnet")}
              >
                Cont
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;