import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./GlassCard";

export interface TimelineData {
  id: string;
  title: string;
  subtitle: string;
  subtitleDetail?: string;
  location?: string;
  date: string;
  type?: string;
  bullets: string[];
  tags: string[];
}

interface TimelineProps {
  items: TimelineData[];
  defaultExpandedId?: string;
}

export function Timeline({ items, defaultExpandedId }: TimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(defaultExpandedId || null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="relative pl-6 md:pl-10 border-l border-neutral-200 dark:border-neutral-800 flex flex-col gap-10">
      {items.map((item, idx) => {
        const isExpanded = expandedId === item.id;
        return (
          <div key={item.id} className="relative">
            {/* Timeline Indicator Dot */}
            <div
              className={cn(
                "absolute -left-[31px] md:-left-[47px] top-1.5 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full border transition-all duration-300 z-10",
                isExpanded
                  ? "bg-indigo-600 border-indigo-600 shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                  : "bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-700"
              )}
            >
              <div
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-all",
                  isExpanded ? "bg-white scale-110" : "bg-neutral-400 dark:bg-neutral-600"
                )}
              />
            </div>

            {/* Reusable GlassCard wrapper */}
            <GlassCard
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className={cn(
                "overflow-hidden cursor-pointer",
                isExpanded
                  ? "border-neutral-250 dark:border-neutral-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.15)]"
                  : "bg-white/30 dark:bg-neutral-950/20"
              )}
              onClick={() => toggleExpand(item.id)}
            >
              {/* Card Header */}
              <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg md:text-xl font-bold font-sans text-neutral-950 dark:text-neutral-50">
                      {item.title}
                    </h3>
                    {item.type && (
                      <span className="px-2 py-0.5 text-[9px] font-semibold bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/40 dark:border-neutral-850/40 text-neutral-500 dark:text-neutral-400 rounded-md">
                        {item.type}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-300">
                      {item.subtitle}
                    </span>
                    {item.subtitleDetail && (
                      <>
                        <span className="text-neutral-300 dark:text-neutral-800">•</span>
                        <span className="text-neutral-550 dark:text-neutral-400 font-light">{item.subtitleDetail}</span>
                      </>
                    )}
                    {item.location && (
                      <>
                        <span className="text-neutral-300 dark:text-neutral-800">•</span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {item.location}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start md:self-center">
                  <span className="flex items-center gap-1.5 font-mono text-xs text-neutral-400 dark:text-neutral-500">
                    <Calendar size={13} />
                    {item.date}
                  </span>
                  <div className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-400 dark:text-neutral-500 transition-colors">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </div>

              {/* Collapsible Details */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="px-6 md:px-8 pb-8 pt-2 border-t border-neutral-100 dark:border-neutral-900 bg-neutral-50/40 dark:bg-neutral-950/20">
                      <ul className="flex flex-col gap-3 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans font-light list-disc pl-5">
                        {item.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="marker:text-indigo-500">
                            {bullet}
                          </li>
                        ))}
                      </ul>

                      {/* Tags */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-neutral-200/40 dark:border-neutral-900/50">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-850/50 text-neutral-600 dark:text-neutral-400 shadow-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </div>
        );
      })}
    </div>
  );
}
export default Timeline;
