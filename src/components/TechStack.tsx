import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { skills, skillCategories } from "@/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechButton } from "@/components/ui/TechButton";
import { IconCloud } from "@/components/ui/interactive-icon-cloud";

const slugs = [
  "python",
  "javascript",
  "typescript",
  "html5",
  "css3",
  "react",
  "nextdotjs",
  "tailwindcss",
  "vite",
  "framer",
  "greensock",
  "nodedotjs",
  "express",
  "postgresql",
  "mysql",
  "mongodb",
  "docker",
  "amazonaws",
  "git",
  "github",
  "django",
  "supabase",
  "sqlite"
];

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

        {/* Interactive 3D Icon Cloud */}
        <div className="w-full max-w-lg mx-auto flex items-center justify-center relative mb-12 h-80 md:h-[400px]">
          <IconCloud iconSlugs={slugs} />
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
