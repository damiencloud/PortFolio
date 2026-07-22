import { useState, useEffect } from "react";

export function checkIsMobile(): boolean {
  if (typeof window === "undefined") return false;
  const hasTouch = window.matchMedia("(pointer: coarse)").matches;
  const isSmallScreen = window.innerWidth < 768;
  return isSmallScreen || hasTouch;
}

export function getDynamicDpr(isMobile?: boolean): number {
  if (typeof window === "undefined") return 1;
  const mobile = isMobile ?? checkIsMobile();
  const rawDpr = window.devicePixelRatio || 1;
  return mobile ? Math.min(rawDpr, 1.5) : Math.min(rawDpr, 2.0);
}

export interface MobileProfile {
  isMobile: boolean;
  maxDpr: number;
  reduceGpuEffects: boolean;
}

export function useMobileProfile(): MobileProfile {
  const [profile, setProfile] = useState<MobileProfile>(() => {
    const mobile = checkIsMobile();
    return {
      isMobile: mobile,
      maxDpr: getDynamicDpr(mobile),
      reduceGpuEffects: mobile,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = checkIsMobile();
      setProfile({
        isMobile: mobile,
        maxDpr: getDynamicDpr(mobile),
        reduceGpuEffects: mobile,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return profile;
}
