import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { Download, Menu, X } from "lucide-react";
import { siteConfig, mainNavLinks } from "@/content";
import { ShimmerButton } from "@/components/ui/ShimmerButton";

export function FloatingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Section tracking logic
      const scrollPosition = window.scrollY + 120;
      const sections = mainNavLinks.map((link) => link.href.substring(1));
      sections.push("home");

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock background scroll when mobile menu is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Top Border Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 origin-left z-[9999]"
        style={{ scaleX }}
      />

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full px-6 md:px-12 pb-4 pt-[max(1.5rem,env(safe-area-inset-top))]",
          isScrolled ? "py-4 pt-[max(1rem,env(safe-area-inset-top))]" : ""
        )}
      >
        <div
          className={cn(
            "max-w-7xl mx-auto flex items-center justify-between transition-all duration-300 rounded-full px-6 py-2.5 border border-transparent",
            isScrolled
              ? "bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.15)] border-neutral-200/50 dark:border-neutral-800/50"
              : ""
          )}
        >
          {/* Logo */}
          <a
            href="#home"
            className="flex items-center gap-1.5 font-mono text-lg font-bold text-neutral-900 dark:text-neutral-50 tracking-wider hover:opacity-80 transition-opacity"
          >
            <span className="text-indigo-500 font-extrabold">&lt;</span>
            {siteConfig.logo}
            <span className="text-indigo-500 font-extrabold">/&gt;</span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
            {mainNavLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBackground"
                      className="absolute inset-0 bg-neutral-100 dark:bg-neutral-900 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <ShimmerButton
              href={siteConfig.resumeUrl}
              download
              background="var(--primary-btn-bg)"
              shimmerColor="var(--primary-btn-shimmer)"
              borderRadius="9999px"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-[var(--primary-btn-text)] border border-transparent hover:scale-[1.02] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              <Download size={13} />
              Resume
            </ShimmerButton>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-menu"
              className="flex lg:hidden p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-800 dark:text-neutral-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-lg flex flex-col justify-center p-8 lg:hidden pt-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] touch-none"
          >
            <nav className="flex flex-col gap-6 items-center text-center">
              {mainNavLinks.map((link, idx) => (
                <motion.a
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "text-2xl font-semibold tracking-wide hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors",
                    activeSection === link.href.substring(1)
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-neutral-700 dark:text-neutral-300"
                  )}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: mainNavLinks.length * 0.05 }}
                className="mt-4 w-full flex justify-center"
              >
                <ShimmerButton
                  href={siteConfig.resumeUrl}
                  download
                  onClick={() => setMobileMenuOpen(false)}
                  background="var(--primary-btn-bg)"
                  shimmerColor="var(--primary-btn-shimmer)"
                  borderRadius="9999px"
                  className="flex items-center gap-2 px-6 py-3 text-base font-semibold text-[var(--primary-btn-text)] shadow-[0_4px_14px_rgba(99,102,241,0.4)] hover:scale-[1.02] transition-all duration-300"
                >
                  <Download size={18} />
                  Download Resume
                </ShimmerButton>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
