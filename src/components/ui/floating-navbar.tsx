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
        "flex fixed top-6 inset-x-0 mx-auto max-w-fit border border-white/10 rounded-full glass-effect bg-black/70 backdrop-blur-lg shadow-lg z-[5000] px-6 py-3 items-center justify-center gap-6",
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
