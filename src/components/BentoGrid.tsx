import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, MapPin, Globe, Sparkles, Clock, Cloud, Award } from "lucide-react";
import { aboutContent, educationList, siteConfig } from "@/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatCard } from "@/components/ui/StatCard";

export function BentoGrid() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setTime(new Date().toLocaleTimeString("en-US", options));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const latestEducation = educationList[0];

  return (
    <section id="about" className="py-20 md:py-36 px-6 md:px-12 max-w-7xl mx-auto z-10 relative">
      {/* Reusable Section Heading */}
      <SectionHeading
        label={aboutContent.sectionLabel}
        title={aboutContent.sectionTitle}
      />

      {/* Bento Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[190px]">
        
        {/* Card 1: Main narrative Bio - Span 2 Columns, Span 2 Rows */}
        <GlassCard
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-2 md:row-span-2 p-5 md:p-8 flex flex-col justify-between group overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-indigo-500 font-semibold tracking-wider text-xs uppercase">
              <Sparkles size={14} />
              Professional Narrative
            </div>
            <h3 className="text-xl md:text-2xl font-bold font-sans text-neutral-950 dark:text-neutral-50 leading-tight">
              {aboutContent.heading}
            </h3>
            {aboutContent.paragraphs.map((para, pIdx) => (
              <p
                key={pIdx}
                className={`text-neutral-600 dark:text-neutral-400 font-sans text-sm md:text-base font-light leading-relaxed ${
                  pIdx > 0 ? "hidden sm:block" : ""
                }`}
              >
                {para}
              </p>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs font-mono text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-900 pt-4">
            <Cloud size={14} className="text-cyan-500" />
            <span>AWS / DOCKER / KUBERNETES / GITOPS</span>
          </div>
        </GlassCard>

        {/* Card 2: Interactive Stats - Span 1 Column, Span 2 Rows */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="rounded-3xl p-5 md:p-8 bg-neutral-950 text-neutral-50 border border-neutral-800 flex flex-col justify-between overflow-hidden relative group shadow-lg"
        >
          <div className="absolute inset-0 bg-radial from-violet-600/15 via-transparent to-transparent opacity-70 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">Impact Metrics</span>
            <Award size={16} className="text-violet-400" />
          </div>

          <div className="flex flex-col gap-6 z-10 my-auto">
            {aboutContent.metrics.map((metric, mIdx) => (
              <StatCard
                key={mIdx}
                value={metric.value}
                suffix={metric.suffix}
                label={metric.label}
                className="text-neutral-100"
              />
            ))}
          </div>

          <div className="text-[10px] font-mono text-neutral-500 tracking-wider z-10 uppercase border-t border-neutral-800/80 pt-3">
            VERIFIED CREDENTIALS &amp; STATS
          </div>
        </motion.div>

        {/* Card 3: Clock & timezone widget - Span 1 Column, Span 1 Row */}
        <GlassCard
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="p-6 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Local Time</span>
            <Clock size={14} />
          </div>
          <div className="flex flex-col my-1">
            <span className="text-3xl font-bold font-sans tracking-tight text-neutral-900 dark:text-neutral-50 tabular-nums">
              {time || "00:00:00 AM"}
            </span>
            <span className="text-xs text-neutral-500 font-light mt-1">Bangalore, India (IST)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Active Syncing
          </div>
        </GlassCard>

        {/* Card 4: Location/Globe pulsing dot - Span 1 Column, Span 1 Row */}
        <GlassCard
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="p-6 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Current Location</span>
            <MapPin size={14} />
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <Globe size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold font-sans text-neutral-900 dark:text-neutral-50 leading-tight">
                {siteConfig.location}
              </span>
              <span className="text-xs text-neutral-500 font-light">Relocation Available</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-neutral-400">LAT: 12.9716° N / LON: 77.5946° E</span>
        </GlassCard>

        {/* Card 5: Quick Education - Span 1 Column, Span 1 Row */}
        <GlassCard
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="p-6 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Education Credentials</span>
            <GraduationCap size={15} />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-50 leading-tight line-clamp-1">
              {latestEducation.degree}
            </span>
            <span className="text-xs text-neutral-500 mt-1 font-light line-clamp-1">
              {latestEducation.school}
            </span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400">
            <span>2023 - 2025</span>
            {latestEducation.gpa && (
              <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800/40">
                GPA: {latestEducation.gpa}
              </span>
            )}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
