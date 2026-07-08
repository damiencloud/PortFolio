import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const duration = 1200; // 1.2s total duration
    const intervalTime = 15;
    const steps = duration / intervalTime;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      const currentProgress = Math.min(
        Math.floor((stepCount / steps) * 100),
        100
      );
      setProgress(currentProgress);

      if (stepCount >= steps) {
        clearInterval(timer);
        setIsDone(true);
        setTimeout(() => {
          onComplete();
        }, 600); // Allow fadeout animation
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: "-100%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as any },
          }}
          className="fixed inset-0 bg-neutral-950 flex flex-col justify-between p-8 md:p-16 z-[9999] select-none"
        >
          {/* Top Logo Bracket */}
          <div className="flex justify-between items-center w-full">
            <div className="font-mono text-sm tracking-wider text-neutral-400">
              <span className="text-indigo-500">&lt;</span>
              DM
              <span className="text-indigo-500">/&gt;</span>
            </div>
            <div className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
              Cloud Engineer &amp; DevOps
            </div>
          </div>

          {/* Center Text Reveal */}
          <div className="my-auto flex flex-col items-start gap-4 max-w-4xl">
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: 80 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] as any }}
                className="text-4xl md:text-7xl font-bold font-sans text-neutral-100 leading-tight"
              >
                DAMIEN JOSEPH MARTIN
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.p
                initial={{ y: 40 }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.1,
                  ease: [0.215, 0.61, 0.355, 1] as any,
                }}
                className="text-neutral-400 font-sans text-lg md:text-2xl font-light tracking-wide max-w-2xl"
              >
                Architecting secure, automated, and high-performance cloud environments.
              </motion.p>
            </div>
          </div>

          {/* Bottom Progress Counter */}
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-live="polite"
            className="flex flex-col gap-6 w-full"
          >
            <div className="w-full h-[1px] bg-neutral-800 relative overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
                className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400"
              />
            </div>
            
            <div className="flex justify-between items-end font-mono text-neutral-400">
              <div className="text-xs md:text-sm text-neutral-500 tracking-wider">
                INITIALIZING WORKSPACE
              </div>
              <div className="text-5xl md:text-8xl font-medium tracking-tighter tabular-nums select-none">
                {progress.toString().padStart(3, "0")}
                <span className="text-lg md:text-3xl text-neutral-500 ml-1">%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
