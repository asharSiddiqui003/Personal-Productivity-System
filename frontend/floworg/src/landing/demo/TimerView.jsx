/**
 * TimerView.jsx — presentational Pomodoro demo component.
 *
 * mode="loop"        — ring fills partway while digits tick (scripted, no store changes).
 * mode="interactive" — full timer: Focus 25 / Short 5 / Long 15 / Quick demo 10 s.
 *                      Space toggles. Finishing a session increments sessionsToday.
 */
import { useEffect, useRef } from "react";
import { useDemoStore } from "./store";

const MODES = [
  { key: "focus", label: "Focus", mins: 25 },
  { key: "short", label: "Short", mins: 5 },
  { key: "long", label: "Long", mins: 15 },
  { key: "demo", label: "Quick demo (10 s)", mins: null },
];

const RING_R = 54;
const RING_CIRC = 2 * Math.PI * RING_R;

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ── Loop mode: local state only, no store writes ──────────────────────────

function TimerLoop({ playLoop }) {
  const svgRef = useRef(null);
  const digitsRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const durationMs = 2200; // animate ring to ~40% over 2.2 s

  useEffect(() => {
    if (!playLoop) return;
    const startTime = performance.now();
    startRef.current = startTime;

    function step(now) {
      const elapsed = now - startRef.current;
      const pct = Math.min(elapsed / durationMs, 1);
      const targetPct = 0.4; // fill to 40%
      const fill = pct * targetPct;
      const offset = RING_CIRC * (1 - fill);

      if (svgRef.current) {
        svgRef.current.style.strokeDashoffset = offset;
      }
      // Tick digits: show how many seconds at 40% of 25 min = 10 min remaining (900s displayed from 1500 down)
      if (digitsRef.current) {
        const startSecs = 25 * 60;
        const endSecs = Math.round(0.6 * startSecs); // 60% left = ring 40% filled
        const displaySecs = Math.round(startSecs - (startSecs - endSecs) * pct);
        digitsRef.current.textContent = formatTime(displaySecs);
      }

      if (pct < 1) rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [playLoop]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "1rem" }}>
      <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle cx="70" cy="70" r={RING_R} fill="none" stroke="rgba(224,226,219,0.08)" strokeWidth="8" />
        {/* Progress */}
        <circle
          ref={svgRef}
          cx="70" cy="70" r={RING_R}
          fill="none"
          stroke="var(--color-saffron)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={RING_CIRC}
          strokeDashoffset={RING_CIRC}
          style={{ transition: "none" }}
        />
      </svg>
      <span
        ref={digitsRef}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "2rem",
          fontVariantNumeric: "tabular-nums",
          color: "var(--color-white)",
          letterSpacing: "0.04em",
          marginTop: "-120px", // overlap ring
        }}
      >
        25:00
      </span>
      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--muted)", marginTop: "2rem" }}>
        Focus
      </span>
    </div>
  );
}

// ── Interactive mode ───────────────────────────────────────────────────────

function TimerInteractive() {
  const { state, dispatch } = useDemoStore();
  const { mode, durations, timeLeft, isRunning, sessionsToday } = state.timer;
  const totalTime = durations[mode];
  const progress = (totalTime - timeLeft) / totalTime;
  const offset = RING_CIRC * (1 - progress);

  // Interval tick
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => dispatch({ type: "TIMER_TICK" }), 1000);
    return () => clearInterval(id);
  }, [isRunning, dispatch]);

  // Space key toggle
  useEffect(() => {
    const handler = (e) => {
      if (e.code === "Space" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
        e.preventDefault();
        dispatch({ type: "TIMER_TOGGLE" });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [dispatch]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Mode bar */}
      <div style={{ display: "flex", gap: "0.375rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => dispatch({ type: "TIMER_SET_MODE", mode: m.key })}
            aria-label={`Switch to ${m.label} mode`}
            style={{
              padding: "0.3rem 0.65rem",
              borderRadius: "var(--radius)",
              border: `1px solid ${mode === m.key ? "var(--color-saffron)" : "var(--border)"}`,
              background: mode === m.key ? "rgba(255,149,5,0.15)" : "transparent",
              color: mode === m.key ? "var(--color-saffron)" : "var(--muted)",
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              cursor: "pointer",
              transition: "all 150ms",
              outline: "none",
            }}
            onFocus={(e) => (e.currentTarget.style.outline = "2px solid var(--color-saffron)")}
            onBlur={(e) => (e.currentTarget.style.outline = "none")}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Ring + digits */}
      <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
        <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="70" cy="70" r={RING_R} fill="none" stroke="rgba(224,226,219,0.08)" strokeWidth="8" />
          <circle
            cx="70" cy="70" r={RING_R}
            fill="none"
            stroke="var(--color-saffron)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={RING_CIRC}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "1.75rem",
              fontVariantNumeric: "tabular-nums",
              color: "var(--color-white)",
              letterSpacing: "0.04em",
            }}
          >
            {formatTime(timeLeft)}
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.6875rem",
              color: "var(--muted)",
              marginTop: "0.25rem",
            }}
          >
            {MODES.find((m) => m.key === mode)?.label ?? ""}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.75rem", marginTop: "0.5rem" }}>
        <button
          onClick={() => dispatch({ type: "TIMER_TOGGLE" })}
          aria-label={isRunning ? "Pause timer" : "Start timer"}
          style={{
            width: 44,
            height: 44,
            borderRadius: "var(--radius)",
            border: "none",
            background: "var(--color-saffron)",
            color: "var(--color-carbon)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            outline: "none",
          }}
          onFocus={(e) => (e.currentTarget.style.outline = "2px solid var(--color-saffron)")}
          onBlur={(e) => (e.currentTarget.style.outline = "none")}
        >
          {isRunning ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="3" y="2" width="4" height="12" rx="1" />
              <rect x="9" y="2" width="4" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 2.5l10 5.5-10 5.5V2.5z" />
            </svg>
          )}
        </button>
        <button
          onClick={() => dispatch({ type: "TIMER_RESET" })}
          aria-label="Reset timer"
          style={{
            width: 44,
            height: 44,
            borderRadius: "var(--radius)",
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--muted)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            outline: "none",
          }}
          onFocus={(e) => (e.currentTarget.style.outline = "2px solid var(--color-saffron)")}
          onBlur={(e) => (e.currentTarget.style.outline = "none")}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 8a4 4 0 1 0 1-2.65" />
            <polyline points="4,4 4,8 7,8" />
          </svg>
        </button>
        {/* Sessions today counter */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6875rem",
            color: "var(--muted)",
            letterSpacing: "0.04em",
          }}
          aria-live="polite"
          aria-label={`Sessions today: ${sessionsToday}`}
        >
          {sessionsToday} session{sessionsToday !== 1 ? "s" : ""} today
        </span>
      </div>

      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.6875rem", color: "var(--muted)", textAlign: "center", marginTop: "0.5rem" }}>
        Space to toggle
      </p>
    </div>
  );
}

// ── Entry ─────────────────────────────────────────────────────────────────

export default function TimerView({ mode = "interactive", playLoop = false }) {
  if (mode === "loop") return <TimerLoop playLoop={playLoop} />;
  return <TimerInteractive />;
}

