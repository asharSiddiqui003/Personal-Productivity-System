import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { DemoStoreProvider } from "../demo/store";
import TasksView from "../demo/TasksView";
import TimerView from "../demo/TimerView";
import HabitsView from "../demo/HabitsView";
import CalendarView from "../demo/CalendarView";
import { INSIDE_H2, INSIDE_SUB } from "../content";

// ── Cell wrapper ──────────────────────────────────────────────────────────

function BentoCell({ children, style, cellRef, label, id }) {
  return (
    <div
      id={id}
      ref={cellRef}
      aria-label={label}
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "1.25rem",
        overflow: "hidden",
        transition: "border-color 200ms",
        ...style,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-strong)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
    >
      {children}
    </div>
  );
}

// ── Main section ───────────────────────────────────────────────────────────

export default function WhatsInside() {
  const sectionRef = useRef(null);
  const tasksRef = useRef(null);
  const habitsRef = useRef(null);
  const timerRef = useRef(null);
  const calendarRef = useRef(null);

  // Loop triggers — set to true once cell enters viewport
  const [playTasks, setPlayTasks] = useState(false);
  const [playHabits, setPlayHabits] = useState(false);
  const [playTimer, setPlayTimer] = useState(false);
  const [playCalendar, setPlayCalendar] = useState(false);

  // Respect prefers-reduced-motion
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useGSAP(
    () => {
      if (prefersReduced) {
        // Show final states immediately
        setPlayTasks(true);
        setPlayHabits(true);
        setPlayTimer(true);
        setPlayCalendar(true);
        return;
      }

      const makeOnEnter = (setter) => ({
        trigger: null, // set per-cell below
        start: "top 85%",
        once: true,
        onEnter: () => setter(true),
      });

      const cells = [
        { el: tasksRef.current, setter: setPlayTasks },
        { el: habitsRef.current, setter: setPlayHabits },
        { el: timerRef.current, setter: setPlayTimer },
        { el: calendarRef.current, setter: setPlayCalendar },
      ];

      cells.forEach(({ el, setter }) => {
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => setter(true),
        });
      });
    },
    { scope: sectionRef }
  );

  // Grid CSS injected as a style tag to keep inline styles clean
  const gridCss = `
    #wi-grid {
      display: grid;
      grid-template-columns: 3fr 2fr;
      grid-template-rows: auto auto auto;
      gap: 1rem;
    }
    #wi-tasks  { grid-row: span 2; min-height: 340px; }
    #wi-habits { min-height: 160px; }
    #wi-timer  { min-height: 160px; }
    #wi-calendar { grid-column: 1 / -1; min-height: 0; }   /* height driven by content */

    @media (max-width: 767px) {
      #wi-grid { grid-template-columns: 1fr !important; }
      #wi-tasks  { grid-row: auto !important; min-height: 280px; }
      #wi-calendar { grid-column: auto !important; }
    }
  `;

  return (
    <DemoStoreProvider>
      <style>{gridCss}</style>

      <section
        id="whats-inside"
        ref={sectionRef}
        aria-labelledby="inside-heading"
        style={{
          position: "relative",
          zIndex: 10,
          background: "var(--color-carbon)",
          paddingTop: "calc(24vh + 68px)",
          paddingBottom: "clamp(80px, 12vw, 160px)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 clamp(20px, 5vw, 48px)",
          }}
        >
          {/* Section header */}
          <div style={{ marginBottom: "3rem" }}>
            <h2
              id="inside-heading"
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 300,
                fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.06,
                color: "var(--color-white)",
                margin: "0 0 0.75rem",
              }}
            >
              {INSIDE_H2}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1.0625rem",
                lineHeight: 1.6,
                color: "var(--muted)",
                margin: 0,
                maxWidth: "52ch",
              }}
            >
              {INSIDE_SUB}
            </p>
          </div>

          {/* Bento grid */}
          <div id="wi-grid">
            {/* Tasks — large, 2 rows */}
            <BentoCell
              id="wi-tasks"
              label="Tasks demo"
              cellRef={tasksRef}
            >
              <TasksView mode="loop" playLoop={playTasks} />
            </BentoCell>

            {/* Habits */}
            <BentoCell id="wi-habits" label="Habits demo" cellRef={habitsRef}>
              <HabitsView mode="loop" playLoop={playHabits} />
            </BentoCell>

            {/* Timer */}
            <BentoCell id="wi-timer" label="Timer demo" cellRef={timerRef}>
              <TimerView mode="loop" playLoop={playTimer} />
            </BentoCell>

            {/* Calendar — full width */}
            <BentoCell
              id="wi-calendar"
              label="Calendar demo"
              cellRef={calendarRef}
            >
              <CalendarView mode="loop" playLoop={playCalendar} />
            </BentoCell>
          </div>
        </div>
      </section>
    </DemoStoreProvider>
  );
}
