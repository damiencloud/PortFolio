import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Minimize2, Terminal, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { projects, ProjectCaseStudy } from "@/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/ui/ProjectCard";

export function ProjectShowcase() {
  const [selectedProject, setSelectedProject] = useState<ProjectCaseStudy | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "architecture" | "technical">("overview");

  return (
    <section id="projects" className="py-36 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
      
      {/* Reusable Section Heading */}
      <SectionHeading
        label="Featured Works"
        title="Projects &amp; Case Studies"
      />

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {projects.map((proj, idx) => (
          <ProjectCard
            key={proj.id}
            project={proj}
            index={idx}
            onReadCaseStudy={(p) => {
              setSelectedProject(p);
              setActiveTab("overview");
            }}
          />
        ))}
      </div>

      {/* Case Study Fullscreen Modal/Overlay Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm"
            />

            {/* Case Study Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 220 }}
              className="relative w-full max-w-3xl h-full bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-850 shadow-2xl flex flex-col justify-between z-10"
            >
              {/* Drawer Header */}
              <div className="flex justify-between items-center px-8 py-6 border-b border-neutral-200 dark:border-neutral-900">
                <div>
                  <span className="text-[10px] font-semibold text-indigo-500 uppercase tracking-widest">
                    Technical Case Study
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold font-sans text-neutral-900 dark:text-neutral-50 mt-1">
                    {selectedProject.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400 transition-colors cursor-pointer"
                  aria-label="Close case study"
                >
                  <Minimize2 size={20} />
                </button>
              </div>

              {/* Tabs Navigation */}
              <div className="flex border-b border-neutral-200 dark:border-neutral-900 px-8 bg-neutral-50/50 dark:bg-neutral-950/20">
                {(["overview", "architecture", "technical"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "py-3.5 px-4 font-semibold text-xs md:text-sm border-b-2 transition-all capitalize -mb-[1px] cursor-pointer",
                      activeTab === tab
                        ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                        : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Modal Body / Tab Content */}
              <div className="flex-1 overflow-y-auto p-8 font-sans">
                {activeTab === "overview" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-6"
                  >
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 mb-2">
                        Project Overview
                      </h4>
                      <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                        {selectedProject.overview}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-850 bg-neutral-50/50 dark:bg-neutral-900/40">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-red-500 mb-2">
                          The Challenge
                        </h5>
                        <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                          {selectedProject.problem}
                        </p>
                      </div>
                      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-850 bg-neutral-50/50 dark:bg-neutral-900/40">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-500 mb-2">
                          The Solution
                        </h5>
                        <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                          {selectedProject.solution}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 mb-4">
                        Key Metrics &amp; Achievements
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        {selectedProject.metrics.map((met, mIdx) => (
                          <div
                            key={mIdx}
                            className="p-4 text-center rounded-2xl border border-indigo-500/10 dark:border-indigo-500/20 bg-indigo-500/5"
                          >
                            <span className="block text-xl md:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
                              {met.value}
                            </span>
                            <span className="block text-[10px] md:text-xs text-neutral-500 font-light mt-1">
                              {met.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "architecture" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-6"
                  >
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 mb-2">
                        System Architecture
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light mb-4">
                        A structured breakdown of the operational workflow designed for this project:
                      </p>
                    </div>

                    {/* Timeline Flow representation */}
                    <div className="flex flex-col gap-4 pl-4 border-l-2 border-indigo-500/30">
                      {selectedProject.architecture.steps.map((step, sIdx) => (
                        <div key={sIdx} className="relative pl-6">
                          <div className="absolute -left-[23px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-white font-mono text-[9px] font-bold">
                            {sIdx + 1}
                          </div>
                          <h5 className="text-sm font-bold text-neutral-900 dark:text-neutral-200">
                            {step.title}
                          </h5>
                          <p className="text-xs text-neutral-500 font-light mt-0.5">
                            {step.desc}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-900 bg-neutral-50/70 dark:bg-neutral-950/60 font-mono text-[10px] text-neutral-500 mt-4 uppercase">
                      <span className="font-semibold text-indigo-500 mr-2">FLOW:</span>
                      {selectedProject.architecture.summary}
                    </div>
                  </motion.div>
                )}

                {activeTab === "technical" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-6"
                  >
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 mb-2">
                        Technical Config &amp; Specifications
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light mb-4">
                        Configuration blocks and parameters implemented for task automation and container runtime environment:
                      </p>
                    </div>

                    {/* Mock Code Block */}
                    <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-850 shadow-inner">
                      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-850 font-mono text-[10px] text-neutral-400">
                        <span>CONFIG REPOSITORY</span>
                        <Terminal size={12} />
                      </div>
                      <pre className="p-5 bg-neutral-950 text-neutral-200 font-mono text-xs overflow-x-auto leading-relaxed leading-6 select-all">
                        <code>{selectedProject.techCode}</code>
                      </pre>
                    </div>

                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-2">
                        Environment Parameters &amp; Details
                      </h5>
                      <ul className="flex flex-col gap-2 font-sans text-xs text-neutral-500">
                        <li className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-indigo-500" />
                          <span>Health-checks, logs routing, and automatic SSL setup.</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-indigo-500" />
                          <span>Optimized container layers reducing footprint and deployment latency.</span>
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="px-8 py-5 border-t border-neutral-200 dark:border-neutral-900 flex items-center justify-between bg-neutral-50/80 dark:bg-neutral-950/80 backdrop-blur-md">
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border border-neutral-250 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                >
                  <Github size={13} />
                  Inspect Code
                </a>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-6 py-2 rounded-full text-xs font-semibold bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all cursor-pointer"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
export default ProjectShowcase;
