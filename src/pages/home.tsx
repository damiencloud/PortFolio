import React from "react";
import { Hero } from "@/components/Hero";
import { BentoGrid } from "@/components/BentoGrid";
import { TechStack } from "@/components/TechStack";
import { InteractiveKeyboard } from "@/components/InteractiveKeyboard";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { Certificates } from "@/components/Certificates";
import { ContactSection } from "@/components/ContactSection";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { FloatingNavbar } from "@/components/FloatingNavbar";
import { DockNav } from "@/components/DockNav";
import { ChevronUp } from "lucide-react";
import { siteConfig, footerNavLinks, socialLinks } from "@/content";
import { DottedSurface } from "@/components/ui/dotted-surface";

export default function Home() {
  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const githubLink = socialLinks.find((s) => s.platform === "GitHub")?.url || "#";
  const linkedinLink = socialLinks.find((s) => s.platform === "LinkedIn")?.url || "#";

  return (
    <DottedSurface className="relative min-h-screen w-full text-foreground transition-colors duration-300 overflow-x-hidden">
      {/* Background Interactive Effects */}
      <BackgroundEffects />

      {/* Navigation Headers */}
      <FloatingNavbar />

      {/* Main Sections */}
      <main className="relative z-10 w-full flex flex-col">
        {/* Hero Area */}
        <Hero />

        {/* Bento Dashboard (About) */}
        <BentoGrid />

        {/* Career Timeline (Experience) */}
        <ExperienceTimeline />

        {/* Tech Skill sets (Skills) */}
        <TechStack />

        {/* Interactive 3D Keyboard */}
        <InteractiveKeyboard />

        {/* Case Studies (Projects) */}
        <ProjectShowcase />

        {/* Credentials (Education / Certifications) */}
        <Certificates />

        {/* Contact connections */}
        <ContactSection />
      </main>

      {/* Bottom Floating Menu Dock */}
      <DockNav />

      {/* Sleek Premium Footer */}
      <footer className="relative border-t border-neutral-200/50 dark:border-neutral-900 bg-white/30 dark:bg-neutral-950/30 backdrop-blur-md py-12 px-6 md:px-12 z-20 pb-28">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <a
              href="#home"
              className="font-mono text-base font-bold text-neutral-900 dark:text-neutral-50 tracking-wider"
            >
              <span className="text-indigo-500 font-extrabold">&lt;</span>
              {siteConfig.logo}
              <span className="text-indigo-500 font-extrabold">/&gt;</span>
            </a>
            <p className="text-xs text-neutral-500 font-sans font-light mt-1 text-center md:text-left">
              Cloud Computing Engineer · DevOps CI/CD · Full Stack Developer
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 text-xs text-neutral-500 font-medium font-sans">
            <span className="font-light">
              &copy; {new Date().getFullYear()} <strong>{siteConfig.name}</strong>. All rights reserved.
            </span>
            <div className="flex gap-4">
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-500 transition-colors"
              >
                GitHub
              </a>
              <a
                href={linkedinLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-500 transition-colors"
              >
                LinkedIn
              </a>
            </div>
            <a
              href="#home"
              onClick={handleScrollToTop}
              className="p-2 rounded-full border border-neutral-200/60 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all cursor-pointer"
              aria-label="Back to top"
            >
              <ChevronUp size={14} />
            </a>
          </div>
        </div>
      </footer>
    </DottedSurface>
  );
}
