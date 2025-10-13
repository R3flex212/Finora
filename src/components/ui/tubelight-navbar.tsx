"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LucideIcon, Menu, X } from "lucide-react"
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
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleNavClick = (item: NavItem) => {
    setActiveTab(item.name)
    item.onClick()
    setIsMenuOpen(false)
  }

  return (
    <>
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 pt-4 md:pt-6",
          className,
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between md:justify-center gap-4 bg-gradient-to-r from-[hsl(var(--deep-teal))]/10 via-[hsl(var(--aqua))]/5 to-[hsl(var(--minty-green))]/10 border border-border/20 backdrop-blur-lg py-3 px-4 rounded-full shadow-lg">
            {/* Logo - always visible */}
            {logo && <div className="flex-shrink-0 px-2">{logo}</div>}
            
            {/* Hamburger Menu Button - Mobile Only */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-foreground hover:text-foreground hover:bg-[hsl(var(--aqua))]/20 transition-all p-2 rounded-full"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
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
                      "relative cursor-pointer text-sm font-semibold px-6 py-3 rounded-full transition-colors whitespace-nowrap",
                      "text-foreground/70 hover:text-foreground hover:bg-[hsl(var(--aqua))]/20",
                      isActive && "text-foreground bg-gradient-to-r from-[hsl(var(--aqua))]/20 to-[hsl(var(--minty-green))]/20",
                    )}
                  >
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="lamp"
                        className="absolute inset-0 w-full bg-gradient-to-r from-[hsl(var(--aqua))]/15 to-[hsl(var(--minty-green))]/15 rounded-full -z-10"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      >
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] rounded-t-full shadow-glow">
                          <div className="absolute w-14 h-7 bg-[hsl(var(--aqua))]/30 rounded-full blur-md -top-2 -left-2" />
                          <div className="absolute w-10 h-7 bg-[hsl(var(--minty-green))]/30 rounded-full blur-md -top-1" />
                          <div className="absolute w-5 h-5 bg-[hsl(var(--aqua))]/40 rounded-full blur-sm top-0 left-2" />
                        </div>
                      </motion.div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Right Buttons - Desktop Only */}
            {rightButtons && <div className="hidden md:flex items-center gap-2 flex-shrink-0">{rightButtons}</div>}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-20 left-0 right-0 z-40 mx-4"
          >
            <div className="bg-gradient-to-r from-[hsl(var(--deep-teal))]/10 via-[hsl(var(--aqua))]/5 to-[hsl(var(--minty-green))]/10 border border-border/20 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden">
              <div className="flex flex-col p-2 gap-1">
                {items.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.name

                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNavClick(item)}
                      className={cn(
                        "relative text-left text-base font-semibold px-5 py-3.5 rounded-xl transition-all",
                        "text-foreground/70 hover:text-foreground hover:bg-[hsl(var(--aqua))]/20",
                        isActive && "text-foreground bg-gradient-to-r from-[hsl(var(--aqua))]/20 to-[hsl(var(--minty-green))]/20",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={20} strokeWidth={2.5} />
                        <span>{item.name}</span>
                      </div>
                      {isActive && (
                        <motion.div
                          layoutId="mobile-lamp"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] rounded-r-full"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        >
                          <div className="absolute w-6 h-10 bg-[hsl(var(--aqua))]/20 rounded-full blur-sm -left-1 -top-1" />
                        </motion.div>
                      )}
                    </button>
                  )
                })}
              </div>
              
              {/* Right Buttons in Mobile Menu */}
              {rightButtons && (
                <div className="flex flex-col gap-2 p-3 border-t border-border/20">
                  {rightButtons}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
