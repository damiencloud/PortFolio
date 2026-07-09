import React, { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface ShimmerButtonProps extends React.HTMLAttributes<HTMLElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  href?: string;
  target?: string;
  rel?: string;
  download?: any;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const ShimmerButton = React.forwardRef<HTMLElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background = "rgba(0, 0, 0, 1)",
      className,
      children,
      href,
      disabled,
      type,
      ...props
    },
    ref
  ) => {
    const styles = {
      "--spread": "90deg",
      "--shimmer-color": shimmerColor,
      "--radius": borderRadius,
      "--speed": shimmerDuration,
      "--cut": shimmerSize,
      "--bg": background,
    } as CSSProperties;

    const classes = cn(
      "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3 [background:var(--bg)] [border-radius:var(--radius)]",
      !className?.includes("text-") && "text-white",
      "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
      disabled && "opacity-60 cursor-not-allowed pointer-events-none",
      className
    );

    const content = (
      <>
        {/* spark container */}
        <div
          className={cn(
            "-z-30 blur-[2px]",
            "absolute inset-0 overflow-visible [container-type:size]"
          )}
        >
          {/* spark */}
          <div className="absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
            {/* spark before */}
            <div className="animate-spin-around absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
          </div>
        </div>
        {children}

        {/* Highlight */}
        <div
          className={cn(
            "insert-0 absolute size-full",
            "rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]",
            // transition
            "transform-gpu transition-all duration-300 ease-in-out",
            // on hover
            "group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]",
            // on click
            "group-active:shadow-[inset_0_-10px_10px_#ffffff3f]"
          )}
        />

        {/* backdrop */}
        <div
          className={cn(
            "absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]"
          )}
        />
      </>
    );

    if (href) {
      return (
        <a
          href={href}
          style={styles}
          className={classes}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        type={type}
        disabled={disabled}
        style={styles}
        className={classes}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";

export { ShimmerButton };
