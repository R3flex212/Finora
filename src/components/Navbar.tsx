import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { name: "Cursuri", id: "cursuri" },
    { name: "Tool-uri", id: "tool-uri" },
    { name: "Prețuri", id: "preturi" },
    { name: "Despre", id: "despre" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div
            className={`
              relative rounded-full backdrop-blur-lg border transition-all duration-300
              ${isScrolled 
                ? 'bg-black/70 border-white/10 shadow-lg' 
                : 'bg-black/50 border-white/5'
              }
            `}
          >
            <div className="px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex-shrink-0">
                  <span className="text-xl font-bold bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] bg-clip-text text-transparent">
                    Finora
                  </span>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-1">
                  {navItems.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <button
                        onClick={() => scrollToSection(item.id)}
                        className="px-4 py-2 text-sm font-medium text-white/90 hover:text-[hsl(var(--aqua))] transition-colors rounded-full hover:bg-white/5"
                      >
                        {item.name}
                      </button>
                      {index < navItems.length - 1 && (
                        <div className="h-4 w-px bg-white/10" />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    onClick={() => scrollToSection("lead-magnet")}
                    className="text-white/90 hover:text-[hsl(var(--aqua))] hover:bg-white/5 px-5 py-2 rounded-full"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => scrollToSection("lead-magnet")}
                    className="bg-[hsl(var(--aqua))] hover:bg-[hsl(var(--aqua))]/90 text-white font-semibold rounded-full px-5 py-2 shadow-glow"
                  >
                    Crează cont
                  </Button>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 text-white/90 hover:text-[hsl(var(--aqua))] transition-colors rounded-full hover:bg-white/5"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-20 left-4 right-4">
            <div className="bg-black/90 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              <div className="px-4 py-3 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="w-full text-left px-4 py-3 text-base font-medium text-white/90 hover:text-[hsl(var(--aqua))] hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
                <div className="h-px bg-white/10 my-2" />
                <button
                  onClick={() => scrollToSection("lead-magnet")}
                  className="w-full text-left px-4 py-3 text-base font-medium text-white/90 hover:text-[hsl(var(--aqua))] hover:bg-white/5 rounded-lg transition-colors"
                >
                  Login
                </button>
                <Button
                  onClick={() => scrollToSection("lead-magnet")}
                  className="w-full bg-[hsl(var(--aqua))] hover:bg-[hsl(var(--aqua))]/90 text-white font-semibold rounded-lg py-3 shadow-glow"
                >
                  Crează cont
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;