import React, { useEffect, useRef, ReactNode } from "react";
interface BentoItemProps {
  className?: string;
  children: ReactNode;
}

// Reusable BentoItem component
const BentoItem = ({ className = "", children }: BentoItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const item = itemRef.current;
    if (!item) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      item.style.setProperty("--mouse-x", `${x}px`);
      item.style.setProperty("--mouse-y", `${y}px`);
    };
    item.addEventListener("mousemove", handleMouseMove);
    return () => {
      item.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  return (
    <div ref={itemRef} className={`bento-item ${className}`}>
      {children}
    </div>
  );
};
interface CyberneticBentoGridProps {
  title?: string;
  items: Array<{
    title: string;
    description: string;
    className?: string;
    icon?: ReactNode;
  }>;
}

// Main Component
export const CyberneticBentoGrid = ({ title = "Core Features", items }: CyberneticBentoGridProps) => {
  return (
    <div className="w-full">
      <div className="w-full max-w-6xl mx-auto z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{title}</h2>
        <div className="bento-grid">
          {items.map((item, index) => (
            <BentoItem key={index} className={item.className || ""}>
              {item.icon && <div className="mb-4">{item.icon}</div>}
              <h3 className="text-xl font-bold color-white">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </BentoItem>
          ))}
        </div>
      </div>
    </div>
  );
};
