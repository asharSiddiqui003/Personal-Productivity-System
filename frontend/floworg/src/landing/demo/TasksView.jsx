/**
 * TasksView.jsx — presentational tasks demo component.
 *
 * mode="loop"        — scripted one-shot animation driven externally via `playLoop` prop.
 * mode="interactive" — fully interactive against the shared DemoStore.
 *
 * Priority colours per DESIGN.md §3:
 *   High   → --color-danger  (#e5645a)
 *   Medium → --color-saffron (#ff9505)
 *   Low    → --color-linen at 45%
 */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDemoStore } from "./store";

const PRIORITY_COLORS = {
  High: "var(--color-danger)",
  Medium: "var(--color-saffron)",
  Low: "rgba(224,226,219,0.45)",
};

const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };

function PriorityDot({ priority }) {
  return (
    <span
      aria-label={`${priority} priority`}
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: PRIORITY_COLORS[priority] ?? "var(--muted)",
        flexShrink: 0,
        marginTop: 2,
      }}
    />
  );
}

/** Format "yyyy-MM-dd" + "HH:mm" into a compact muted label. */
function dueMeta(task) {
  if (!task.dueDate) return null;
  const dateLabel = task.dueDate; // already "yyyy-MM-dd"
  return task.dueTime ? `${dateLabel} · ${task.dueTime}` : dateLabel;
}

function TaskRow({ task, interactive, onToggle }) {
  const completed = task.status === "completed";
  const meta = dueMeta(task);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.6rem",
        padding: "0.5rem 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Checkbox */}
      <button
        role="checkbox"
        aria-checked={completed}
        aria-label={`Mark "${task.title}" ${completed ? "incomplete" : "complete"}`}
        onClick={() => interactive && onToggle(task.id)}
        style={{
          flexShrink: 0,
          width: 18,
          height: 18,
          borderRadius: 4,
          border: `1.5px solid ${completed ? "var(--color-saffron)" : "var(--border-strong)"}`,
          background: completed ? "var(--color-saffron)" : "transparent",
          cursor: interactive ? "pointer" : "default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 180ms, border-color 180ms",
          outline: "none",
          marginTop: 2,
        }}
        onFocus={(e) => interactive && (e.currentTarget.style.outline = "2px solid var(--color-saffron)")}
        onBlur={(e) => (e.currentTarget.style.outline = "none")}
      >
        {completed && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="var(--color-carbon)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <PriorityDot priority={task.priority} />

      {/* Title + date meta */}
      <span style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: completed ? "var(--muted)" : "var(--color-white)",
            lineHeight: 1.4,
            position: "relative",
            transition: "color 200ms",
          }}
        >
          {task.title}
          {/* Strikethrough line drawn via CSS transform */}
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: completed ? 1 : 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "50%",
              height: 1.5,
              background: "var(--muted)",
              transformOrigin: "left center",
            }}
          />
        </span>
        {meta && (
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              color: "var(--muted)",
              marginTop: "0.1rem",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "0.02em",
            }}
          >
            {meta}
          </span>
        )}
      </span>

      {/* Priority label */}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.6875rem",
          color: PRIORITY_COLORS[task.priority] ?? "var(--muted)",
          flexShrink: 0,
          marginTop: 2,
          letterSpacing: "0.03em",
        }}
      >
        {task.priority}
      </span>
    </motion.div>
  );
}

// ── Interactive mode input ─────────────────────────────────────────────────

