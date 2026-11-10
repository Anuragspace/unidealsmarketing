"use client";

import React, { useRef, useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  UserRoundIcon,
  PackageIcon,
  SearchIcon,
  TagIcon,
  ShoppingBagIcon,
  BikeIcon,
  BadgeDollarSignIcon,
  WatchIcon,
} from "@animateicons/react/lucide";
import type { IconHandle } from "@animateicons/react";
import { InteractiveDotPattern } from "./DotPattern";
import AnimatedCountdown from "./AnimatedCountdown";
import SubscribeBox from "./SubscribeBox";

// ── Design Tokens ─────────────────────────────────────────────────────────────
const ICON_COLOR = "#6E6EF4";
const TEXT_COLOR = "#10072B";

// ── Timing Configuration ──────────────────────────────────────────────────────
const STAGGER_INTERVAL = 1000; // 1s between consecutive icon arrivals
const HOLD_DURATION    = 2500; // 2.5s hold duration per icon
const CYCLE_PAUSE      = 2200; // pause at end of cycle before restarting
const INITIAL_PAUSE    = 1000; // initial settle pause

// Spring curve for smooth expansion and convergence
const EXPAND_SPRING = {
  type: "spring" as const,
  stiffness: 420,
  damping: 30,
  mass: 0.8,
};

// Pop spring for icon entry/exit
const POP_SPRING = {
  type: "spring" as const,
  stiffness: 460,
  damping: 28,
  mass: 0.75,
};

type IconType =
  | "person"
  | "product"
  | "search"
  | "deal"
  | "shoppingBag"
  | "bike"
  | "badgeDollar"
  | "watch";

interface AnimatedSlotConfig {
  id: number;
  before: string;
  letter: string;
  after: string;
  icon: IconType;
  expandAmount: string;
}

// 9 slots across the exact 2-line slogan:
// Line 1: You have something to sell.
//         - 'o' in You       → UserRoundIcon (person)
//         - 'a' in have      → WatchIcon (watch)
//         - 'o' in something → BikeIcon (bike)
//         - 'o' in to        → ShoppingBagIcon (shopping bag)
//         - 'e' in sell.     → TagIcon (deal)
// Line 2: Someone's looking for it.
//         - 'o' in Someone's → UserRoundIcon (person)
//         - 'o' in looking   → SearchIcon (search)
//         - 'o' in for       → BadgeDollarSignIcon (dollar badge)
//         - 'i' in it.       → PackageIcon (product box)
const SLOTS: AnimatedSlotConfig[] = [
  // Line 1
  { id: 0, before: "Y", letter: "o", after: "u",        icon: "person",      expandAmount: "0.12em" },
  { id: 1, before: "h", letter: "a", after: "ve",       icon: "watch",       expandAmount: "0.14em" },
  { id: 2, before: "s", letter: "o", after: "mething",  icon: "bike",        expandAmount: "0.18em" },
  { id: 3, before: "t", letter: "o", after: "",         icon: "shoppingBag", expandAmount: "0.14em" },
  { id: 4, before: "s", letter: "e", after: "ll.",      icon: "deal",        expandAmount: "0.12em" },

  // Line 2
  { id: 5, before: "S", letter: "o", after: "meone\u2019s", icon: "person",  expandAmount: "0.12em" },
  { id: 6, before: "l", letter: "o", after: "oking",    icon: "search",      expandAmount: "0.13em" },
  { id: 7, before: "f", letter: "o", after: "r",        icon: "badgeDollar", expandAmount: "0.14em" },
  { id: 8, before: "",  letter: "i", after: "t.",       icon: "product",     expandAmount: "0.22em" },
];

function IconRenderer({
  type,
  iconRef,
}: {
  type: IconType;
  iconRef: React.RefObject<IconHandle | null>;
}) {
  const common = {
    color: ICON_COLOR,
    size: 42,
    duration: 1,
    isAnimated: true,
    ref: iconRef,
  };

  switch (type) {
    case "person":
      return <UserRoundIcon {...common} />;
    case "watch":
      return <WatchIcon {...common} />;
    case "shoppingBag":
      return <ShoppingBagIcon {...common} />;
    case "bike":
      return <BikeIcon {...common} />;
    case "product":
      return <PackageIcon {...common} />;
    case "search":
      return <SearchIcon {...common} />;
    case "deal":
      return <TagIcon {...common} />;
    case "badgeDollar":
      return <BadgeDollarSignIcon {...common} />;
  }
}

