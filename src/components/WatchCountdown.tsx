"use client";

import React, { useState, useEffect, useRef } from "react";
import { WatchIcon, type WatchIconHandle } from "@animateicons/react/lucide";

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function WatchCountdown({ isDark }: { isDark: boolean }) {
  const watchRef = useRef<WatchIconHandle | null>(null);

  // Target launch date (e.g. 14 days from now)
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    days: 14,
    hours: 8,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    // Launch date set to 14 days ahead
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 14);
    targetDate.setHours(targetDate.getHours() + 8);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Continuously pulse the watch animation
  useEffect(() => {
    watchRef.current?.startAnimation();
    const interval = setInterval(() => {
      watchRef.current?.startAnimation();
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (n: number) => n.toString().padStart(2, "0");

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "14px",
        padding: "8px 18px 8px 12px",
        borderRadius: "9999px",
        background: isDark
          ? "rgba(56, 56, 236, 0.12)"
          : "rgba(56, 56, 236, 0.06)",
        border: isDark
          ? "1px solid rgba(56, 56, 236, 0.35)"
          : "1px solid rgba(56, 56, 236, 0.18)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: isDark
          ? "0 0 24px rgba(56, 56, 236, 0.25)"
          : "0 4px 18px rgba(56, 56, 236, 0.08)",
        marginBottom: "36px",
        userSelect: "none",
        transition: "all 0.3s ease",
      }}
    >
      {/* Animated Watch Icon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: isDark ? "rgba(56, 56, 236, 0.25)" : "#3838EC",
          color: "#ffffff",
          boxShadow: "0 0 14px rgba(56, 56, 236, 0.5)",
          flexShrink: 0,
        }}
      >
        <WatchIcon
          ref={watchRef}
          size={22}
          duration={1}
          color="#ffffff"
          isAnimated={true}
        />
      </div>

      {/* Countdown Digits */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontFamily: "'Figtree', sans-serif",
        }}
      >
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 800,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: isDark ? "rgba(255, 255, 255, 0.6)" : "#5a5874",
            marginRight: "4px",
          }}
        >
          Launch in
        </span>

        {/* Days */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
          <span
            style={{
              fontSize: "1.05rem",
              fontWeight: 800,
              color: isDark ? "#ffffff" : "#10072B",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatNumber(timeLeft.days)}
          </span>
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              color: "#3838EC",
            }}
          >
            d
          </span>
        </div>

        <span style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(16,7,43,0.25)", fontWeight: 700 }}>:</span>

        {/* Hours */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
          <span
            style={{
              fontSize: "1.05rem",
              fontWeight: 800,
              color: isDark ? "#ffffff" : "#10072B",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatNumber(timeLeft.hours)}
          </span>
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              color: "#3838EC",
            }}
          >
            h
          </span>
        </div>

        <span style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(16,7,43,0.25)", fontWeight: 700 }}>:</span>

        {/* Minutes */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
          <span
            style={{
              fontSize: "1.05rem",
              fontWeight: 800,
              color: isDark ? "#ffffff" : "#10072B",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatNumber(timeLeft.minutes)}
          </span>
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              color: "#3838EC",
            }}
          >
            m
          </span>
        </div>

        <span style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(16,7,43,0.25)", fontWeight: 700 }}>:</span>

        {/* Seconds */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
          <span
            style={{
              fontSize: "1.05rem",
              fontWeight: 800,
              color: isDark ? "#ffffff" : "#10072B",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatNumber(timeLeft.seconds)}
          </span>
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              color: "#3838EC",
            }}
          >
            s
          </span>
        </div>
      </div>
    </div>
  );
}
