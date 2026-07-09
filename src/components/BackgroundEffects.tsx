import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function BackgroundEffects() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const spotlightX = useSpring(mouseX, springConfig);
  const spotlightY = useSpring(mouseY, springConfig);

  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 3D Animated Background Blobs */}
      <div className="absolute inset-0 filter blur-[120px] opacity-45 dark:opacity-40 transition-opacity duration-1000">
        {/* Blob 1: Indigo */}
        <motion.div
          animate={isMobile ? undefined : {
            x: [0, 80, -40, 0],
            y: [0, -60, 90, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-indigo-600/30 to-violet-500/20"
        />

        {/* Blob 2: Cyan */}
        <motion.div
          animate={isMobile ? undefined : {
            x: [0, -90, 60, 0],
            y: [0, 80, -60, 0],
            scale: [1, 0.85, 1.15, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-[10%] -right-[10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-br from-cyan-500/25 to-blue-600/20"
        />

        {/* Blob 3: Violet/Magenta */}
        <motion.div
          animate={isMobile ? undefined : {
            x: [0, 50, -60, 0],
            y: [0, 80, -50, 0],
            scale: [1, 1.1, 0.8, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[40%] left-[30%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-tr from-violet-600/20 to-fuchsia-500/15"
        />
      </div>

      {/* Mouse Following Spotlight Glow (Hardware-accelerated) - Hidden on Mobile */}
      {!isMobile && (
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full bg-radial from-indigo-500/6 via-violet-500/2 to-transparent pointer-events-none -translate-x-1/2 -translate-y-1/2 dark:from-indigo-500/8 dark:via-cyan-500/3"
          style={{
            left: spotlightX,
            top: spotlightY,
          }}
        />
      )}
    </div>
  );
}