// ── Interactive Word Component with Expand & Converge Motion ──────────────────
function AnimatedWord({
  config,
  isActive,
  onTrigger,
  reducedMotion,
}: {
  config: AnimatedSlotConfig;
  isActive: boolean;
  onTrigger: () => void;
  reducedMotion: boolean;
}) {
  const iconRef = useRef<IconHandle | null>(null);
  const showIcon = !reducedMotion && isActive;

  useEffect(() => {
    if (showIcon) {
      const t = setTimeout(() => {
        iconRef.current?.startAnimation();
      }, 50);
      return () => clearTimeout(t);
    } else {
      iconRef.current?.stopAnimation();
    }
  }, [showIcon]);

  return (
    <span
      onMouseEnter={onTrigger}
      onClick={onTrigger}
      style={{
        position: "relative",
        display: "inline-block",
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {config.before && <span>{config.before}</span>}

      <motion.span
        layout
        transition={EXPAND_SPRING}
        animate={{
          paddingLeft: showIcon ? config.expandAmount : "0em",
          paddingRight: showIcon ? config.expandAmount : "0em",
        }}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          verticalAlign: "baseline",
        }}
      >
        <span
          aria-hidden={showIcon}
          style={{
            opacity: showIcon ? 0 : 1,
            transition: "opacity 0.16s ease",
            display: "inline-block",
            userSelect: "none",
          }}
        >
          {config.letter}
        </span>

        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <AnimatePresence>
            {showIcon && (
              <motion.span
                key={`icon-${config.id}`}
                initial={{ opacity: 0, scale: 0.25 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.25 }}
                transition={POP_SPRING}
                className="unideals-icon-box"
              >
                <IconRenderer type={config.icon} iconRef={iconRef} />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </motion.span>

      {config.after && <span>{config.after}</span>}
    </span>
  );
}

// ── Main Unideals Hero ────────────────────────────────────────────────────────
export default function UnidealsHero() {
  const [activeSlotIds, setActiveSlotIds] = useState<Set<number>>(new Set());
  const [isDark, setIsDark] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const slotTimersRef = useRef<{ [key: number]: ReturnType<typeof setTimeout> }>({});
  const loopTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isPausedRef = useRef(false);

  const triggerSlot = useCallback((slotId: number, duration = HOLD_DURATION) => {
    if (reducedMotion) return;

    if (slotTimersRef.current[slotId]) {
      clearTimeout(slotTimersRef.current[slotId]);
    }

    setActiveSlotIds((prev) => new Set([...prev, slotId]));

    slotTimersRef.current[slotId] = setTimeout(() => {
      setActiveSlotIds((prev) => {
        const next = new Set(prev);
        next.delete(slotId);
        return next;
      });
      delete slotTimersRef.current[slotId];
    }, duration);
  }, [reducedMotion]);

  const clearCycleTimers = useCallback(() => {
    loopTimersRef.current.forEach(clearTimeout);
    loopTimersRef.current = [];
  }, []);

  const startCycleRef = useRef<() => void>(() => {});

  const startCycle = useCallback(() => {
    if (reducedMotion || isPausedRef.current) return;

    clearCycleTimers();

    let maxEndTime = 0;

    SLOTS.forEach((slot, index) => {
      const startTime = index * STAGGER_INTERVAL;
      const endTime   = startTime + HOLD_DURATION;
      maxEndTime      = Math.max(maxEndTime, endTime);

      const t = setTimeout(() => {
        if (!isPausedRef.current) {
          triggerSlot(slot.id, HOLD_DURATION);
        }
      }, startTime);
      loopTimersRef.current.push(t);
    });

    const endTimer = setTimeout(() => {
      const nextCycleTimer = setTimeout(() => {
        startCycleRef.current();
      }, CYCLE_PAUSE);
      loopTimersRef.current.push(nextCycleTimer);
    }, maxEndTime + 100);

    loopTimersRef.current.push(endTimer);
  }, [clearCycleTimers, triggerSlot, reducedMotion]);

  useEffect(() => {
    startCycleRef.current = startCycle;
  }, [startCycle]);

  useEffect(() => {
    if (reducedMotion) return;
    const initTimer = setTimeout(() => {
      startCycleRef.current();
    }, INITIAL_PAUSE);
    loopTimersRef.current.push(initTimer);

    const slotTimers = slotTimersRef.current;
    return () => {
      clearCycleTimers();
      Object.values(slotTimers).forEach(clearTimeout);
    };
  }, [clearCycleTimers, reducedMotion]);

  const handleWordHover = useCallback((slotId: number) => {
    triggerSlot(slotId, HOLD_DURATION);

    isPausedRef.current = true;
    clearCycleTimers();

    const resumeTimer = setTimeout(() => {
      isPausedRef.current = false;
      startCycle();
    }, HOLD_DURATION + 800);
    loopTimersRef.current.push(resumeTimer);
  }, [triggerSlot, clearCycleTimers, startCycle]);

  const renderSlot = (id: number) => {
    const config = SLOTS[id];
    return (
      <AnimatedWord
        key={`slot-${config.id}`}
        config={config}
        isActive={activeSlotIds.has(config.id)}
        onTrigger={() => handleWordHover(config.id)}
        reducedMotion={reducedMotion}
      />
    );
  };

  const textColor = isDark ? "#ffffff" : TEXT_COLOR;

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100vw",
        overflowX: "hidden",
        transition: "background 0.4s ease",
      }}
    >
      {/* Interactive Well-Spaced Dot Pattern with Mouse Cursor Interaction */}
      <InteractiveDotPattern isDark={isDark} dotSpacing={32} dotRadius={1.2} />

      {/* TOP NAVIGATION: Transparent Header, Logo (Left), and Theme Switch (Right) */}
      <header
        className="unideals-header"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "transparent",
        }}
      >
        {/* Unideals Logo (Top Left) */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "#6E6EF4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 16px rgba(110, 110, 244, 0.45)",
            }}
          >
            <span
              style={{
                color: "#ffffff",
                fontWeight: 900,
                fontSize: "1.2rem",
                fontFamily: "'Figtree', sans-serif",
                lineHeight: 1,
              }}
            >
              U
            </span>
          </div>
          <span
            style={{
              fontFamily: "'Figtree', sans-serif",
              fontWeight: 800,
              fontSize: "1.25rem",
              letterSpacing: "-0.03em",
              color: textColor,
            }}
          >
            unideals
          </span>
        </div>

        {/* Light / Dark Mode Toggle (Top Right) */}
        <button
          onClick={() => setIsDark(!isDark)}
          aria-label="Toggle light and dark mode"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "9999px",
            background: isDark
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(16, 7, 43, 0.05)",
            border: isDark
              ? "1px solid rgba(255, 255, 255, 0.16)"
              : "1px solid rgba(16, 7, 43, 0.12)",
            color: textColor,
            cursor: "pointer",
            outline: "none",
            fontSize: "0.82rem",
            fontWeight: 700,
            fontFamily: "'Figtree', sans-serif",
            transition: "all 0.25s ease",
          }}
        >
          {isDark ? (
            <>
              {/* Sun icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" /><path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" /><path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
              </svg>
              <span>Light</span>
            </>
          ) : (
            <>
              {/* Moon icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
              <span>Dark</span>
            </>
          )}
        </button>
      </header>

      {/* MAIN HERO CONTENT */}
      <main
        className="unideals-main"
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
        }}
      >
        <style>{`
          .unideals-header {
            padding: 20px 32px;
          }
          .unideals-main {
            padding: 100px 24px 60px 24px;
          }
          .unideals-icon-box {
            width: 0.74em;
            height: 0.74em;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .unideals-icon-box > div {
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .unideals-icon-box svg {
            width: 100% !important;
            height: 100% !important;
            display: block !important;
          }
          .unideals-line {
            display: block;
            white-space: nowrap;
          }
          .unideals-phrase {
            display: inline;
          }
          .unideals-space {
            display: inline;
          }
          .unideals-timer-wrap {
            margin-bottom: 36px;
          }
          .unideals-launch-text {
            font-size: 0.86rem;
            margin-bottom: 14px;
          }
          @media (max-width: 640px) {
            .unideals-header {
              padding: 14px 18px !important;
            }
            .unideals-main {
              min-height: 100vh !important;
              min-height: 100dvh !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              justify-content: center !important;
              padding: 84px 18px 48px 18px !important;
              box-sizing: border-box !important;
            }
            .unideals-heading {
              font-size: clamp(2.15rem, 8.8vw, 3.0rem) !important;
              line-height: 1.15 !important;
              letter-spacing: -0.04em !important;
              margin: 0 0 clamp(28px, 4.5vh, 36px) 0 !important;
            }
            .unideals-line {
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              white-space: normal !important;
              gap: 0.08em !important;
            }
            .unideals-line-2 {
              margin-top: 0.22em !important;
            }
            .unideals-phrase {
              display: inline-block !important;
              white-space: nowrap !important;
            }
            .unideals-space {
              display: none !important;
            }
            .unideals-timer-wrap {
              margin: 0 0 clamp(28px, 4.5vh, 36px) 0 !important;
              padding: 0 !important;
              width: 100% !important;
            }
            .unideals-launch-text {
              font-size: 0.78rem !important;
              margin-bottom: 12px !important;
            }
            .unideals-sub-wrap {
              margin-top: 0 !important;
              margin-bottom: 0 !important;
              width: 100% !important;
            }
          }
        `}</style>

        {/* 1. TOP TEXT: The 2-line slogan with interactive letters */}
        <h1
          className="unideals-heading"
          aria-label="You have something to sell. Someone's looking for it."
          style={{
            fontFamily: "'Figtree', -apple-system, BlinkMacSystemFont, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2.0rem, 5vw, 4.2rem)",
            lineHeight: 1.25,
            letterSpacing: "-0.038em",
            color: textColor,
            textAlign: "center",
            maxWidth: "1150px",
            margin: "0 0 36px 0",
            transition: "color 0.3s ease",
          }}
        >
          {/* Line 1: You have something to sell. */}
          <span className="unideals-line unideals-line-1">
            <span className="unideals-phrase">{renderSlot(0)} <span> </span>{renderSlot(1)}</span>
            <span className="unideals-space"> </span>
            <span className="unideals-phrase">{renderSlot(2)} <span> </span>{renderSlot(3)} <span> </span>{renderSlot(4)}</span>
          </span>

          {/* Line 2: Someone's looking for it. */}
          <span className="unideals-line unideals-line-2">
            <span className="unideals-phrase">{renderSlot(5)}</span>
            <span className="unideals-space"> </span>
            <span className="unideals-phrase">{renderSlot(6)} <span> </span>{renderSlot(7)} <span> </span>{renderSlot(8)}</span>
          </span>
        </h1>

        {/* 2. MIDDLE TIMER: Simple text (no tag pill) + 4 equal tiles */}
        <div
          className="unideals-timer-wrap"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Simple clean text in Figtree font (no pill/tag background) */}
          <div
            className="unideals-launch-text"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <WatchIcon
              size={15}
              duration={1}
              color={isDark ? "#ffffff" : "#6E6EF4"}
              isAnimated={true}
            />
            <span
              style={{
                fontFamily: "'Figtree', sans-serif",
                fontWeight: 600,
                letterSpacing: "0.04em",
                color: isDark ? "rgba(255, 255, 255, 0.72)" : "#565275",
              }}
            >
              Campus Launch In
            </span>
          </div>

          {/* Polished 4-tile Animated Countdown with equal tile widths */}
          <AnimatedCountdown isDark={isDark} />
        </div>

        {/* 3. EMAIL SUBSCRIBE BOX: below timer */}
        <SubscribeBox isDark={isDark} />
      </main>
    </div>
  );
}

// ── Prefers-reduced-motion hook ───────────────────────────────────────────────
function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => {
      if (typeof window === "undefined") return false;
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    },
    () => false
  );
}
