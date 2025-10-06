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
        className="text-white/90 hover:text-[hsl(var(--aqua))] hover:bg-transparent px-4 py-2 text-sm hidden sm:flex"
      >
        Login
      </Button>
      <Button
        className="bg-[hsl(var(--aqua))] hover:bg-[hsl(var(--aqua))]/90 text-white font-semibold rounded-full px-4 py-2 text-sm shadow-glow"
        onClick={() => scrollToSection("lead-magnet")}
      >
        <span className="hidden sm:inline">Crează cont</span>
        <span className="sm:hidden">Cont</span>
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