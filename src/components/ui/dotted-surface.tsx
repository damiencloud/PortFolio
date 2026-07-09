import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface DottedSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export function DottedSurface({
  className,
  children,
  ...props
}: DottedSurfaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    // Grid details for the 3D Points lattice
    const cols = 75;
    const rows = 45;
    const spacingX = 35;
    const spacingY = 28;
    const tilt = 1.05; // Tilted angle for 3D perspective
    const cameraDistance = 750;
    const focalLength = 550;
    const amplitude = 35;
    const speed = 0.025;

    let time = 0;

    const render = () => {
      if (!ctx || !canvas) return;

      // Base background color: light blackish
      ctx.fillStyle = "#0c0c0e";
      ctx.fillRect(0, 0, width, height);

      // Create radial background glow
      const bgGlow = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7
      );
      bgGlow.addColorStop(0, "#191921"); // Light blackish center
      bgGlow.addColorStop(1, "#0a0a0c"); // Slightly darker edges
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      time += speed;

      // Render back-to-front for correct depth drawing order
      for (let r = 0; r < rows; r++) {
        const yNorm = (r - rows / 2) * spacingY;

        for (let c = 0; c < cols; c++) {
          const xNorm = (c - cols / 2) * spacingX;

          // Wave equation: two crossing offset sine waves
          const zNorm = 
            Math.sin(xNorm * 0.009 + time) * 
            Math.cos(yNorm * 0.013 + time * 0.8) * 
            amplitude;

          // 3D rotations on X-axis (tilt)
          const yRot = yNorm * Math.cos(tilt) - zNorm * Math.sin(tilt);
          const zRot = yNorm * Math.sin(tilt) + zNorm * Math.cos(tilt);

          const depth = zRot + cameraDistance;

          if (depth > 10) {
            const scale = focalLength / depth;
            const screenX = xNorm * scale + width / 2;
            const screenY = yRot * scale + height / 2;

            if (screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height) {
              const dotSize = Math.max(0.3, 1.8 * scale);
              // Opacity based on depth scale (dimmer further back, brighter up front)
              const opacity = Math.min(1.0, Math.max(0.08, scale * 0.9));

              ctx.beginPath();
              ctx.arc(screenX, screenY, dotSize, 0, Math.PI * 2);
              // White dots color
              ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
              ctx.fill();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className={cn(
        "relative w-full min-h-screen text-white overflow-hidden bg-[#0a0a0c]",
        className
      )}
      {...props}
    >
      {/* Interactive 3D Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full z-0 block pointer-events-none"
      />

      {/* Light center white glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[65vw] h-[65vw] max-w-[800px] max-h-[800px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.03)_40%,transparent_70%)] blur-[50px] z-0 mix-blend-screen"
      />

      {/* Content wrapper */}
      <div className="relative z-10 size-full">
        {children}
      </div>
    </div>
  );
}

export default DottedSurface;
