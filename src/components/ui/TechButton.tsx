'use client';

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface TechButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  name: string;
  category: string;
  iconName?: string;
  colorClass?: string; // e.g. "from-cyan-500 to-blue-600"
  glowColor?: string;  // e.g. "rgba(6,182,212,0.4)"
  tooltipText?: string;
}

// Helper to render Lucide Icons dynamically
function DynamicIcon({ name, size = 16 }: { name: string; size?: number }) {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return <LucideIcons.Cpu size={size} />;
  return <IconComponent size={size} />;
}

export function TechButton({
  name,
  category,
  iconName = "Cpu",
  colorClass = "from-indigo-500 to-purple-600",
  glowColor = "rgba(99,102,241,0.25)",
  tooltipText,
  className,
  ...props
}: TechButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  // Springs for magnetic interaction
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 15, stiffness: 180 });
  const springY = useSpring(y, { damping: 15, stiffness: 180 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Pull intensity
    const strength = 0.3;
    x.set((clientX - centerX) * strength);
    y.set((clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { left, top } = ref.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const newRipple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    if (props.onClick) props.onClick(e);
  };

  return (
    <div className="relative inline-block">
      <motion.button
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{ x: springX, y: springY }}
        className={cn(
          "group relative flex items-center gap-2.5 px-5 py-3 rounded-2xl border text-sm font-semibold transition-all duration-300 overflow-hidden cursor-pointer backdrop-blur-md select-none",
          "border-neutral-200/60 dark:border-neutral-800/80 bg-white/40 dark:bg-neutral-900/20 text-neutral-800 dark:text-neutral-200",
          "hover:scale-[1.05] hover:border-transparent active:scale-[0.98]",
          className
        )}
        {...props}
      >
        {/* Hover Glow Effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl pointer-events-none scale-110"
          style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }}
        />

        {/* Gradient Border overlay on hover */}
        <div
          className={cn(
            "absolute inset-0 -z-20 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500",
            colorClass
          )}
        />

        {/* Tactile background cover that slides up on hover */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-tr -z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out",
            colorClass
          )}
        />

        {/* Icon & Label */}
        <span className="relative z-10 flex items-center justify-center transition-colors duration-300 group-hover:text-white">
          <DynamicIcon name={iconName} size={15} />
        </span>
        <span className="relative z-10 font-sans tracking-wide transition-colors duration-300 group-hover:text-white">
          {name}
        </span>

        {/* Click Ripples */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/35 -translate-x-1/2 -translate-y-1/2 animate-ping pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: "120px",
              height: "120px",
              animationDuration: "0.6s",
            }}
          />
        ))}
      </motion.button>

      {/* Tooltip on Hover */}
      <AnimatePresence>
        {isHovered && tooltipText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-[10px] font-mono w-max max-w-[180px] xs:max-w-[240px] whitespace-normal text-center shadow-md pointer-events-none z-50 uppercase tracking-wider"
          >
            {tooltipText}
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-neutral-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TechButton;
