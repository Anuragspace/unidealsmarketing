"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SOCIAL_LINKS = [
  {
    name: "Instagram",
    href: "https://instagram.com/unideals",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    name: "Discord",
    href: "https://discord.gg/unideals",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com/unideals",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/unideals",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
      </svg>
    ),
  },
];

export default function SubscribeBox({ isDark }: { isDark: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setErrorMessage("Please enter a valid university email address.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      setEmail("");
    } catch (err: unknown) {
      const error = err as Error;
      setStatus("error");
      setErrorMessage(error.message || "Could not join waitlist. Please try again.");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setErrorMessage("");
  };

  return (
    <div
      className="unideals-sub-wrap"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        userSelect: "none",
      }}
    >
      <style>{`
        .unideals-sub-wrap {
          margin-top: 36px;
          max-width: 520px;
          width: 100%;
        }
        .unideals-sub-form {
          min-height: 56px;
          padding: 6px;
        }
        .unideals-sub-btn {
          padding: 12px 24px;
          font-size: 0.92rem;
        }
        .unideals-social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          text-decoration: none;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .unideals-social-btn:hover {
          transform: translateY(-2px);
          background-color: #3838EC !important;
          border-color: #3838EC !important;
          color: #ffffff !important;
          box-shadow: 0 6px 18px rgba(56, 56, 236, 0.35);
        }
        @media (max-width: 640px) {
          .unideals-sub-wrap {
            margin-top: 0 !important;
            margin-bottom: 4px !important;
            padding: 0 4px !important;
          }
          .unideals-sub-form {
            min-height: 50px !important;
            padding: 4px 4px 4px 8px !important;
          }
          .unideals-sub-input {
            font-size: 0.88rem !important;
          }
          .unideals-sub-btn {
            padding: 10px 16px !important;
            font-size: 0.82rem !important;
          }
          .unideals-confirm-title {
            font-size: 0.85rem !important;
          }
          .unideals-confirm-sub {
            font-size: 0.70rem !important;
          }
          .unideals-confirm-done-btn {
            padding: 6px 12px !important;
            font-size: 0.72rem !important;
          }
          .unideals-social-btn {
            width: 36px !important;
            height: 36px !important;
          }
        }

        /* Seamless browser autofill fix (prevents Chrome from adding harsh background boxes) */
        .unideals-sub-input:-webkit-autofill,
        .unideals-sub-input:-webkit-autofill:hover,
        .unideals-sub-input:-webkit-autofill:focus,
        .unideals-sub-input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
          -webkit-text-fill-color: #10072B !important;
          caret-color: #10072B !important;
          transition: background-color 5000s ease-in-out 0s;
        }
        .unideals-sub-input.is-dark:-webkit-autofill,
        .unideals-sub-input.is-dark:-webkit-autofill:hover,
        .unideals-sub-input.is-dark:-webkit-autofill:focus,
        .unideals-sub-input.is-dark:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #141416 inset !important;
          -webkit-text-fill-color: #ffffff !important;
          caret-color: #ffffff !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      {/* Pill Container (Transitions internally between input and sleek confirmation) */}
      <motion.form
        onSubmit={handleSubmit}
        animate={status === "error" ? { x: [-4, 4, -3, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.35 }}
        className="unideals-sub-form"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          width: "100%",
          borderRadius: "9999px",
          background: isDark ? "#141416" : "#ffffff",
          border: isDark
            ? "1px solid rgba(255, 255, 255, 0.09)"
            : "1px solid #e2e8f0",
          boxShadow: isDark
            ? "0 2px 8px rgba(0, 0, 0, 0.4), 0 12px 28px -4px rgba(0, 0, 0, 0.6)"
            : "0 1px 3px rgba(0, 0, 0, 0.04), 0 10px 24px -4px rgba(0, 0, 0, 0.06)",
          transition: "border 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
          overflow: "hidden",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {status === "success" ? (
            /* Sleek Minimal Inside Confirmation State */
            <motion.div
              key="confirmed-pill"
              initial={{ opacity: 0, scale: 0.95, y: 3 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -3 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "2px 6px 2px 10px",
              }}
            >
              {/* Checkmark icon & welcome message */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  minWidth: 0,
                }}
              >
                {/* Brand Blue Check Badge with Pop Animation */}
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 450, damping: 22, delay: 0.08 }}
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    background: "#3838EC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 2px 6px rgba(56, 56, 236, 0.25)",
                  }}
                >
                  <motion.svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <motion.path
                      d="M20 6L9 17l-5-5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.32, delay: 0.18, ease: "easeOut" }}
                    />
                  </motion.svg>
                </motion.div>

                {/* Text feedback */}
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.28, delay: 0.14 }}
                  style={{ display: "flex", flexDirection: "column", minWidth: 0 }}
                >
                  <span
                    className="unideals-confirm-title"
                    style={{
                      fontFamily: "'Figtree', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.92rem",
                      letterSpacing: "-0.015em",
                      color: isDark ? "#ffffff" : "#0f172a",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      lineHeight: 1.25,
                    }}
                  >
                    You&apos;re on the list!
                  </span>
                  <span
                    className="unideals-confirm-sub"
                    style={{
                      fontFamily: "'Figtree', sans-serif",
                      fontWeight: 400,
                      fontSize: "0.75rem",
                      color: isDark ? "rgba(255, 255, 255, 0.55)" : "#64748b",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      lineHeight: 1.25,
                      marginTop: "1px",
                    }}
                  >
                    Check your inbox for your confirmation
                  </span>
                </motion.div>
              </div>

              {/* Minimal Reset / Done Button */}
              <motion.button
                type="button"
                onClick={handleReset}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.22 }}
                className="unideals-confirm-done-btn"
                style={{
                  border: isDark
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid #e2e8f0",
                  background: isDark
                    ? "rgba(255, 255, 255, 0.05)"
                    : "#f8fafc",
                  color: isDark ? "rgba(255, 255, 255, 0.75)" : "#475569",
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  fontSize: "0.76rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "'Figtree', sans-serif",
                  transition: "all 0.15s ease",
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDark ? "rgba(255, 255, 255, 0.1)" : "#f1f5f9";
                  e.currentTarget.style.color = isDark ? "#ffffff" : "#0f172a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDark ? "rgba(255, 255, 255, 0.05)" : "#f8fafc";
                  e.currentTarget.style.color = isDark ? "rgba(255, 255, 255, 0.75)" : "#475569";
                }}
              >
                Done
              </motion.button>
            </motion.div>
          ) : (
            /* Input & Submit Button State */
            <motion.div
              key="input-pill"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              {/* Email Icon */}
              <div
                style={{
                  paddingLeft: "12px",
                  paddingRight: "6px",
                  color: isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(16, 7, 43, 0.4)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>

              {/* Input */}
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                placeholder="Enter your student email..."
                required
                className={`unideals-sub-input ${isDark ? "is-dark" : ""}`}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "0.96rem",
                  fontFamily: "'Figtree', sans-serif",
                  fontWeight: 500,
                  color: isDark ? "#ffffff" : "#10072B",
                  minWidth: 0,
                }}
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="unideals-sub-btn"
                style={{
                  border: "none",
                  outline: "none",
                  cursor: status === "loading" ? "not-allowed" : "pointer",
                  background: "#3838EC",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontFamily: "'Figtree', sans-serif",
                  borderRadius: "9999px",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(56, 56, 236, 0.25)",
                  transition: "transform 0.15s ease, background 0.15s ease",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {status === "loading" ? "Joining..." : "Get Early Access"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>

      {/* Error feedback if any */}
      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            style={{
              marginTop: "10px",
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "#ef4444",
              fontFamily: "'Figtree', sans-serif",
              textAlign: "center",
            }}
          >
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Social proof footnote */}
      <p
        style={{
          marginTop: "14px",
          fontSize: "0.78rem",
          fontWeight: 500,
          color: isDark ? "rgba(255, 255, 255, 0.45)" : "#78768e",
          fontFamily: "'Figtree', sans-serif",
          textAlign: "center",
          letterSpacing: "-0.01em",
        }}
      >
        Join students from your campus · No spam ever
      </p>

      {/* Social Link Icons in Marketing Page UI (Middle Bottom) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          marginTop: "18px",
        }}
      >
        {SOCIAL_LINKS.map((item) => (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.name}
            className="unideals-social-btn"
            style={{
              background: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(16, 7, 43, 0.04)",
              border: isDark ? "1px solid rgba(255, 255, 255, 0.09)" : "1px solid rgba(16, 7, 43, 0.08)",
              color: isDark ? "rgba(255, 255, 255, 0.6)" : "#565275",
            }}
          >
            {item.icon}
          </a>
        ))}
      </div>
    </div>
  );
}
