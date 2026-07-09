'use client';

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Terminal, Cpu, Database, Server, Cloud, Globe, KeyRound } from "lucide-react";

// Structure of skill mapped to keyboard keys
interface KeySkill {
  key: string;
  name: string;
  category: "frontend" | "backend" | "devops" | "database";
  level: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  glow: string;
}

export function InteractiveKeyboard() {
  const [pressedKeys, setPressedKeys] = useState<{ [key: string]: boolean }>({});
  const [selectedSkill, setSelectedSkill] = useState<KeySkill | null>(null);
  const [lastTyped, setLastTyped] = useState<string>("");

  const keySkills: KeySkill[] = [
    // Row 1
    { key: "q", name: "React", category: "frontend", level: "Advanced", desc: "Crafting modular, interactive user interfaces with hook states, context APIs, and server components.", color: "from-cyan-500 to-blue-600", glow: "rgba(6,182,212,0.15)", icon: <Globe className="w-4 h-4" /> },
    { key: "w", name: "Next.js", category: "frontend", level: "Intermediate", desc: "Building SEO-optimized full-stack web applications with file routing, ISR, SSR, and API middleware.", color: "from-neutral-700 to-black", glow: "rgba(100,100,100,0.15)", icon: <Globe className="w-4 h-4" /> },
    { key: "e", name: "FastAPI", category: "backend", level: "Advanced", desc: "Designing high-performance backend WebSockets and JSON REST APIs with automatic OpenAPI schema generators.", color: "from-emerald-500 to-teal-600", glow: "rgba(16,185,129,0.15)", icon: <Server className="w-4 h-4" /> },
    { key: "r", name: "Python", category: "backend", level: "Advanced", desc: "Writing efficient automation scripts, data parsers, custom audio routing, and desktop CustomTkinter wrappers.", color: "from-blue-500 to-yellow-500", glow: "rgba(59,130,246,0.15)", icon: <Cpu className="w-4 h-4" /> },
    { key: "t", name: "Django", category: "backend", level: "Intermediate", desc: "Developing secure relational backend architectures with middleware pipelines and admin dashboards.", color: "from-emerald-700 to-green-600", glow: "rgba(4,120,87,0.15)", icon: <Server className="w-4 h-4" /> },

    // Row 2
    { key: "a", name: "TypeScript", category: "frontend", level: "Advanced", desc: "Enforcing strict compile-time types, generic contracts, interfaces, and clean component properties.", color: "from-blue-600 to-cyan-500", glow: "rgba(37,99,235,0.15)", icon: <Cpu className="w-4 h-4" /> },
    { key: "s", name: "JavaScript", category: "frontend", level: "Advanced", desc: "Asynchronous loops, ES6 classes, promises, structural layouts, and interactive DOM micro-interactions.", color: "from-yellow-400 to-amber-500", glow: "rgba(234,179,8,0.15)", icon: <Cpu className="w-4 h-4" /> },
    { key: "d", name: "Tailwind CSS", category: "frontend", level: "Advanced", desc: "Implementing utility-first design systems, animations, custom variables, and fully responsive layouts.", color: "from-sky-400 to-indigo-500", glow: "rgba(56,189,248,0.15)", icon: <Globe className="w-4 h-4" /> },
    { key: "f", name: "Node.js", category: "backend", level: "Intermediate", desc: "Running headless servers, API proxies, build configs, and handling package dependencies.", color: "from-green-500 to-emerald-600", glow: "rgba(34,197,94,0.15)", icon: <Server className="w-4 h-4" /> },
    { key: "g", name: "Supabase", category: "database", level: "Advanced", desc: "Configuring cloud sync databases, OAuth sessions, Storage buckets, and row-level security (RLS).", color: "from-emerald-400 to-teal-500", glow: "rgba(52,211,153,0.15)", icon: <Database className="w-4 h-4" /> },

    // Row 3
    { key: "z", name: "AWS", category: "devops", level: "Intermediate", desc: "Deploying scalable server infrastructure, cloud networks, compute engines, and secure permissions.", color: "from-amber-500 to-orange-600", glow: "rgba(245,158,11,0.15)", icon: <Cloud className="w-4 h-4" /> },
    { key: "x", name: "Docker", category: "devops", level: "Advanced", desc: "Containerizing runtimes, custom Dockerfiles, docker-compose orchestration, and isolated namespaces.", color: "from-blue-600 to-sky-500", glow: "rgba(29,78,216,0.15)", icon: <Cloud className="w-4 h-4" /> },
    { key: "c", name: "GitOps CI/CD", category: "devops", level: "Intermediate", desc: "Automating developer pipelines, GitHub Actions runners, linting pipelines, and automated builds.", color: "from-indigo-600 to-violet-500", glow: "rgba(79,70,229,0.15)", icon: <Terminal className="w-4 h-4" /> },
    { key: "v", name: "Postgres", category: "database", level: "Advanced", desc: "Relational queries, index keys, data migrations, performance constraints, and secure tables.", color: "from-blue-700 to-indigo-600", glow: "rgba(29,78,216,0.15)", icon: <Database className="w-4 h-4" /> },
    { key: "b", name: "GraphQL", category: "database", level: "Intermediate", desc: "Building unified API nodes, queries, mutations, data fetch graphs, and type resolvers.", color: "from-pink-500 to-fuchsia-600", glow: "rgba(236,72,153,0.15)", icon: <Database className="w-4 h-4" /> },
  ];

  const handleKeyPress = useCallback((keyChar: string, isDown: boolean) => {
    const k = keyChar.toLowerCase();
    setPressedKeys((prev) => ({ ...prev, [k]: isDown }));
    
    if (isDown) {
      const match = keySkills.find((skill) => skill.key === k);
      if (match) {
        setSelectedSkill(match);
        setLastTyped(k.toUpperCase());
      }
    }
  }, [keySkills]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keys when user is typing in inputs (contact form)
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      handleKeyPress(e.key, true);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      handleKeyPress(e.key, false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyPress]);

  // Group keySkills by rows for keyboard layout
  const rows = [
    keySkills.slice(0, 5),  // Row 1: Q W E R T
    keySkills.slice(5, 10), // Row 2: A S D F G
    keySkills.slice(10, 15) // Row 3: Z X C V B
  ];

  return (
    <section className="py-36 px-6 md:px-12 max-w-6xl mx-auto relative z-10">
      <div className="flex flex-col items-center gap-12 text-center">
        {/* Title */}
        <div>
          <span className="text-xs md:text-sm font-semibold tracking-widest text-indigo-500 uppercase">
            Tactile Playground
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-sans text-neutral-900 dark:text-neutral-50 mt-2">
            Interactive 3D Keyboard
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-450 font-light mt-3 max-w-xl mx-auto">
            Hover over the keycaps or type on your physical keyboard to test the tactile switches and explore details about my tech stack.
          </p>
        </div>

        {/* Keyboard Deck & Visual Container */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mt-4">
          
          {/* Column 1: The Keyboard (Splans 7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            
            {/* Perspective Wrapper */}
            <div className="perspective-[1000px] w-full flex justify-center py-6 select-none">
              
              {/* Keyboard Case */}
              <div 
                className="transform rotate-x-12 rotate-y-[-2deg] rotate-z-[-2deg] transform-style-3d transition-transform duration-700 ease-out bg-neutral-100 dark:bg-neutral-900 border-4 border-neutral-300 dark:border-neutral-800 rounded-3xl p-6 shadow-[0_25px_60px_rgba(0,0,0,0.15),_inset_0_2px_4px_rgba(255,255,255,0.6)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5),_inset_0_1px_2px_rgba(255,255,255,0.05)] max-w-md w-full relative"
              >
                {/* Status Indicator LEDs */}
                <div className="absolute top-4 right-6 flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <span className="text-[7px] text-neutral-400 dark:text-neutral-500 font-mono scale-90 uppercase">PWR</span>
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)] animate-pulse mt-0.5" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[7px] text-neutral-400 dark:text-neutral-500 font-mono scale-90 uppercase">KEY</span>
                    <div 
                      className={cn(
                        "h-1.5 w-1.5 rounded-full mt-0.5 transition-all duration-200", 
                        lastTyped ? "bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.8)]" : "bg-neutral-300 dark:bg-neutral-700"
                      )} 
                    />
                  </div>
                </div>

                {/* Keyboard Brand/Model Legend */}
                <div className="absolute top-4 left-6 text-[8px] font-mono tracking-wider text-neutral-400 dark:text-neutral-500 uppercase">
                  DASH_SWITCH V1
                </div>

                {/* Key Grid Layout */}
                <div className="flex flex-col gap-4 mt-6">
                  {rows.map((row, rIdx) => (
                    <div 
                      key={rIdx} 
                      className={cn(
                        "flex justify-center gap-3",
                        rIdx === 1 && "pl-6", // QWERTY row staggering simulation
                        rIdx === 2 && "pl-12"
                      )}
                    >
                      {row.map((skill) => {
                        const isDown = pressedKeys[skill.key] || false;
                        const isHovered = selectedSkill?.key === skill.key;

                        return (
                          <div
                            key={skill.key}
                            onMouseDown={() => handleKeyPress(skill.key, true)}
                            onMouseUp={() => handleKeyPress(skill.key, false)}
                            onMouseEnter={() => setSelectedSkill(skill)}
                            onMouseLeave={() => handleKeyPress(skill.key, false)}
                            className="relative cursor-pointer transition-all duration-100 ease-out active:scale-95"
                            style={{ width: "56px", height: "56px" }}
                          >
                            {/* Keycap Body Switch Base (Creates 3D Shadow depth) */}
                            <div className="absolute inset-x-0 bottom-0 h-10 rounded-xl bg-neutral-300 dark:bg-neutral-955 border-b-[5px] border-neutral-400 dark:border-neutral-955/80 shadow-md" />

                            {/* Tactile Keycap (Translates downward on press) */}
                            <div
                              className={cn(
                                "absolute inset-x-0 top-0 h-10 rounded-xl border border-neutral-200 dark:border-neutral-700 flex flex-col items-center justify-between p-1.5 transition-all duration-100 ease-out select-none",
                                isDown
                                  ? "translate-y-[4px] bg-indigo-500 border-indigo-600 dark:border-indigo-600 text-white"
                                  : isHovered
                                  ? "translate-y-[-2px] bg-white dark:bg-neutral-850 text-indigo-500 border-indigo-500/50 shadow-[0_6px_12px_rgba(99,102,241,0.15)]"
                                  : "translate-y-0 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                              )}
                            >
                              {/* Top Legend */}
                              <span className="text-[10px] font-mono font-bold self-start opacity-70 leading-none">
                                {skill.key.toUpperCase()}
                              </span>
                              
                              {/* Central Skill Logo/Icon */}
                              <div 
                                className={cn(
                                  "text-xs mt-0.5", 
                                  isDown ? "text-white" : isHovered ? "text-indigo-500" : "text-neutral-400 dark:text-neutral-500"
                                )}
                              >
                                {skill.icon}
                              </div>

                              {/* Key label */}
                              <span className="text-[7px] font-sans font-semibold tracking-wide uppercase line-clamp-1 scale-90">
                                {skill.name}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Try Typing Notification */}
            <div className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-850 bg-neutral-50 dark:bg-neutral-900/60 font-mono text-[10px] text-neutral-500">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
              </span>
              <span>INPUT_READY: CLICK OR TYPE ANY SWITCH LEGEND</span>
            </div>
          </div>

          {/* Column 2: Selected Skill Case display (Spans 5 cols) */}
          <div className="lg:col-span-5 h-full flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {selectedSkill ? (
                <motion.div
                  key={selectedSkill.key}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="rounded-3xl border border-neutral-200/60 dark:border-neutral-850 bg-white/40 dark:bg-neutral-900/20 backdrop-blur-md p-6 text-left shadow-lg relative overflow-hidden"
                >
                  {/* Decorative glowing gradient blur behind */}
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none -z-10 opacity-40 transition-colors"
                    style={{ background: selectedSkill.glow }}
                  />

                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2.5 rounded-xl bg-gradient-to-tr text-white shadow-sm", selectedSkill.color)}>
                        {selectedSkill.icon}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold font-sans text-neutral-950 dark:text-neutral-50 leading-tight">
                          {selectedSkill.name}
                        </h4>
                        <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-0.5 block">
                          {selectedSkill.category} Configuration
                        </span>
                      </div>
                    </div>
                    
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                      {selectedSkill.level}
                    </span>
                  </div>

                  {/* Body description */}
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base font-sans font-light leading-relaxed mb-5">
                    {selectedSkill.desc}
                  </p>

                  {/* Terminal config snippet simulation */}
                  <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-850 shadow-inner bg-neutral-950 text-neutral-300 p-4 font-mono text-[10px] leading-relaxed">
                    <div className="flex items-center justify-between text-neutral-550 border-b border-neutral-900 pb-2 mb-2 font-mono">
                      <span>LEGEND_TERMINAL</span>
                      <span>KEY_{selectedSkill.key.toUpperCase()}</span>
                    </div>
                    <div className="text-indigo-400">
                      $ init --component {selectedSkill.name.toLowerCase()}
                    </div>
                    <div className="text-emerald-400">
                      &gt; Loading module configuration... OK
                    </div>
                    <div className="text-neutral-450 mt-1">
                      Env variables binded. Skill competency set to {selectedSkill.level}.
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 p-8 text-center flex flex-col items-center justify-center gap-4 h-64 bg-neutral-50/50 dark:bg-neutral-950/20"
                >
                  <KeyRound size={32} className="text-neutral-400 dark:text-neutral-600 animate-pulse" />
                  <div>
                    <h4 className="text-base font-bold font-sans text-neutral-800 dark:text-neutral-300">
                      Hardware Switch Offline
                    </h4>
                    <p className="text-xs text-neutral-500 font-light mt-1.5 max-w-xs leading-normal">
                      Press a key on the virtual 3D keyboard above or hover over a keycap to load the capability definition ledger.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InteractiveKeyboard;