function AddTaskInput({ onAdd }) {
  const today = new Date().toISOString().slice(0, 10);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(today);
  const [dueTime, setDueTime] = useState("");
  const [priority, setPriority] = useState("Medium");

  const submit = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), priority, dueDate, dueTime);
    setTitle("");
    setDueDate(today);
    setDueTime("");
    setPriority("Medium");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") submit();
  };

  const inputBase = {
    background: "rgba(224,226,219,0.06)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--color-white)",
    outline: "none",
    colorScheme: "dark",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "0.75rem" }}>
      {/* Row 1: title + Add button */}
      <div style={{ display: "flex", gap: "0.4rem" }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Task title…"
          aria-label="New task title"
          style={{
            ...inputBase,
            flex: 1,
            padding: "0.4rem 0.75rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-saffron)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        />
        <button
          onClick={submit}
          aria-label="Add task"
          style={{
            flexShrink: 0,
            padding: "0.4rem 0.75rem",
            background: "var(--color-saffron)",
            color: "var(--color-carbon)",
            border: "none",
            borderRadius: "var(--radius)",
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: "0.8rem",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>
      {/* Row 2: date + time + priority */}
      <div style={{ display: "flex", gap: "0.4rem" }}>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          aria-label="Due date"
          style={{
            ...inputBase,
            flex: "1 1 0",
            padding: "0.35rem 0.5rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-saffron)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        />
        <input
          type="time"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
          aria-label="Due time (optional)"
          style={{
            ...inputBase,
            flex: "0 0 auto",
            width: "5.5rem",
            padding: "0.35rem 0.4rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-saffron)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          aria-label="Task priority"
          style={{
            ...inputBase,
            flex: "0 0 auto",
            padding: "0.35rem 0.4rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            color: PRIORITY_COLORS[priority] ?? "var(--muted)",
            cursor: "pointer",
            background: "var(--color-surface)",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-saffron)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

/**
 * @param {"loop"|"interactive"} mode
 * @param {boolean} [playLoop] — set true from parent to trigger the scripted animation
 */
export default function TasksView({ mode = "interactive", playLoop = false }) {
  const { state, dispatch } = useDemoStore();

  // Sort active: priority order then dueDate ascending
  const activeTasks = state.tasks
    .filter((t) => t.status === "active")
    .sort((a, b) => {
      const pd = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (pd !== 0) return pd;
      return (a.dueDate ?? "").localeCompare(b.dueDate ?? "");
    });
  const completedTasks = state.tasks.filter((t) => t.status === "completed");

  // ── Loop mode: scripted animation ────────────────────────────────────────
  const loopRan = useRef(false);
  const [loopTask, setLoopTask] = useState(null); // task being typed in loop mode

  useEffect(() => {
    if (mode !== "loop" || !playLoop || loopRan.current) return;
    loopRan.current = true;

    const todayStr = new Date().toISOString().slice(0, 10);
    const demo = { id: 999, title: "", priority: "High", dueDate: todayStr, dueTime: "", status: "active" };
    const target = "Review morning notes";

    // Step 1: type the task title character by character
    setLoopTask({ ...demo, title: "" });
    let i = 0;
    const typeInterval = setInterval(() => {
      i++;
      setLoopTask((prev) => ({ ...prev, title: target.slice(0, i) }));
      if (i >= target.length) {
        clearInterval(typeInterval);

        // Step 2: after 400ms, mark it as a High priority and "check" it
        setTimeout(() => {
          setLoopTask((prev) => ({ ...prev, status: "completing" }));

          // Step 3: after 600ms, complete it
          setTimeout(() => {
            setLoopTask((prev) => ({ ...prev, status: "completed" }));
          }, 600);
        }, 400);
      }
    }, 60);

    return () => clearInterval(typeInterval);
  }, [mode, playLoop]);

  const isInteractive = mode === "interactive";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          fontSize: "0.8125rem",
          color: "var(--color-white)",
          marginBottom: "0.75rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span>Tasks</span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6875rem",
            color: "var(--muted)",
            letterSpacing: "0.04em",
          }}
        >
          {activeTasks.length} active
        </span>
      </div>

      {/* Add input — interactive only */}
      {isInteractive && (
        <AddTaskInput
          onAdd={(title, priority, dueDate, dueTime) =>
            dispatch({ type: "TASK_ADD", title, priority, dueDate, dueTime })
          }
        />
      )}

      {/* Loop mode: single scripted task */}
      {mode === "loop" && loopTask && (
        <div style={{ marginBottom: "0.5rem" }}>
          <TaskRow
            task={{
              ...loopTask,
              status: loopTask.status === "completing" || loopTask.status === "completed"
                ? "completed"
                : "active",
            }}
            interactive={false}
            onToggle={() => {}}
          />
        </div>
      )}

      {/* Active tasks */}
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        <AnimatePresence initial={false}>
          {activeTasks.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              interactive={isInteractive}
              onToggle={(id) => dispatch({ type: "TASK_TOGGLE", id })}
            />
          ))}
        </AnimatePresence>

        {/* Completed section */}
        {completedTasks.length > 0 && (
          <>
            <div
              style={{
                marginTop: "1rem",
                marginBottom: "0.25rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                color: "var(--muted)",
                letterSpacing: "0.06em",
              }}
            >
              COMPLETED
            </div>
            <AnimatePresence initial={false}>
              {completedTasks.map((t) => (
                <TaskRow
                  key={t.id}
                  task={t}
                  interactive={isInteractive}
                  onToggle={(id) => dispatch({ type: "TASK_TOGGLE", id })}
                />
              ))}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}

