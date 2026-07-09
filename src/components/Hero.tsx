import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { heroContent, socialLinks } from "@/content";
import { ShimmerButton } from "@/components/ui/ShimmerButton";

// Helper to render Lucide Icons dynamically
function SocialIcon({ name, size = 16 }: { name: string; size?: number }) {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} />;
}

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.8,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any },
    },
  };

  const wordAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.8 + i * 0.08,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as any,
      },
    }),
  };

  const sentence = heroContent.title;

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex flex-col justify-center items-center px-6 md:px-12 pt-32 pb-16 overflow-hidden z-10"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto text-center flex flex-col items-center gap-6 md:gap-8"
      >
        {/* Eyebrow badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 dark:border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs md:text-sm font-semibold tracking-wide uppercase backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          {heroContent.eyebrow}
        </motion.div>

        {/* Hero Title */}
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold font-sans tracking-tight text-neutral-900 dark:text-neutral-50 max-w-4xl leading-[1.05]">
          {sentence.split(" ").map((word, i) => {
            const isHighlighted = heroContent.highlightWords.some((hWord) =>
              word.toLowerCase().includes(hWord.toLowerCase().replace(/[^a-zA-Z]/g, ""))
            );
            return (
              <motion.span
                custom={i}
                variants={wordAnimation}
                initial="hidden"
                animate="visible"
                key={word + "-" + i}
                className={
                  isHighlighted
                    ? "bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-cyan-400"
                    : ""
                }
                style={{ display: "inline-block", marginRight: "0.25em" }}
              >
                {word}
              </motion.span>
            );
          })}
        </h1>

        {/* Hero Subtitle Description */}
        <motion.p
          variants={itemVariants}
          className="text-neutral-600 dark:text-neutral-400 font-sans text-lg md:text-2xl font-light tracking-wide max-w-3xl leading-relaxed"
        >
          {heroContent.description}
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-4 mt-4"
        >
          <ShimmerButton
            href={heroContent.primaryCta.href}
            background="var(--primary-btn-bg)"
            shimmerColor="var(--primary-btn-shimmer)"
            borderRadius="9999px"
            className="group relative flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-[var(--primary-btn-text)] border border-transparent shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:scale-[1.02] transition-all duration-300"
          >
            {heroContent.primaryCta.label}
            <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </ShimmerButton>

          <ShimmerButton
            href={heroContent.secondaryCta.href}
            background="var(--secondary-btn-bg)"
            shimmerColor="var(--secondary-btn-shimmer)"
            borderRadius="9999px"
            className="flex items-center gap-2 px-7 py-3.5 text-sm font-semibold border border-neutral-300 dark:border-neutral-850 text-[var(--secondary-btn-text)] hover:scale-[1.02] transition-all duration-300 backdrop-blur-md"
          >
            {heroContent.secondaryCta.label}
          </ShimmerButton>
        </motion.div>

        {/* Social Badges */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-6 mt-8 text-neutral-500 dark:text-neutral-400 text-sm font-sans"
        >
          {socialLinks.map((social, idx) => (
            <React.Fragment key={social.platform}>
              {idx > 0 && <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-800" />}
              <a
                href={social.url}
                target={social.platform !== "Email" ? "_blank" : undefined}
                rel={social.platform !== "Email" ? "noopener noreferrer" : undefined}
                className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <SocialIcon name={social.iconName} />
                <span>{social.username}</span>
              </a>
            </React.Fragment>
          ))}
        </motion.div>
      </motion.div>

      {/* Down Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <a
          href="#about"
          className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-neutral-400/50 dark:border-neutral-700/50 p-1.5 transition-colors hover:border-indigo-500"
          aria-label="Scroll down"
        >
          <motion.div
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-1.5 w-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400"
          />
        </a>
      </motion.div>
    </section>
  );
}
