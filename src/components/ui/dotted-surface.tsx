import React from "react";
import { cn } from "@/lib/utils";

export interface DottedSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export function DottedSurface({
  className,
  children,
  ...props
}: DottedSurfaceProps) {
  return (
    <div
      className={cn("relative size-full bg-background", className)}
      {...props}
    >
      {/* Dots pattern overlay */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none z-0",
          "bg-[radial-gradient(rgba(99,102,241,0.12)_1.2px,transparent_1.2px)]",
          "dark:bg-[radial-gradient(rgba(99,102,241,0.18)_1.2px,transparent_1.2px)]",
          "bg-[size:24px_24px]"
        )}
      />

      {/* Top radial glow overlay */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-10 left-1/2 size-full -translate-x-1/2 rounded-full",
          "bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08),transparent_50%)]",
          "dark:bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.12),transparent_50%)]",
          "blur-[30px] z-0"
        )}
      />

      {/* Content wrapper */}
      <div className="relative z-10 size-full">
        {children}
      </div>
    </div>
  );
}

export default DottedSurface;
