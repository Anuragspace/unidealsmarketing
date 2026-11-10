"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { DotPattern } from "./DotPattern";

export interface GlossyBrandBackgroundProps {
  isDark?: boolean;
}

export default function GlossyBrandBackground({
  isDark = false,
}: GlossyBrandBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return;
      // Calculate normalized mouse positions (-1 to 1) for subtle parallax
      const xNorm = (e.clientX / window.innerWidth - 0.5) * 2;
      const yNorm = (e.clientY / window.innerHeight - 0.5) * 2;

      containerRef.current.style.setProperty("--mouse-x", `${e.clientX}px`);
      containerRef.current.style.setProperty("--mouse-y", `${e.clientY}px`);
      containerRef.current.style.setProperty("--parallax-x", `${xNorm * 12}px`);
      containerRef.current.style.setProperty("--parallax-y", `${yNorm * 12}px`);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  // Background colors - neutral darkest grey theme
  const bgColor = isDark ? "#09090b" : "#ffffff";
  const ambientGlowColor = isDark
    ? "rgba(255, 255, 255, 0.04)"
    : "rgba(56, 56, 236, 0.08)";

  // Dot colors
  const baseDotFill = isDark
    ? "rgba(255, 255, 255, 0.08)"
    : "rgba(56, 56, 236, 0.16)";
  const highlightDotFill = isDark
    ? "rgba(255, 255, 255, 0.65)"
    : "#3838EC";

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        backgroundColor: bgColor,
        overflow: "hidden",
        transition: "background-color 0.4s ease",
        // CSS custom properties for interactive mouse spotlight
        ["--mouse-x" as unknown as string]: "50vw",
        ["--mouse-y" as unknown as string]: "40vh",
        ["--parallax-x" as unknown as string]: "0px",
        ["--parallax-y" as unknown as string]: "0px",
      }}
    >
      <style>{`
        .unideals-bg-logo-left {
          position: absolute;
          top: 45%;
          left: clamp(-160px, -10vw, -100px);
          width: clamp(260px, 30vw, 420px);
          height: clamp(260px, 30vw, 420px);
          transform: translate(calc(var(--parallax-x) * -0.5), calc(-50% + var(--parallax-y) * -0.5));
          transition: transform 0.2s ease-out, opacity 0.3s ease;
          pointer-events: none;
        }
        .unideals-bg-logo-right {
          position: absolute;
          bottom: -90px;
          right: -80px;
          width: clamp(240px, 28vw, 400px);
          height: clamp(240px, 28vw, 400px);
          transform: translate(calc(var(--parallax-x) * 0.6), calc(var(--parallax-y) * 0.6));
          transition: transform 0.2s ease-out, opacity 0.3s ease;
          pointer-events: none;
        }

        @media (max-width: 640px) {
          .unideals-bg-logo-left {
            top: 25% !important;
            left: -35px !important;
            width: 195px !important;
            height: 195px !important;
            opacity: 0.9 !important;
          }
          .unideals-bg-logo-right {
            bottom: -45px !important;
            right: -40px !important;
            width: 180px !important;
            height: 180px !important;
            opacity: 0.88 !important;
          }
        }
      `}</style>

      {/* 1. Subtle, Clean Ambient Gradient (Charcoal Neutral Darkest Grey) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isDark
            ? "radial-gradient(120% 90% at 50% 0%, #18181b 0%, #111114 45%, #09090b 100%)"
            : "radial-gradient(120% 100% at 50% 0%, #ffffff 50%, #f6f7ff 100%)",
          transition: "background 0.4s ease",
        }}
      />

      {/* 2. Interactive Well-Spaced Dot Grid (36px spacing) */}
      <DotPattern
        width={36}
        height={36}
        cx={18}
        cy={18}
        cr={1.1}
        style={{
          fill: baseDotFill,
          opacity: 1,
          transition: "fill 0.3s ease",
        }}
      />

      {/* Mouse Spotlight on Dots (Increases opacity where cursor hovers) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          maskImage:
            "radial-gradient(320px circle at var(--mouse-x) var(--mouse-y), black 0%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(320px circle at var(--mouse-x) var(--mouse-y), black 0%, transparent 100%)",
        }}
      >
        <DotPattern
          width={36}
          height={36}
          cx={18}
          cy={18}
          cr={1.3}
          style={{
            fill: highlightDotFill,
            opacity: 1,
            transition: "fill 0.3s ease",
          }}
        />
      </div>

      {/* Cursor Ambient Glow Spotlight */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), ${ambientGlowColor}, transparent 75%)`,
          transition: "background 0.3s ease",
        }}
      />

      {/* 3. MIDDLE-LEFT 3D GLOSSY LOGO */}
      <div className="unideals-bg-logo-left">
        {/* The 3D Glossy Tag Logo with crisp natural physical shadow (no artificial AI bloom) */}
        <Image
          src="/logo-glossy-3d.png"
          alt=""
          width={440}
          height={432}
          priority
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            transform: "rotate(-18deg)",
            filter: isDark
              ? "drop-shadow(0 18px 36px rgba(0, 0, 0, 0.55))"
              : "drop-shadow(0 14px 28px rgba(0, 0, 0, 0.06))",
            opacity: 0.95,
          }}
        />
      </div>

      {/* 4. BOTTOM-RIGHT 3D GLOSSY LOGO TAG */}
      <div className="unideals-bg-logo-right">
        {/* The 3D Glossy Tag Logo with crisp natural physical shadow */}
        <Image
          src="/logo-glossy-3d.png"
          alt=""
          width={400}
          height={393}
          priority
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            transform: "rotate(15deg)",
            filter: isDark
              ? "drop-shadow(0 -14px 32px rgba(0, 0, 0, 0.5))"
              : "drop-shadow(0 -12px 24px rgba(0, 0, 0, 0.05))",
            opacity: 0.92,
          }}
        />
      </div>
    </div>
  );
}
