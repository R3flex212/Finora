"use client";
import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";

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
  const [isOverLight, setIsOverLight] = useState(false);

  useEffect(() => {
    const checkBackgroundColor = () => {
      // Get all sections
      const sections = document.querySelectorAll('section, div[class*="bg-"]');
      const navbarRect = document.querySelector('[data-navbar]')?.getBoundingClientRect();
      
      if (!navbarRect) return;

      // Check which section the navbar is over
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        
        // If section overlaps with navbar
        if (rect.top < navbarRect.bottom && rect.bottom > navbarRect.top) {
          const styles = window.getComputedStyle(section);
          const bgColor = styles.backgroundColor;
          
          // Parse RGB values
          const rgb = bgColor.match(/\d+/g);
          if (rgb) {
            const [r, g, b] = rgb.map(Number);
            // Calculate relative luminance
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            
            // If luminance > 0.5, it's a light background
            setIsOverLight(luminance > 0.5);
          }
          break;
        }
      }
    };

    // Check on scroll and initial load
    checkBackgroundColor();
    window.addEventListener('scroll', checkBackgroundColor);
    window.addEventListener('resize', checkBackgroundColor);
    
    return () => {
      window.removeEventListener('scroll', checkBackgroundColor);
      window.removeEventListener('resize', checkBackgroundColor);
    };
  }, []);

  return (
    <div
      data-navbar
      className={cn(
        "flex fixed top-6 inset-x-0 mx-auto max-w-fit border border-white/10 rounded-full glass-effect backdrop-blur-lg shadow-lg z-[5000] px-6 py-3 items-center justify-center gap-6 transition-colors duration-300",
        isOverLight ? "bg-black/50" : "bg-black/70",
        className
      )}
    >
      {logo && <div className="mr-2">{logo}</div>}
      
      <div className="flex items-center gap-1">
        {navItems.map((navItem: any, idx: number) => (
          <React.Fragment key={`nav-${idx}`}>
            <button
              onClick={navItem.onClick}
              className={cn(
                "relative items-center flex space-x-1 text-white/90 hover:text-[hsl(var(--aqua))] transition-colors px-4 py-2 text-sm font-medium"
              )}
            >
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="hidden sm:block">{navItem.name}</span>
            </button>
            {idx < navItems.length - 1 && (
              <div className="h-5 w-px bg-white/20" />
            )}
          </React.Fragment>
        ))}
      </div>

      {rightButtons && <div className="ml-2 flex items-center gap-3">{rightButtons}</div>}
    </div>
  );
};
