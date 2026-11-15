import { useState, useEffect, useRef } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  parseISO,
  addDays,
} from "date-fns";
import { useDemoStore } from "./store";

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const PRIORITY_COLORS = {
  High: "var(--color-danger)",
  Medium: "var(--color-saffron)",
  Low: "rgba(224,226,219,0.45)",
};

function buildCalendarDays(currentDate) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const start = startOfWeek(monthStart);
  const end = endOfWeek(monthEnd);
  const days = [];
  let d = start;
  while (d <= end) {
    days.push(d);
    d = addDays(d, 1);
  }
  return days;
}

/** Returns the effective date string for a task (dueDate fallback: created). */
function effectiveDateStr(task) {
  return task.dueDate || (task.created ? task.created.slice(0, 10) : null);
}

/** Returns tasks whose effective date matches `day`. */
function getTasksForDay(tasks, day) {
  return tasks.filter((t) => {
    const ds = effectiveDateStr(t);
    if (!ds) return false;
    try {
      return isSameDay(parseISO(ds), day);
    } catch {
      return false;
    }
  });
}

// ── Priority dot cluster ───────────────────────────────────────────────────

function DotCluster({ tasks }) {
  const shown = tasks.slice(0, 3);
  return (
    <div style={{ display: "flex", gap: 2, marginTop: 2, justifyContent: "center" }}>
      {shown.map((t) => {
        const completed = t.status === "completed";
        const color = PRIORITY_COLORS[t.priority] ?? "var(--muted)";
        return (
          <span
            key={t.id}
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: completed ? "transparent" : color,
              border: completed ? `1px solid ${color}` : "none",
              opacity: completed ? 0.45 : 1,
              flexShrink: 0,
            }}
          />
        );
      })}
    </div>
  );
}

// ── Calendar grid ──────────────────────────────────────────────────────────

function CalendarGrid({ currentDate, tasks, selectedDay, onSelectDay }) {
  const days = buildCalendarDays(currentDate);
  const monthStart = startOfMonth(currentDate);
  const today = new Date();

  return (
    <>
      {/* Day-of-week header */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: "6.25rem" }}>
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontFamily: "var(--font-mono)",
              fontSize: "1.25rem",
              color: "var(--muted)",
              letterSpacing: "0.04em",
              padding: "0.1rem 0",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.1rem" }}>
        {days.map((day, i) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, today);
          const isSelected = selectedDay ? isSameDay(day, selectedDay) : false;
          const dayTasks = getTasksForDay(tasks, day);

          return (
            <button
              key={i}
              onClick={() => onSelectDay && onSelectDay(day)}
              aria-label={format(day, "MMMM d, yyyy")}
              aria-pressed={isSelected}
              style={{
                position: "relative",
                height: 64,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 3,
                background: isSelected
                  ? "rgba(255,149,5,0.25)"
                  : isToday
                    ? "rgba(255,149,5,0.1)"
                    : "transparent",
                border: isSelected
                  ? "1px solid var(--color-saffron)"
                  : isToday
                    ? "1px solid rgba(255,149,5,0.4)"
                    : "1px solid transparent",
                opacity: isCurrentMonth ? 1 : 0.25,
                cursor: "pointer",
                padding: 0,
                outline: "none",
              }}
              onFocus={(e) => (e.currentTarget.style.outline = "2px solid var(--color-saffron)")}
              onBlur={(e) => (e.currentTarget.style.outline = "none")}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "1.15rem",
                  color: isSelected || isToday ? "var(--color-saffron)" : "var(--color-white)",
                  fontVariantNumeric: "tabular-nums",
                  lineHeight: 1,
                }}
              >
                {format(day, "d")}
              </span>
              {dayTasks.length > 0 && <DotCluster tasks={dayTasks} />}
            </button>
          );
        })}
      </div>
    </>
  );
}

// ── Selected-day task list ─────────────────────────────────────────────────

function DayTaskList({ day, tasks }) {
  const dayTasks = getTasksForDay(tasks, day);
  return (
    <div style={{ marginTop: "0.75rem", borderTop: "1px solid var(--border)", paddingTop: "0.5rem" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
        {format(day, "MMM d")}
      </div>
      {dayTasks.length === 0 ? (
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--muted)", margin: 0 }}>
          Nothing scheduled
        </p>
      ) : (
        dayTasks.map((t) => (
          <div
            key={t.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.2rem 0",
              opacity: t.status === "completed" ? 0.5 : 1,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: PRIORITY_COLORS[t.priority] ?? "var(--muted)", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--color-white)", flex: 1, minWidth: 0 }}>
              {t.title}
            </span>
            {t.dueTime && (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--muted)", flexShrink: 0 }}>
                {t.dueTime}
              </span>
            )}
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: PRIORITY_COLORS[t.priority] ?? "var(--muted)", flexShrink: 0 }}>
              {t.priority}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

// ── Loop mode ─────────────────────────────────────────────────────────────

function CalendarLoop({ playLoop }) {
  const { state } = useDemoStore();
  const [highlighted, setHighlighted] = useState(null);
  const loopRan = useRef(false);
  const today = new Date();

  useEffect(() => {
    if (!playLoop || loopRan.current) return;
    loopRan.current = true;
    setTimeout(() => setHighlighted(addDays(today, 2)), 500);
  }, [playLoop]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
        <span style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "1.25rem", color: "var(--color-white)" }}>
          Calendar
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)" }}>
          {format(today, "MMMM yyyy")}
        </span>
      </div>
      <CalendarGrid
        currentDate={today}
        tasks={state.tasks}
        selectedDay={highlighted}
        onSelectDay={null}
      />
    </div>
  );
}

// ── Interactive mode ───────────────────────────────────────────────────────

function CalendarInteractive() {
  const { state } = useDemoStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Nav header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <span style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.8125rem", color: "var(--color-white)" }}>
          {format(currentDate, "MMMM yyyy")}
        </span>
        <div style={{ display: "flex", gap: "0.25rem" }}>
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            aria-label="Previous month"
            style={{
              width: 24, height: 24, borderRadius: 4,
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--muted)",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              outline: "none",
            }}
            onFocus={(e) => (e.currentTarget.style.outline = "2px solid var(--color-saffron)")}
            onBlur={(e) => (e.currentTarget.style.outline = "none")}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M6.5 2L3.5 5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            aria-label="Next month"
            style={{
              width: 24, height: 24, borderRadius: 4,
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--muted)",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              outline: "none",
            }}
            onFocus={(e) => (e.currentTarget.style.outline = "2px solid var(--color-saffron)")}
            onBlur={(e) => (e.currentTarget.style.outline = "none")}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M3.5 2L6.5 5l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </svg>
          </button>
        </div>
      </div>

      <CalendarGrid
        currentDate={currentDate}
        tasks={state.tasks}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
      />

      {selectedDay && <DayTaskList day={selectedDay} tasks={state.tasks} />}
    </div>
  );
}

// ── Entry ─────────────────────────────────────────────────────────────────

export default function CalendarView({ mode = "interactive", playLoop = false }) {
  if (mode === "loop") return <CalendarLoop playLoop={playLoop} />;
  return <CalendarInteractive />;
}
