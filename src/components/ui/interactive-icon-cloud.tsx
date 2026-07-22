"use client"

import React, { useEffect, useRef, useState, useMemo } from "react"
import { useTheme } from "next-themes"
import { fetchSimpleIcons, renderSimpleIcon, SimpleIcon } from "react-icon-cloud"

// Ensure window type matches TagCanvas globals
declare global {
  interface Window {
    TagCanvas?: any;
  }
}

import { checkIsMobile } from "@/lib/mobile-profile"

export const getCloudOptions = (isMobile: boolean) => ({
  reverse: true,
  depth: 1,
  wheelZoom: false,
  imageScale: isMobile ? 1.5 : 2,
  activeCursor: "default",
  tooltip: "native" as const,
  initial: [0.06, -0.06] as [number, number],
  clickToFront: 500,
  tooltipDelay: 0,
  outlineColour: "#0000",
  maxSpeed: isMobile ? 0.025 : 0.04,
  minSpeed: isMobile ? 0.01 : 0.015,
})

export const renderCustomIcon = (icon: SimpleIcon, theme: string) => {
  const bgHex = theme === "light" ? "#f3f2ef" : "#080510"
  const fallbackHex = theme === "light" ? "#6e6e73" : "#ffffff"
  const minContrastRatio = theme === "dark" ? 2 : 1.2

  return renderSimpleIcon({
    icon,
    bgHex,
    fallbackHex,
    minContrastRatio,
    size: 42,
    aProps: {
      href: undefined,
      target: undefined,
      rel: undefined,
      onClick: (e: any) => e.preventDefault(),
    },
  })
}

export type DynamicCloudProps = {
  iconSlugs: string[]
}

type IconData = Awaited<ReturnType<typeof fetchSimpleIcons>>

// Optimized container that holds the canvas element stably without restarts
const CloudContainer = React.memo(({ children, options }: { children: React.ReactNode; options: any }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasId] = useState(() => `canvas-${Math.random().toString(36).substring(2, 9)}`);
  const [hasStarted, setHasStarted] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);

  // 1. Pause canvas rendering when scrolled off-screen to save CPU/GPU resources
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  // 2. Initialize TagCanvas instance on mount and delete on unmount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !window.TagCanvas) return;

    try {
      window.TagCanvas.Start(canvasId, null, {
        ...options,
        animTiming: "Smooth",     // Target stable 60 FPS pacing via requestAnimationFrame
        outlineMethod: "none",    // Avoid drawing expensive outlines
        imageMode: "image",       // Render image-only to bypass text layout costs
        noSelect: true,           // Avoid selection triggers
        lock: null,
      });
      setHasStarted(true);
    } catch (e) {
      console.error("Failed to start TagCanvas:", e);
    }

    return () => {
      if (window.TagCanvas) {
        try {
          window.TagCanvas.Delete(canvasId);
        } catch (e) {
          console.error("Failed to delete TagCanvas:", e);
        }
      }
    };
  }, [canvasId, options]);

  // 3. Control animation play-state based on visibility
  useEffect(() => {
    if (!hasStarted || !window.TagCanvas) return;

    if (isIntersecting) {
      window.TagCanvas.Resume(canvasId);
    } else {
      window.TagCanvas.Pause(canvasId);
    }
  }, [isIntersecting, hasStarted, canvasId]);

  // 4. Update tags in-place when theme or children change without destroying the canvas
  useEffect(() => {
    let animationFrameId: number;
    if (hasStarted && window.TagCanvas) {
      // Wait for next frame to ensure React has flushed DOM mutations (the <a> and <img> tags inside canvas)
      animationFrameId = requestAnimationFrame(() => {
        if (window.TagCanvas) {
          try {
            window.TagCanvas.Update(canvasId);
          } catch (e) {
            console.error("Failed to update TagCanvas tags:", e);
          }
        }
      });
    }
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [children, hasStarted, canvasId]);

  const isMobile = checkIsMobile();
  const canvasDimension = isMobile ? 400 : 800;

  return (
    <div ref={containerRef} style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", paddingTop: 20 }}>
      <canvas
        ref={canvasRef}
        id={canvasId}
        width={canvasDimension}
        height={canvasDimension}
        style={{
          width: "100%",
          maxWidth: "70vh",
          willChange: "transform",
          transform: "translate3d(0,0,0)",
        }}
      >
        {children}
      </canvas>
    </div>
  );
});

CloudContainer.displayName = "CloudContainer";

// Optimized wrapper using React.memo to completely decouple from parent state updates
export const IconCloud = React.memo(({ iconSlugs }: DynamicCloudProps) => {
  const [data, setData] = useState<IconData | null>(null)
  const { theme } = useTheme()
  const isMobile = checkIsMobile()
  const options = useMemo(() => getCloudOptions(isMobile), [isMobile])

  useEffect(() => {
    fetchSimpleIcons({ slugs: iconSlugs }).then(setData)
  }, [iconSlugs])

  const renderedIcons = useMemo(() => {
    if (!data) return null

    return Object.values(data.simpleIcons).map((icon) =>
      renderCustomIcon(icon, theme || "light")
    )
  }, [data, theme])

  if (!data) return null

  return (
    <CloudContainer options={options}>
      {renderedIcons}
    </CloudContainer>
  )
})

IconCloud.displayName = "IconCloud"
