import { useRef, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { AnimatePresence, motion } from "framer-motion";
import { DemoStoreProvider } from "../demo/store";
import TasksView from "../demo/TasksView";
import TimerView from "../demo/TimerView";
import HabitsView from "../demo/HabitsView";
import CalendarView from "../demo/CalendarView";
import { TRY_H2, TRY_SUB, TRY_STEPS } from "../content";
import { getLenis } from "../hooks/useLenis";

// Tab definitions (order must match TRY_STEPS labels)
const TABS = [
  { key: "Tasks", label: "Tasks", View: TasksView },
  { key: "Timer", label: "Timer", View: TimerView },
  { key: "Habits", label: "Habits", View: HabitsView },
  { key: "Calendar", label: "Calendar", View: CalendarView },
];

const STEP_TO_TAB = { Tasks: "Tasks", Timer: "Timer", Habits: "Habits", Calendar: "Calendar" };

// ── Tab bar ───────────────────────────────────────────────────────────────

const tabBarCss = `
  .try-tab {
    flex: 1;
    padding: 0.6rem 0.5rem;
    font-family: var(--font-body);
    font-size: 0.8rem;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: color 150ms, border-color 150ms;
    outline: none;
  }
  .try-tab:focus-visible {
    outline: 2px solid var(--color-saffron);
    outline-offset: 2px;
  }
`;

function TabBar({ activeTab, onTabClick }) {
  return (
    <div
      role="tablist"
      aria-label="Demo tabs"
      style={{ display: "flex", borderBottom: "1px solid var(--border)", flexShrink: 0 }}
    >
      {TABS.map(({ key, label }) => {
        const isActive = key === activeTab;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${key}`}
            id={`tab-${key}`}
            className="try-tab"
            onClick={() => onTabClick(key)}
            style={{
              fontWeight: isActive ? 500 : 400,
              color: isActive ? "var(--color-white)" : "var(--muted)",
              borderBottom: isActive
                ? "2px solid var(--color-saffron)"
                : "2px solid transparent",
              marginBottom: -1,
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ── Panel content area ─────────────────────────────────────────────────────

function PanelContent({ activeTab }) {
  const { View } = TABS.find((t) => t.key === activeTab) ?? TABS[0];
  return (
    <div
      role="tabpanel"
      id={`panel-${activeTab}`}
      aria-labelledby={`tab-${activeTab}`}
      style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "1rem" }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          style={{ height: "100%" }}
        >
          <View mode="interactive" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── Full panel (desktop sticky) ────────────────────────────────────────────

function Panel({ activeTab, onTabClick }) {
  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        display: "flex",
        flexDirection: "column",
        minHeight: 520,
        overflow: "hidden",
      }}
    >
      <TabBar activeTab={activeTab} onTabClick={onTabClick} />
      <PanelContent activeTab={activeTab} />
    </div>
  );
}

// ── Compact panel (mobile) ─────────────────────────────────────────────────

function CompactPanel({ tabKey }) {
  const { View } = TABS.find((t) => t.key === tabKey) ?? TABS[0];
  return (
    <div
      style={{
        marginTop: "1.5rem",
        background: "var(--color-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "1rem",
        minHeight: 280,
        overflow: "hidden",
      }}
    >
      <View mode="interactive" />
    </div>
  );
}

// ── Main section ───────────────────────────────────────────────────────────

export default function TryIt() {
  const sectionRef = useRef(null);
  const stepRefs = useRef([]);
  const [activeTab, setActiveTab] = useState("Tasks");

  // While a programmatic scroll is in flight, ignore ScrollTrigger onToggle
  const scrollingTo = useRef(false);
  const scrollTimeoutRef = useRef(null);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleTabClick = useCallback(
    (key) => {
      const idx = TABS.findIndex((t) => t.key === key);
      const stepEl = stepRefs.current[idx];
      if (!stepEl) {
        setActiveTab(key);
        return;
      }

      // Set tab immediately — no flicker
      setActiveTab(key);

      // Block ScrollTrigger updates during the scroll
      scrollingTo.current = true;
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        scrollingTo.current = false;
      }, 1200);

      const lenis = getLenis();
      if (lenis && !prefersReduced) {
        const offset = -((window.innerHeight - stepEl.offsetHeight) / 2);
        lenis.scrollTo(stepEl, {
          offset,
          duration: 1,
          onComplete: () => {
            scrollingTo.current = false;
            clearTimeout(scrollTimeoutRef.current);
          },
        });
      } else {
        stepEl.scrollIntoView({ block: "center", behavior: prefersReduced ? "auto" : "smooth" });
      }
    },
    [prefersReduced]
  );

  useGSAP(
    () => {
      if (prefersReduced) return; // reduced motion: click-only

      TRY_STEPS.forEach((step, i) => {
        const el = stepRefs.current[i];
        if (!el) return;
        const tabKey = STEP_TO_TAB[step.label];

        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: ({ isActive }) => {
            if (!isActive) return;
            if (scrollingTo.current) return; // in-flight scroll — ignore
            setActiveTab(tabKey);
          },
        });
      });
    },
    { scope: sectionRef, dependencies: [] }
  );

  /* Responsive CSS */
  const mediaCss = `
    ${tabBarCss}
    .try-grid {
      display: grid;
      grid-template-columns: 5fr 7fr;
      gap: 48px;
      align-items: start;
    }
    .try-sticky {
      position: sticky;
      top: max(72px, calc(50vh - 260px));
      align-self: start;
    }
    .try-mobile-panel { display: none; }
    @media (max-width: 1023px) {
      .try-grid { grid-template-columns: 1fr; }
      .try-sticky { display: none; }
      .try-mobile-panel { display: block; }
    }
  `;

  return (
    <DemoStoreProvider>
      <style>{mediaCss}</style>

      <section
        id="try-it"
        ref={sectionRef}
        aria-labelledby="try-heading"
        style={{
          position: "relative",
          zIndex: 10,
          background: "var(--color-carbon)",
          padding: "clamp(80px, 12vw, 160px) 0",
        }}
      >
        <div
          style={{
            maxWidth: 1600,
            margin: "0 auto",
            padding: "0 clamp(20px, 5vw, 48px)",
          }}
        >
          {/* Section header */}
          <div style={{ marginBottom: "4rem" }}>
            <h2
              id="try-heading"
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 300,
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.06,
                color: "var(--color-white)",
                margin: "0 0 0.75rem",
              }}
            >
              {TRY_H2}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1.5rem",
                lineHeight: 1.6,
                color: "var(--muted)",
                margin: 0,
                maxWidth: "54ch",
              }}
            >
              {TRY_SUB}
            </p>
          </div>

          {/* Two-column grid */}
          <div className="try-grid">
            {/* ── LEFT: scrolling explainer ─────────────────────────── */}
            <div>
              {TRY_STEPS.map((step, i) => (
                <div
                  key={step.num}
                  ref={(el) => { stepRefs.current[i] = el; }}
                  style={{
                    minHeight: "80svh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    paddingTop: "2rem",
                    paddingBottom: "2rem",
                  }}
                >
                  {/* Mono label */}
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontVariantNumeric: "tabular-nums",
                      fontSize: "1.75rem",
                      color: "var(--muted)",
                      display: "block",
                      marginBottom: "0.75rem",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {step.num} — {step.label}
                  </span>

                  {/* H3 — white title */}
                  <h3
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 500,
                      fontSize: "clamp(1.25rem, 2.5vw, 1.25rem)",
                      letterSpacing: "-0.01em",
                      color: "var(--color-white)",
                      margin: "0 0 0.75rem",
                    }}
                  >
                    {step.title}
                  </h3>

                  {/* Body — Linen-65% */}
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "1.5rem",
                      lineHeight: 1.65,
                      color: "var(--muted)",
                      margin: "0 0 1rem",
                      maxWidth: "44ch",
                    }}
                  >
                    {step.body}
                  </p>

                  {/* Try: line */}
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 500,
                      fontSize: "1rem",
                      color: "var(--color-saffron)",
                      margin: 0,
                    }}
                  >
                    Try: {step.tryLabel}
                  </p>

                  {/* Mobile compact panel (below each step) */}
                  <div className="try-mobile-panel">
                    <CompactPanel tabKey={STEP_TO_TAB[step.label]} />
                  </div>
                </div>
              ))}
            </div>

            {/* ── RIGHT: sticky panel (desktop only) ───────────────── */}
            <div className="try-sticky">
              <Panel activeTab={activeTab} onTabClick={handleTabClick} />
            </div>
          </div>
        </div>
      </section>
    </DemoStoreProvider>
  );
}
