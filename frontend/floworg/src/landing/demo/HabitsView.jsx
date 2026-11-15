/**
 * HabitsView.jsx — presentational habits demo component.
 *
 * mode="loop"        — slide handle animates across; streak number increments.
 * mode="interactive" — slide-to-complete with double-activation guard; streak increments.
 */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDemoStore } from "./store";

// ── Slide-to-complete control ─────────────────────────────────────────────

function SlideToComplete({ done, onComplete, disabled }) {
  const [swiping, setSwiping] = useState(false);
  const trackRef = useRef(null);
  const startX = useRef(0);
  const currentX = useRef(0);

  const handlePointerDown = (e) => {
    if (done || disabled) return;
    setSwiping(true);
    startX.current = e.clientX;
    trackRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!swiping) return;
    currentX.current = e.clientX - startX.current;
  };

  const handlePointerUp = () => {
    if (!swiping) return;
    setSwiping(false);
    const trackWidth = trackRef.current?.getBoundingClientRect().width ?? 240;
    if (currentX.current > trackWidth * 0.6) {
      onComplete();
    }
    currentX.current = 0;
  };

  return (
    <div
      ref={trackRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: "relative",
        width: "100%",
        height: 36,
        borderRadius: 999,
        background: done ? "rgba(255,149,5,0.18)" : "rgba(224,226,219,0.06)",
        border: `1px solid ${done ? "var(--color-saffron)" : "var(--border)"}`,
        cursor: done ? "default" : "pointer",
        overflow: "hidden",
        transition: "background 300ms, border-color 300ms",
        userSelect: "none",
        touchAction: "none",
      }}
      role="slider"
      aria-valuenow={done ? 100 : 0}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Slide to complete"
      tabIndex={done || disabled ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !done && !disabled) {
          e.preventDefault();
          onComplete();
        }
      }}
    >
      {/* Background fill */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: done ? "100%" : 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(255,149,5,0.25)",
          borderRadius: "inherit",
        }}
      />

      {/* Label */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-body)",
          fontSize: "0.75rem",
          color: done ? "var(--color-saffron)" : "var(--muted)",
          pointerEvents: "none",
          letterSpacing: "0.04em",
          transition: "color 300ms",
        }}
      >
        {done ? "Done ✓" : "Slide to complete →"}
      </div>

      {/* Thumb */}
      {!done && (
        <div
          style={{
            position: "absolute",
            left: 3,
            top: 3,
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "var(--color-saffron)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--color-carbon)" strokeWidth="2" strokeLinecap="round">
            <path d="M2 6h8M7 3l3 3-3 3" />
          </svg>
        </div>
      )}
    </div>
  );
}

// ── Habit card ────────────────────────────────────────────────────────────

function HabitCard({ habit, interactive, onComplete, animated }) {
  return (
    <motion.div
      layout
      style={{
        padding: "0.65rem 0.75rem",
        borderRadius: "var(--radius)",
        border: "1px solid var(--border)",
        background: "rgba(224,226,219,0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "0.4rem",
      }}
    >
      {/* Title + streak */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            color: "var(--color-white)",
          }}
        >
          {habit.title}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--color-saffron)",
            letterSpacing: "0.03em",
          }}
          aria-live="polite"
          aria-label={`${habit.streak} day streak`}
        >
          {habit.streak}d
        </span>
      </div>

      {/* Slide control — interactive or loop-animated */}
      {interactive ? (
        <SlideToComplete
          done={habit.done}
          onComplete={() => !habit.done && onComplete(habit.id)}
          disabled={habit.done}
        />
      ) : (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 36,
            borderRadius: 999,
            background: animated ? "rgba(255,149,5,0.18)" : "rgba(224,226,219,0.06)",
            border: `1px solid ${animated ? "var(--color-saffron)" : "var(--border)"}`,
            overflow: "hidden",
            transition: "background 300ms, border-color 300ms",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: animated ? "100%" : 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ position: "absolute", inset: 0, background: "rgba(255,149,5,0.25)" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              color: animated ? "var(--color-saffron)" : "var(--muted)",
              pointerEvents: "none",
              transition: "color 300ms",
            }}
          >
            {animated ? "Done ✓" : "Slide to complete →"}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ── Loop animation wrapper ─────────────────────────────────────────────────

function HabitsLoop({ playLoop }) {
  const { state } = useDemoStore();
  const [animatedIdx, setAnimatedIdx] = useState(-1);
  const [streaks, setStreaks] = useState(state.habits.map((h) => h.streak));
  const loopRan = useRef(false);

  useEffect(() => {
    if (!playLoop || loopRan.current) return;
    loopRan.current = true;

    // Animate the first habit
    setTimeout(() => {
      setAnimatedIdx(0);
      setTimeout(() => setStreaks((prev) => { const next = [...prev]; next[0]++; return next; }), 500);
    }, 400);
  }, [playLoop]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.8125rem", color: "var(--color-white)", marginBottom: "0.25rem" }}>
        Habits
      </div>
      {state.habits.map((habit, i) => (
        <HabitCard
          key={habit.id}
          habit={{ ...habit, streak: streaks[i], done: i === 0 && animatedIdx >= 0 }}
          interactive={false}
          animated={i === 0 && animatedIdx >= 0}
        />
      ))}
    </div>
  );
}

// ── Interactive ───────────────────────────────────────────────────────────

function HabitsInteractive() {
  const { state, dispatch } = useDemoStore();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.8125rem", color: "var(--color-white)", marginBottom: "0.5rem" }}>
        Habits
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1, overflowY: "auto" }}>
        <AnimatePresence>
          {state.habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              interactive
              onComplete={(id) => dispatch({ type: "HABIT_COMPLETE", id })}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Entry ─────────────────────────────────────────────────────────────────

export default function HabitsView({ mode = "interactive", playLoop = false }) {
  if (mode === "loop") return <HabitsLoop playLoop={playLoop} />;
  return <HabitsInteractive />;
}

