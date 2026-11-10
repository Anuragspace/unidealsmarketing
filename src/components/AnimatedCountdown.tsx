"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type CountdownUnitKey = "days" | "hours" | "minutes" | "seconds";
type CountdownVariant = "modern" | "digital" | "minimal" | "classic";
type CountdownSize = "sm" | "md" | "lg";

type TimeLeft = Record<CountdownUnitKey, number>;

export type AnimatedCountdownProps = {
  targetDate?: Date | string | number;
  variant?: CountdownVariant;
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  unitOrder?: CountdownUnitKey[];
  backgroundColor?: string;
  accentColor?: string;
  className?: string;
  containerClassName?: string;
  unitClassName?: string;
  accentClassName?: string;
  labelClassName?: string;
  numberClassName?: string;
  separator?: React.ReactNode;
  showSeparators?: boolean;
  completionMessage?: string;
  onComplete?: () => void;
  staticMode?: boolean;
  initialStaticTime?: Partial<TimeLeft>;
  compact?: boolean;
  size?: CountdownSize;
  ariaLabel?: string;
  isDark?: boolean;
};

const DEFAULT_STATIC_TIME: TimeLeft = {
  days: 7,
  hours: 12,
  minutes: 7,
  seconds: 24,
};

const UNIT_LABELS: Record<CountdownUnitKey, string> = {
  days: "Days",
  hours: "Hours",
  minutes: "Minutes",
  seconds: "Seconds",
};

function toDateTime(value: AnimatedCountdownProps["targetDate"]) {
  if (!value) return null;
  const time = value instanceof Date ? value.getTime() : new Date(value).getTime();
  return Number.isFinite(time) ? time : null;
}

function getTimeLeft(targetDate?: AnimatedCountdownProps["targetDate"]): TimeLeft {
  const target = toDateTime(targetDate);
  if (!target) return DEFAULT_STATIC_TIME;

  const total = Math.max(0, target - Date.now());
  const secondsTotal = Math.floor(total / 1000);
  const days = Math.floor(secondsTotal / 86400);
  const hours = Math.floor((secondsTotal % 86400) / 3600);
  const minutes = Math.floor((secondsTotal % 3600) / 60);
  const seconds = secondsTotal % 60;

  return { days, hours, minutes, seconds };
}

function isFinished(time: TimeLeft) {
  return time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0;
}

function format(value: number) {
  return String(Math.max(0, value)).padStart(2, "0");
}

function useVisibleUnits({
  showDays,
  showHours,
  showMinutes,
  showSeconds,
  unitOrder,
}: Required<Pick<AnimatedCountdownProps, "showDays" | "showHours" | "showMinutes" | "showSeconds" | "unitOrder">>) {
  return React.useMemo(() => {
    const enabled = {
      days: showDays,
      hours: showHours,
      minutes: showMinutes,
      seconds: showSeconds,
    };
    return unitOrder.filter((unit) => enabled[unit]);
  }, [showDays, showHours, showMinutes, showSeconds, unitOrder]);
}

