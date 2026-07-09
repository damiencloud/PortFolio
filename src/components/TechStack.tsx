import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { skills, skillCategories, marqueeSkillsRow1, marqueeSkillsRow2 } from "@/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";

// Helper to render category icon
function CategoryIcon({ name, size = 14 }: { name: string; size?: number }) {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} />;
}

export function TechStack() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredSkills = skills.filter(
    (skill) => activeCategory === "all" || skill.category === activeCategory
  );

  return (
    <section id="skills" className="py-36 overflow-hidden relative z-10 border-t border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-950/20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">
        
        {/* Reusable Section Heading */}
        <SectionHeading
          label="Technical Arsenal"
          title="Skills &amp; Technologies"
        />

        {/* 3D Infinite Scroll Marquees */}
        <div className="w-full flex flex-col gap-5 mb-16 relative">
          {/* Shadow fades on sides */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white dark:from-neutral-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white dark:from-neutral-950 to-transparent z-10 pointer-events-none" />

          {/* Marquee Row 1 */}
          <div className="flex overflow-hidden select-none gap-5 w-full">
            <div className="flex items-center justify-around gap-5 animate-infinite-scroll min-w-full">
              {marqueeSkillsRow1.concat(marqueeSkillsRow1).map((item, idx) => (
                <span
                  key={idx}
                  className="px-6 py-3 rounded-2xl text-sm md:text-base font-medium font-sans border border-neutral-200/60 dark:border-neutral-800/60 bg-white/40 dark:bg-neutral-900/20 backdrop-blur-sm text-neutral-800 dark:text-neutral-200 whitespace-nowrap shadow-sm hover:border-indigo-500/50 transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Marquee Row 2 (Reverse directions) */}
          <div className="flex overflow-hidden select-none gap-5 w-full">
            <div className="flex items-center justify-around gap-5 animate-infinite-scroll-reverse min-w-full">
              {marqueeSkillsRow2.concat(marqueeSkillsRow2).map((item, idx) => (
                <span
                  key={idx}
                  className="px-6 py-3 rounded-2xl text-sm md:text-base font-medium font-sans border border-neutral-200/60 dark:border-neutral-800/60 bg-white/40 dark:bg-neutral-900/20 backdrop-blur-sm text-neutral-800 dark:text-neutral-200 whitespace-nowrap shadow-sm hover:border-indigo-500/50 transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-4xl">
          {skillCategories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all border cursor-pointer",
                  isSelected
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md dark:shadow-[0_4px_14px_rgba(99,102,241,0.35)]"
                    : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700"
                )}
              >
                <CategoryIcon name={cat.iconName} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Skill Progress List */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => (
              <GlassCard
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={skill.name}
                className="p-5 flex flex-col gap-3 group"
              >
                <div className="flex justify-between items-center text-sm font-semibold font-sans text-neutral-800 dark:text-neutral-100">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    {skill.name}
                  </span>
                  <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">
                    {skill.level}%
                  </span>
                </div>
                
                {/* Custom Gradient Progress Bar */}
                <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-900 overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={cn("h-full rounded-full bg-gradient-to-r", skill.color)}
                  />
                </div>
              </GlassCard>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
export default TechStack;
