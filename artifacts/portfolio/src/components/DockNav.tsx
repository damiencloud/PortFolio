import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useTheme } from "next-themes";
import * as LucideIcons from "lucide-react";
import { mainNavLinks } from "@/content";

// Dynamic Icon Renderer
function NavIcon({ name, size = 18 }: { name?: string; size?: number }) {
  if (!name) return <LucideIcons.HelpCircle size={size} />;
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return <LucideIcons.HelpCircle size={size} />;
  return <IconComponent size={size} />;
}

interface DockItemProps {
  mouseX: any;
  href: string;
  label: string;
  iconName?: string;
}

function DockItem({ mouseX, href, label, iconName }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  const distanceLimit = 150;
  const sizeRange = [40, 68];

  const distance = useMotionValue(distanceLimit);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const itemCenterX = rect.left + rect.width / 2;
      const dist = Math.abs(e.clientX - itemCenterX);
      if (dist < distanceLimit) {
        distance.set(dist);
      } else {
        distance.set(distanceLimit);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [distance]);

  const size = useTransform(distance, [0, distanceLimit], sizeRange);
  const sizeSpring = useSpring(size, { damping: 15, stiffness: 200 });

  const handleScrollTo = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div ref={ref} className="group relative">
      <motion.a
        href={href}
        onClick={handleScrollTo}
        style={{ width: sizeSpring, height: sizeSpring }}
        className="flex items-center justify-center rounded-full bg-white/10 dark:bg-neutral-900/40 text-neutral-800 dark:text-neutral-200 border border-neutral-200/50 dark:border-neutral-800/40 shadow-sm backdrop-blur-md transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800/70"
      >
        <NavIcon name={iconName} />
      </motion.a>

      {/* Tooltip */}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-md text-[10px] font-medium tracking-wide uppercase bg-neutral-900/90 text-neutral-100 dark:bg-neutral-50 dark:text-neutral-950 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all duration-200 shadow-sm">
        {label}
      </span>
    </div>
  );
}

export function DockNav() {
  const { theme, setTheme } = useTheme();
  const mouseX = useMotionValue(Infinity);

  const handleToggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Add Home item to start of list dynamically
  const dockItems = [
    { label: "Home", href: "#home", iconName: "Home" },
    ...mainNavLinks
  ];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 1.2 }}
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-end gap-3 px-4 py-3 rounded-2xl bg-white/20 dark:bg-neutral-950/20 border border-white/30 dark:border-neutral-900/30 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl"
    >
      {dockItems.map((item) => (
        <DockItem
          key={item.label}
          mouseX={mouseX}
          href={item.href}
          label={item.label}
          iconName={item.iconName}
        />
      ))}

      {/* Divider */}
      <div className="w-[1px] h-8 bg-neutral-300/40 dark:bg-neutral-800/40 mx-1 align-middle self-center" />

      {/* Theme Toggle in Dock */}
      <div className="group relative">
        <button
          onClick={handleToggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 dark:bg-neutral-900/40 text-neutral-800 dark:text-neutral-200 border border-neutral-200/50 dark:border-neutral-800/40 shadow-sm backdrop-blur-md transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800/70"
          aria-label="Toggle theme"
        >
          <LucideIcons.Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <LucideIcons.Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-md text-[10px] font-medium tracking-wide uppercase bg-neutral-900/90 text-neutral-100 dark:bg-neutral-50 dark:text-neutral-950 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all duration-200 shadow-sm">
          Theme
        </span>
      </div>
    </motion.div>
  );
}
