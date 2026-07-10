import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { skills, skillCategories, marqueeSkillsRow1, marqueeSkillsRow2 } from "@/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechButton } from "@/components/ui/TechButton";

// Helper to render category icon
function CategoryIcon({ name, size = 14 }: { name: string; size?: number }) {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} />;
}

// Meta mapping for skills buttons
const skillMetaLookup: { [key: string]: { iconName: string; tooltipText: string; glowColor: string } } = {
  "Python": { iconName: "Code2", tooltipText: "Scripting, virtual mic routing & data parsers", glowColor: "rgba(59,130,246,0.3)" },
  "JavaScript": { iconName: "Cpu", tooltipText: "Dynamic scripts & async WebSocket pairing", glowColor: "rgba(234,179,8,0.3)" },
  "TypeScript": { iconName: "Code2", tooltipText: "Static typing, compile-time safety & IDE integrations", glowColor: "rgba(49,120,198,0.3)" },
  "HTML & CSS": { iconName: "Layout", tooltipText: "Modern layout structures & CSS transitions", glowColor: "rgba(249,115,22,0.3)" },
  "SQL": { iconName: "Database", tooltipText: "Structured queries & relational constraints", glowColor: "rgba(14,165,233,0.3)" },
  "React.js": { iconName: "Globe", tooltipText: "Component state hooks & virtual DOM layouts", glowColor: "rgba(6,182,212,0.3)" },
  "Next.js": { iconName: "Globe", tooltipText: "Server-side rendering, ISR & API middleware", glowColor: "rgba(120,120,120,0.3)" },
  "Tailwind CSS": { iconName: "Layout", tooltipText: "Utility class templates & theme variables", glowColor: "rgba(56,189,248,0.3)" },
  "Django": { iconName: "Server", tooltipText: "MVC architecture, security layers & dashboards", glowColor: "rgba(16,185,129,0.3)" },
  "Node.js": { iconName: "Server", tooltipText: "Asynchronous backend logic & event-driven networks", glowColor: "rgba(51,153,51,0.3)" },
  "PostgreSQL": { iconName: "Database", tooltipText: "Scalable relational engines & JSON indexes", glowColor: "rgba(29,78,216,0.3)" },
  "SQLite": { iconName: "Database", tooltipText: "Embedded audio caching & local settings storage", glowColor: "rgba(14,165,233,0.3)" },
  "Supabase": { iconName: "Database", tooltipText: "OAuth sessions & row-level security (RLS) tables", glowColor: "rgba(52,211,153,0.3)" },
  "AWS (Lightsail, EC2)": { iconName: "Cloud", tooltipText: "Scalable virtual cloud compute instances", glowColor: "rgba(245,158,11,0.3)" },
  "Docker": { iconName: "Cpu", tooltipText: "Containerized application packing & reproducible runtime environments", glowColor: "rgba(36,150,237,0.3)" },
  "Git & GitHub": { iconName: "GitBranch", tooltipText: "Distributed source history & branching states", glowColor: "rgba(120,120,120,0.3)" },
  "Github Actions": { iconName: "Terminal", tooltipText: "Automated compiler checks & CI/CD build scripts", glowColor: "rgba(79,70,229,0.3)" }
};

export function TechStack() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredSkills = skills.filter(
    (skill) => activeCategory === "all" || skill.category === activeCategory
  );

  return (
    <section id="skills" className="py-20 md:py-36 overflow-hidden relative z-10 border-t border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-950/20">
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

        {/* Tactile Magnetic Buttons Grid */}
        <div className="w-full max-w-4xl flex flex-wrap justify-center gap-4">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => {
              const meta = skillMetaLookup[skill.name] || { iconName: "Cpu", tooltipText: `${skill.level}% proficiency`, glowColor: "rgba(99,102,241,0.2)" };
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={skill.name}
                >
                  <TechButton
                    name={skill.name}
                    category={skill.category}
                    iconName={meta.iconName}
                    colorClass={skill.color}
                    glowColor={meta.glowColor}
                    tooltipText={meta.tooltipText}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default TechStack;