function CountdownNumber({
  value,
  className,
  isDark,
}: {
  value: string;
  className?: string;
  isDark?: boolean;
}) {
  const reduceMotion = useReducedMotion() === true;

  return (
    <span
      className={cn("relative inline-grid min-w-[2ch] place-items-center tabular-nums", className)}
      style={{
        position: "relative",
        display: "inline-grid",
        placeItems: "center",
        fontVariantNumeric: "tabular-nums",
        minHeight: "1.3em",
        padding: "1px 0",
        overflow: "visible",
      }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          initial={reduceMotion ? false : { y: 10, opacity: 0, filter: "blur(3px)" }}
          animate={reduceMotion ? { opacity: 1 } : { y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={reduceMotion ? { opacity: 0 } : { y: -10, opacity: 0, filter: "blur(3px)" }}
          transition={{ duration: reduceMotion ? 0.05 : 0.16, ease: "easeOut" }}
          className="unideals-countdown-num"
          style={{
            color: isDark ? "#ffffff" : "#0f0728",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: 1.15,
            fontFamily: "'Figtree', sans-serif",
          }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function CountdownUnit({
  unit,
  value,
  isDark,
  index,
}: {
  unit: CountdownUnitKey;
  value: number;
  isDark?: boolean;
  index: number;
}) {
  const reduceMotion = useReducedMotion() === true;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: reduceMotion ? 0 : index * 0.05, duration: 0.35, ease: "easeOut" }}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      className="unideals-unit-card"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "20px",
        background: isDark
          ? "rgba(255, 255, 255, 0.035)"
          : "linear-gradient(180deg, #ffffff 0%, #fafafc 100%)",
        border: isDark
          ? "1px solid rgba(255, 255, 255, 0.08)"
          : "1px solid rgba(16, 7, 43, 0.07)",
        boxShadow: isDark
          ? "0 4px 18px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)"
          : "0 4px 14px rgba(16, 7, 43, 0.04), inset 0 1px 0 #ffffff",
        overflow: "hidden",
        userSelect: "none",
        transition: "all 0.25s ease",
      }}
    >
      {/* Top subtle highlight specular line (brand blue accent) */}
      <span
        style={{
          pointerEvents: "none",
          position: "absolute",
          top: 0,
          left: "14%",
          right: "14%",
          height: "2px",
          background: isDark
            ? "linear-gradient(90deg, transparent, rgba(56, 56, 236, 0.6), transparent)"
            : "linear-gradient(90deg, transparent, rgba(56, 56, 236, 0.4), transparent)",
          borderRadius: "9999px",
        }}
      />

      {/* Number with blur + move up animation */}
      <CountdownNumber value={format(value)} isDark={isDark} />

      {/* Label: Days, Hours, Minutes, Seconds with reduced weight */}
      <span
        className="unideals-countdown-lbl"
        style={{
          marginTop: "6px",
          fontWeight: 500,
          letterSpacing: "0.01em",
          color: isDark ? "rgba(255, 255, 255, 0.6)" : "#828096",
          fontFamily: "'Figtree', sans-serif",
          lineHeight: 1,
        }}
      >
        {UNIT_LABELS[unit]}
      </span>
    </motion.div>
  );
}

export function AnimatedCountdown({
  targetDate,
  showDays = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
  unitOrder = ["days", "hours", "minutes", "seconds"],
  className,
  completionMessage = "We're live!",
  onComplete,
  staticMode,
  initialStaticTime,
  ariaLabel = "Countdown timer",
  isDark = false,
}: AnimatedCountdownProps) {
  const reduceMotion = useReducedMotion() === true;
  const isStatic = staticMode ?? false;
  const completedRef = React.useRef(false);

  // Default target date: 7 days, 12 hours, 7 mins, 24 secs ahead
  const defaultTarget = React.useMemo(() => {
    if (targetDate) return targetDate;
    const d = new Date();
    d.setDate(d.getDate() + 7);
    d.setHours(d.getHours() + 12);
    d.setMinutes(d.getMinutes() + 7);
    d.setSeconds(d.getSeconds() + 24);
    return d;
  }, [targetDate]);

  const staticTime = React.useMemo<TimeLeft>(
    () => ({ ...DEFAULT_STATIC_TIME, ...initialStaticTime }),
    [initialStaticTime]
  );

  const [timeLeft, setTimeLeft] = React.useState<TimeLeft>(
    getTimeLeft(defaultTarget)
  );
  const mountedRef = React.useRef(false);
  const visibleUnits = useVisibleUnits({
    showDays,
    showHours,
    showMinutes,
    showSeconds,
    unitOrder,
  });

  const displayTimeLeft = isStatic ? staticTime : timeLeft;
  const completed = !isStatic && isFinished(displayTimeLeft);

  React.useEffect(() => {
    mountedRef.current = true;
    if (isStatic) return;

    const interval = window.setInterval(() => {
      setTimeLeft(getTimeLeft(defaultTarget));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isStatic, defaultTarget]);

  React.useEffect(() => {
    if (!mountedRef.current) return;
    if (!isStatic && isFinished(displayTimeLeft) && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  }, [isStatic, displayTimeLeft, onComplete]);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      aria-label={ariaLabel}
      className={cn("unideals-countdown-box", className)}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: "28px",
        background: isDark
          ? "rgba(24, 24, 27, 0.72)"
          : "rgba(255, 255, 255, 0.8)",
        border: isDark
          ? "1px solid rgba(255, 255, 255, 0.08)"
          : "1px solid rgba(16, 7, 43, 0.08)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: isDark
          ? "0 20px 48px -12px rgba(0, 0, 0, 0.7), 0 1px 0 rgba(255, 255, 255, 0.06)"
          : "0 24px 48px -16px rgba(16, 7, 43, 0.09), 0 4px 12px rgba(56, 56, 236, 0.08)",
        transition: "all 0.3s ease",
      }}
    >
      <style>{`
        .unideals-countdown-box {
          padding: 12px;
          border-radius: 28px;
        }
        .unideals-countdown-grid {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: nowrap;
        }
        .unideals-unit-card {
          width: 88px;
          height: 96px;
          min-width: 88px;
          max-width: 88px;
          flex: 0 0 88px;
          padding: 16px 8px 12px 8px;
          border-radius: 20px !important;
        }
        .unideals-countdown-num {
          font-size: 2.15rem;
        }
        .unideals-countdown-lbl {
          font-size: 0.72rem;
          margin-top: 6px;
        }
        @media (max-width: 520px) {
          .unideals-countdown-box {
            padding: 8px !important;
            border-radius: 22px !important;
            max-width: calc(100vw - 32px) !important;
          }
          .unideals-countdown-grid {
            gap: 6px !important;
          }
          .unideals-unit-card {
            width: auto !important;
            min-width: 64px !important;
            max-width: 82px !important;
            flex: 1 1 0 !important;
            height: 78px !important;
            padding: 10px 4px 8px 4px !important;
            border-radius: 16px !important;
          }
          .unideals-countdown-num {
            font-size: 1.55rem !important;
          }
          .unideals-countdown-lbl {
            font-size: 0.62rem !important;
            margin-top: 3px !important;
          }
        }
        @media (max-width: 360px) {
          .unideals-countdown-grid {
            gap: 4px !important;
          }
          .unideals-unit-card {
            min-width: 58px !important;
            height: 70px !important;
            padding: 8px 2px 6px 2px !important;
            border-radius: 14px !important;
          }
          .unideals-countdown-num {
            font-size: 1.38rem !important;
          }
          .unideals-countdown-lbl {
            font-size: 0.56rem !important;
          }
        }
      `}</style>
      <div
        className="unideals-countdown-grid"
      >
        {visibleUnits.map((unit, index) => (
          <CountdownUnit
            key={unit}
            unit={unit}
            value={displayTimeLeft[unit]}
            isDark={isDark}
            index={index}
          />
        ))}
      </div>

      <AnimatePresence>
        {completed && completionMessage && (
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            style={{
              marginTop: "12px",
              fontSize: "0.88rem",
              fontWeight: 700,
              color: "#3838EC",
            }}
          >
            {completionMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default AnimatedCountdown;
