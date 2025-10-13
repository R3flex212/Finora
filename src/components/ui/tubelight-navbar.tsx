"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  onClick: () => void
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  logo?: JSX.Element
  rightButtons?: JSX.Element
}

export function NavBar({ items, className, logo, rightButtons }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0]?.name || "")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 z-50 pt-4 md:pt-6",
        className,
      )}
    >
      <div className="flex items-center gap-3 bg-gradient-to-r from-[hsl(var(--deep-teal))]/10 via-[hsl(var(--aqua))]/5 to-[hsl(var(--minty-green))]/10 border border-border/20 backdrop-blur-lg py-2 px-3 rounded-full shadow-lg">
        {logo && <div className="flex-shrink-0 px-2">{logo}</div>}
        
        <div className="flex items-center gap-1">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.name

            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name)
                  item.onClick()
                }}
                className={cn(
                  "relative cursor-pointer text-sm font-semibold px-5 py-2.5 rounded-full transition-colors",
                  "text-foreground/80 hover:text-[hsl(var(--aqua))]",
                  isActive && "text-[hsl(var(--aqua))]",
                )}
              >
                <span className="hidden md:inline">{item.name}</span>
                <span className="md:hidden">
                  <Icon size={18} strokeWidth={2.5} />
                </span>
                {isActive && (
                  <motion.div
                    layoutId="lamp"
                    className="absolute inset-0 w-full bg-[hsl(var(--aqua))]/10 rounded-full -z-10"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] rounded-t-full">
                      <div className="absolute w-12 h-6 bg-[hsl(var(--aqua))]/20 rounded-full blur-md -top-2 -left-2" />
                      <div className="absolute w-8 h-6 bg-[hsl(var(--minty-green))]/20 rounded-full blur-md -top-1" />
                      <div className="absolute w-4 h-4 bg-[hsl(var(--aqua))]/30 rounded-full blur-sm top-0 left-2" />
                    </div>
                  </motion.div>
                )}
              </button>
            )
          })}
        </div>

        {rightButtons && <div className="flex items-center gap-2 flex-shrink-0">{rightButtons}</div>}
      </div>
    </div>
  )
}
