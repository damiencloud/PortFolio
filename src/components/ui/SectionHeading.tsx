import React from "react";
import { motion } from "framer-motion";

interface SectionHeadingProps {
  label: string;
  title: string;
  className?: string;
}

export function SectionHeading({ label, title, className }: SectionHeadingProps) {
  return (
    <div className={`flex flex-col items-center mb-16 text-center ${className || ""}`}>
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-xs md:text-sm font-semibold tracking-widest text-indigo-500 uppercase"
      >
        {label}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-3xl md:text-5xl font-bold font-sans text-neutral-900 dark:text-neutral-50 mt-2"
      >
        {title}
      </motion.h2>
    </div>
  );
}
export default SectionHeading;
