"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SubscribeBox({ isDark }: { isDark: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid university email address.");
      return;
    }

    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setMessage("You're on the list! We'll notify you when your campus opens.");
      setEmail("");
    }, 800);
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
          padding: 6px;
        }
        .unideals-sub-btn {
          padding: 12px 24px;
          font-size: 0.92rem;
        }
        @media (max-width: 640px) {
          .unideals-sub-wrap {
            margin-top: 0 !important;
            margin-bottom: 4px !important;
            padding: 0 4px !important;
          }
          .unideals-sub-form {
            padding: 4px 4px 4px 8px !important;
          }
          .unideals-sub-input {
            font-size: 0.88rem !important;
          }
          .unideals-sub-btn {
            padding: 10px 16px !important;
            font-size: 0.82rem !important;
          }
        }
      `}</style>
      <form
        onSubmit={handleSubmit}
        className="unideals-sub-form"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          width: "100%",
          borderRadius: "9999px",
          background: isDark
            ? "rgba(18, 14, 38, 0.75)"
            : "rgba(255, 255, 255, 0.85)",
          border: isDark
            ? "1px solid rgba(110, 110, 244, 0.35)"
            : "1px solid rgba(16, 7, 43, 0.12)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: isDark
            ? "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(110, 110, 244, 0.22)"
            : "0 8px 28px rgba(16, 7, 43, 0.08)",
          transition: "all 0.3s ease",
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
          className="unideals-sub-input"
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
            background: "#6E6EF4",
            color: "#ffffff",
            fontWeight: 700,
            fontFamily: "'Figtree', sans-serif",
            borderRadius: "9999px",
            boxShadow: "0 0 18px rgba(110, 110, 244, 0.45)",
            transition: "transform 0.15s ease, background 0.2s ease",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {status === "loading" ? "Joining..." : "Get Early Access"}
        </button>
      </form>

      {/* Message feedback */}
      <AnimatePresence>
        {status === "success" && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            style={{
              marginTop: "12px",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#6E6EF4",
              fontFamily: "'Figtree', sans-serif",
              textAlign: "center",
            }}
          >
            ✓ {message}
          </motion.p>
        )}
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            style={{
              marginTop: "12px",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#ef4444",
              fontFamily: "'Figtree', sans-serif",
              textAlign: "center",
            }}
          >
            {message}
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
        Join 1,200+ students from your campus · No spam ever
      </p>
    </div>
  );
}
