import React from "react";
import { Button } from "@/components/ui/button";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { Home, Package, DollarSign, Info } from "lucide-react";

const Navbar = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { 
      name: "Cursuri", 
      onClick: () => scrollToSection("cursuri"),
      icon: <Home className="h-4 w-4" />
    },
    { 
      name: "Tool-uri", 
      onClick: () => scrollToSection("tool-uri"),
      icon: <Package className="h-4 w-4" />
    },
    { 
      name: "Prețuri", 
      onClick: () => scrollToSection("preturi"),
      icon: <DollarSign className="h-4 w-4" />
    },
    { 
      name: "Despre", 
      onClick: () => scrollToSection("despre"),
      icon: <Info className="h-4 w-4" />
    },
  ];

  const logo = (
    <span className="text-lg font-bold bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] bg-clip-text text-transparent whitespace-nowrap">
      Finora
    </span>
  );

  const rightButtons = (
    <>
      <Button
        variant="ghost"
        onClick={() => scrollToSection("lead-magnet")}
        className="text-foreground hover:bg-[hsl(var(--aqua))]/10 px-5 py-2.5 text-sm rounded-full font-medium"
      >
        Login
      </Button>
      <Button
        className="bg-gradient-to-r from-[hsl(var(--minty-green))] to-[hsl(var(--aqua))] hover:opacity-90 text-white font-semibold rounded-full px-5 py-2.5 text-sm shadow-glow transition-opacity"
        onClick={() => scrollToSection("lead-magnet")}
      >
        Crează cont
      </Button>
    </>
  );

  return (
    <>
      <FloatingNav 
        navItems={navItems}
        logo={logo}
        rightButtons={rightButtons}
      />
    </>
  );
};

export default Navbar;