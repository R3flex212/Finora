"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
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
          "flex fixed top-4 md:top-6 inset-x-4 md:inset-x-0 mx-auto w-auto md:max-w-fit border border-white/10 rounded-full glass-effect bg-black/70 backdrop-blur-lg shadow-lg z-[5000] px-4 md:px-6 py-3 items-center justify-between md:justify-center gap-3 md:gap-6",
          className
        )}
      >
        {logo && <div className="flex-shrink-0">{logo}</div>}
        
        {/* Hamburger Menu Button - Mobile Only */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white/90 hover:text-[hsl(var(--aqua))] transition-colors p-2"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((navItem: any, idx: number) => (
            <React.Fragment key={`nav-${idx}`}>
              <button
                onClick={navItem.onClick}
                className={cn(
                  "relative items-center flex space-x-1 text-white/90 hover:text-[hsl(var(--aqua))] transition-colors px-4 py-2 text-sm font-medium whitespace-nowrap"
                )}
              >
                {navItem.name}
              </button>
              {idx < navItems.length - 1 && (
                <div className="h-5 w-px bg-white/20" />
              )}
            </React.Fragment>
          ))}
        </div>

        {rightButtons && <div className="hidden md:flex items-center gap-2 md:gap-3 flex-shrink-0">{rightButtons}</div>}
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-20 inset-x-4 mx-auto w-auto border border-white/10 rounded-2xl glass-effect bg-black/90 backdrop-blur-lg shadow-2xl z-[4999] overflow-hidden"
          >
            <div className="flex flex-col">
              {navItems.map((navItem: any, idx: number) => (
                <button
                  key={`mobile-nav-${idx}`}
                  onClick={() => handleNavClick(navItem.onClick)}
                  className="text-white/90 hover:text-[hsl(var(--aqua))] hover:bg-white/5 transition-all px-6 py-4 text-left text-base font-medium border-b border-white/5 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    {navItem.icon}
                    <span>{navItem.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
