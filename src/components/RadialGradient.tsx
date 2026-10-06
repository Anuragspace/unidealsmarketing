import React from "react";
import { cn } from "@/lib/utils";

export interface RadialGradientProps {
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
  gradientSize?: string;
  gradientPosition?: string;
  gradientStop?: string;
  isDark?: boolean;
}

export const Component = ({
  className,
  gradientFrom = "#fff",
  gradientTo = "#63e",
  gradientSize = "125% 125%",
  gradientPosition = "50% 10%",
  gradientStop = "40%",
  isDark = false,
}: RadialGradientProps) => {
  const from = isDark ? "#060412" : gradientFrom;
  const to = isDark ? "#281766" : gradientTo;

  return (
    <div
      className={cn(
        "absolute inset-0 w-full h-full -z-10 pointer-events-none",
        isDark ? "bg-[#060412]" : "bg-white",
        className
      )}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        background: `radial-gradient(${gradientSize} at ${gradientPosition}, ${from} ${gradientStop}, ${to} 100%)`,
        transition: "background 0.4s ease",
      }}
    />
  );
};

export const RadialGradient = Component;
export default Component;
