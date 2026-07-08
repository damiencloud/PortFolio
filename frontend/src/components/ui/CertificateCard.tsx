import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Award, ExternalLink, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./GlassCard";
import { Certification } from "@/content";

interface CertificateCardProps {
  cert: Certification;
  index: number;
}

export function CertificateCard({ cert, index }: CertificateCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [15, -15]), { damping: 20, stiffness: 150 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-15, 15]), { damping: 20, stiffness: 150 });

  const [isTouch, setIsTouch] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsTouch(window.matchMedia("(pointer: coarse)").matches);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    if (isTouch) return;
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="perspective-1000"
    >
      <GlassCard
        hoverEffect={false}
        glowColor={cert.color}
        glowOpacity="opacity-30 dark:opacity-60"
        className="p-6 flex flex-col justify-between h-[230px]"
      >
        {/* 3D Floating elements */}
        <div style={{ transform: "translateZ(30px)" }} className="flex justify-between items-start">
          <div className={cn("p-2.5 rounded-2xl border bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm", cert.accent)}>
            <Award size={18} />
          </div>
          <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
            {cert.date}
          </span>
        </div>

        <div style={{ transform: "translateZ(40px)" }} className="flex flex-col gap-2 my-auto">
          <h3 className="text-sm md:text-base font-bold font-sans text-neutral-950 dark:text-neutral-100 leading-snug line-clamp-2 group-hover:text-indigo-500 transition-colors">
            {cert.title}
          </h3>
          <p className="text-xs text-neutral-500 font-sans font-light">
            Issued by <span className="font-semibold text-neutral-700 dark:text-neutral-300">{cert.issuer}</span>
          </p>
        </div>

        <div style={{ transform: "translateZ(25px)" }} className="flex items-center justify-between border-t border-neutral-200/30 dark:border-neutral-900/40 pt-3">
          <div className="flex flex-col gap-0.5">
            {cert.credentialId ? (
              <>
                <span className="text-[9px] font-mono text-neutral-400 uppercase">ID</span>
                <span className="text-[10px] font-mono text-neutral-600 dark:text-neutral-400 font-medium truncate max-w-[130px]">
                  {cert.credentialId}
                </span>
              </>
            ) : (
              <span className="text-[9px] font-mono text-emerald-500 flex items-center gap-1 font-semibold">
                <ShieldCheck size={11} />
                VERIFIED
              </span>
            )}
          </div>

          <a
            href={cert.verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            Verify
            <ExternalLink size={11} />
          </a>
        </div>
      </GlassCard>
    </motion.div>
  );
}
export default CertificateCard;
