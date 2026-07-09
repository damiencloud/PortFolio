import React from "react";
import { Github, TrendingUp, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./GlassCard";
import { ProjectCaseStudy } from "@/content";

interface ProjectCardProps {
  project: ProjectCaseStudy;
  index: number;
  onReadCaseStudy: (project: ProjectCaseStudy) => void;
}

export function ProjectCard({ project, index, onReadCaseStudy }: ProjectCardProps) {
  return (
    <GlassCard
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className={cn(
        "flex flex-col justify-between group overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500",
        project.featured ? "md:col-span-2" : "md:col-span-1"
      )}
    >
      <div className="p-5 md:p-8">
        {/* Top Row info */}
        <div className="flex justify-between items-center mb-6">
          <span className="font-mono text-sm text-neutral-400 dark:text-neutral-500">
            PROJECT / 0{index + 1}
          </span>
          {project.featured && (
            <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
              Featured Case
            </span>
          )}
        </div>

        {/* Title & Description */}
        <h3 className="text-2xl md:text-3xl font-bold font-sans text-neutral-950 dark:text-neutral-50 mb-3 group-hover:text-indigo-500 transition-colors">
          {project.title}
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 font-sans text-sm md:text-base font-light leading-relaxed mb-6">
          {project.shortDesc}
        </p>

        {/* Key Metric highlight */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/40 dark:border-neutral-850/40 mb-6">
            <TrendingUp size={18} className="text-indigo-500" />
            <div>
              <span className="text-sm font-bold text-neutral-950 dark:text-neutral-50">
                {project.metrics[0].value}
              </span>
              <span className="text-xs text-neutral-500 ml-1.5 font-light">
                {project.metrics[0].label}
              </span>
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 4).map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/30 dark:border-neutral-800/40 text-neutral-600 dark:text-neutral-400"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Card Footer Actions */}
      <div className="border-t border-neutral-100 dark:border-neutral-900/60 px-5 md:px-8 py-4 md:py-5 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-950/20">
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors"
        >
          <Github size={14} />
          Codebase
        </a>
        <button
          onClick={() => onReadCaseStudy(project)}
          className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
        >
          Read Case Study
          <ArrowUpRight size={14} />
        </button>
      </div>
    </GlassCard>
  );
}
export default ProjectCard;
