"use client";

import React, { useId, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface DotPatternProps {
  width?: number | string;
  height?: number | string;
  x?: number | string;
  y?: number | string;
  cx?: number | string;
  cy?: number | string;
  cr?: number | string;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

export function DotPattern({
  width = 24,
  height = 24,
  x = 0,
  y = 0,
  cx = 1,
  cy = 0.5,
  cr = 0.5,
  className,
  style,
  ...props
}: DotPatternProps) {
  const id = useId();

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-slate-500/50 md:fill-slate-500/70",
        className
      )}
      style={style}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <circle id="pattern-circle" cx={cx} cy={cy} r={cr} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  );
}

export interface InteractiveDotPatternProps {
  isDark?: boolean;
  dotSpacing?: number;
  dotRadius?: number;
  className?: string;
}

export function InteractiveDotPattern({
  isDark = false,
  dotSpacing = 32, // Well-spaced dot grid (32px)
  dotRadius = 1.2,
  className,
}: InteractiveDotPatternProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return;
      containerRef.current.style.setProperty("--mouse-x", `${e.clientX}px`);
      containerRef.current.style.setProperty("--mouse-y", `${e.clientY}px`);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  const baseFrom = isDark ? "#060412" : "#ffffff";
  const baseTo = isDark ? "#281766" : "#63e";

  // Dot colors for light and dark themes
  const baseDotFill = isDark
    ? "rgba(255, 255, 255, 0.12)"
    : "rgba(110, 110, 244, 0.22)";
  const highlightDotFill = isDark
    ? "rgba(165, 180, 252, 0.95)"
    : "#6E6EF4";
  const cursorGlowColor = isDark
    ? "rgba(110, 110, 244, 0.22)"
    : "rgba(110, 110, 244, 0.12)";

  return (
    <div
      ref={containerRef}
      className={cn("fixed inset-0 w-full h-full pointer-events-none", className)}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        background: `radial-gradient(125% 125% at 50% 10%, ${baseFrom} 40%, ${baseTo} 100%)`,
        transition: "background 0.4s ease",
        // Initial spotlight coordinates (center hero area)
        ["--mouse-x" as unknown as string]: "50vw",
        ["--mouse-y" as unknown as string]: "35vh",
      }}
    >
      {/* 1. Base Dotted Pattern - Well-spaced with subtle, light opacity */}
      <DotPattern
        width={dotSpacing}
        height={dotSpacing}
        cx={dotSpacing / 2}
        cy={dotSpacing / 2}
        cr={dotRadius}
        style={{
          fill: baseDotFill,
          opacity: 1,
          transition: "fill 0.3s ease",
        }}
      />

      {/* 2. Interactive Spotlight Dotted Pattern - Opacity increases around cursor */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          maskImage:
            "radial-gradient(340px circle at var(--mouse-x) var(--mouse-y), black 0%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(340px circle at var(--mouse-x) var(--mouse-y), black 0%, transparent 100%)",
        }}
      >
        <DotPattern
          width={dotSpacing}
          height={dotSpacing}
          cx={dotSpacing / 2}
          cy={dotSpacing / 2}
          cr={dotRadius * 1.15}
          style={{
            fill: highlightDotFill,
            opacity: 1,
            transition: "fill 0.3s ease",
          }}
        />
      </div>

      {/* 3. Soft ambient cursor glow spotlight following mouse movement */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          background: `radial-gradient(420px circle at var(--mouse-x) var(--mouse-y), ${cursorGlowColor}, transparent 75%)`,
          transition: "background 0.3s ease",
        }}
      />
    </div>
  );
}

export default DotPattern;
