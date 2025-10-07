"use client";
import React, { useState } from "react";
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
  return (
    <div
      className={cn(
        "flex fixed top-4 md:top-6 inset-x-4 md:inset-x-0 mx-auto w-auto md:max-w-fit border border-white/10 rounded-full glass-effect bg-black/70 backdrop-blur-lg shadow-lg z-[5000] px-3 md:px-6 py-2 md:py-3 items-center justify-between md:justify-center gap-2 md:gap-6",
        className
      )}
    >
      {logo && <div className="mr-1 md:mr-2 flex-shrink-0">{logo}</div>}
      
      <div className="flex items-center gap-0.5 md:gap-1 flex-1 md:flex-initial justify-center">
        {navItems.map((navItem: any, idx: number) => (
          <React.Fragment key={`nav-${idx}`}>
            <button
              onClick={navItem.onClick}
              className={cn(
                "relative items-center flex space-x-1 text-white/90 hover:text-[hsl(var(--aqua))] transition-colors px-2 md:px-4 py-2 text-xs md:text-sm font-medium touch-manipulation"
              )}
            >
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="hidden sm:block whitespace-nowrap">{navItem.name}</span>
            </button>
            {idx < navItems.length - 1 && (
              <div className="h-4 md:h-5 w-px bg-white/20" />
            )}
          </React.Fragment>
        ))}
      </div>

      {rightButtons && <div className="ml-1 md:ml-2 flex items-center gap-2 md:gap-3 flex-shrink-0">{rightButtons}</div>}
    </div>
  );
};
