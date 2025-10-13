"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export const FloatingNav = ({
  navItems,
  className,
  logo,
  rightButtons,
}: {
  navItems: {
    name: string;
    onClick: () => void;
    icon?: JSX.Element;
  }[];
  className?: string;
  logo?: JSX.Element;
  rightButtons?: JSX.Element;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (onClick: () => void) => {
    onClick();
    setIsMenuOpen(false);
  };

  return (
    <>
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-[5000] bg-gradient-to-r from-[hsl(var(--deep-teal))]/10 via-[hsl(var(--aqua))]/5 to-[hsl(var(--minty-green))]/10 backdrop-blur-md border-b border-border/20",
          className
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3 md:py-4">
            {/* Logo */}
            {logo && <div className="flex-shrink-0">{logo}</div>}
            
            {/* Hamburger Menu Button - Mobile Only */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-foreground hover:text-[hsl(var(--aqua))] transition-colors p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((navItem: any, idx: number) => (
                <button
                  key={`nav-${idx}`}
                  onClick={navItem.onClick}
                  className={cn(
                    "relative items-center flex space-x-1 text-foreground hover:bg-[hsl(var(--aqua))]/10 transition-all px-5 py-2.5 text-sm font-medium whitespace-nowrap rounded-full",
                    idx === 0 && "bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] text-white hover:opacity-90"
                  )}
                >
                  {navItem.name}
                </button>
              ))}
            </div>

            {/* Right Buttons */}
            {rightButtons && <div className="hidden md:flex items-center gap-2 flex-shrink-0">{rightButtons}</div>}
          </div>
        </div>
      </div>
      
      {/* Spacer to prevent content from going under navbar */}
      <div className="h-[60px] md:h-[68px]" />

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-[60px] left-0 right-0 border-b border-border/20 bg-background/98 backdrop-blur-lg shadow-lg z-[4999]"
          >
            <div className="container mx-auto px-4 py-2 flex flex-col gap-2">
              {navItems.map((navItem: any, idx: number) => (
                <button
                  key={`mobile-nav-${idx}`}
                  onClick={() => handleNavClick(navItem.onClick)}
                  className={cn(
                    "text-foreground hover:bg-[hsl(var(--aqua))]/10 transition-all px-5 py-3 text-left text-base font-medium rounded-full",
                    idx === 0 && "bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] text-white hover:opacity-90"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {navItem.icon}
                    <span>{navItem.name}</span>
                  </div>
                </button>
              ))}
              {rightButtons && (
                <div className="flex flex-col gap-2 mt-2 pb-2">
                  {rightButtons}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
