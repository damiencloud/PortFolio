import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: React.ReactNode;
  hoverEffect?: boolean;
  glowColor?: string;
  glowOpacity?: string;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, hoverEffect = true, glowColor, glowOpacity, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        {...props}
        className={cn(
          "rounded-3xl border border-neutral-200/50 dark:border-neutral-800/50 bg-white/40 dark:bg-neutral-950/45 backdrop-blur-md overflow-hidden shadow-sm transition-all duration-300 relative",
          hoverEffect && "hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700",
          className
        )}
      >
        {glowColor && (
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br -z-10 transition-transform duration-500",
              glowColor,
              glowOpacity || "opacity-30 dark:opacity-60"
            )}
          />
        )}
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";
export default GlassCard;
