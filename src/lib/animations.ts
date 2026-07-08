import { Variants } from "framer-motion";

// Custom premium bezier curves mimicking Stripe and Apple transitions
export const transitionPresets = {
  smoothEase: [0.16, 1, 0.3, 1] as [number, number, number, number],
  springEase: [0.175, 0.885, 0.32, 1.275] as [number, number, number, number],
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: customDelay,
      ease: transitionPresets.smoothEase,
    },
  }),
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

export const scaleHoverVariants = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: transitionPresets.smoothEase,
    },
  },
  tap: {
    scale: 0.98,
  },
};
