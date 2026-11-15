/**
 * demo/store.js — in-memory useReducer store for the landing demo.
 * No API calls, no localStorage. Seed data only.
 */
import { createContext, useContext, useReducer, useMemo } from "react";
import { addDays, format } from "date-fns";

// ── Seed data ─────────────────────────────────────────────────────────────

const today = new Date();

function todayStr() {
  return format(new Date(), "yyyy-MM-dd");
}
function dateStr(d) {
  return format(d, "yyyy-MM-dd");
}

const SEED_TASKS = [
  {
    id: 1,
    title: "Review Q4 OKRs",
    priority: "High",
    dueDate: dateStr(addDays(today, 2)),
    dueTime: "10:00",
    created: today.toISOString(),
    status: "active",
  },
  {
    id: 2,
    title: "Write weekly update",
    priority: "Medium",
    dueDate: dateStr(addDays(today, 5)),
    dueTime: "",
    created: today.toISOString(),
    status: "active",
  },
  {
    id: 3,
    title: "Read design tokens doc",
    priority: "Low",
    dueDate: dateStr(addDays(today, 8)),
    dueTime: "",
    created: today.toISOString(),
    status: "active",
  },
];

const SEED_HABITS = [
  { id: 1, title: "Morning pages", streak: 12, done: false },
  { id: 2, title: "30-min walk", streak: 7, done: false },
  { id: 3, title: "No coffee after 3 pm", streak: 4, done: false },
];

const SEED_TIMER = {
  mode: "focus",           // focus | short | long | demo
  durations: { focus: 25 * 60, short: 5 * 60, long: 15 * 60, demo: 10 },
  timeLeft: 25 * 60,
  isRunning: false,
  sessionsToday: 0,
};

// ── Initial state ──────────────────────────────────────────────────────────

const INITIAL = {
  tasks: SEED_TASKS,
  nextTaskId: SEED_TASKS.length + 1,
  habits: SEED_HABITS,
  timer: SEED_TIMER,
};

// ── Reducer ───────────────────────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {
    // Tasks
    case "TASK_ADD": {
      const now = new Date();
      const task = {
        id: state.nextTaskId,
        title: action.title,
        priority: action.priority || "Medium",
        dueDate: action.dueDate || format(now, "yyyy-MM-dd"),
        dueTime: action.dueTime || "",
        created: now.toISOString(),
        status: "active",
      };
      return {
        ...state,
        tasks: [task, ...state.tasks],
        nextTaskId: state.nextTaskId + 1,
      };
    }
    case "TASK_TOGGLE": {
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id
            ? { ...t, status: t.status === "active" ? "completed" : "active" }
            : t
        ),
      };
    }

    // Habits
    case "HABIT_COMPLETE": {
      return {
        ...state,
        habits: state.habits.map((h) =>
          h.id === action.id && !h.done
            ? { ...h, done: true, streak: h.streak + 1 }
            : h
        ),
      };
    }

    // Timer
    case "TIMER_SET_MODE": {
      const dur = state.timer.durations[action.mode];
      return {
        ...state,
        timer: {
          ...state.timer,
          mode: action.mode,
          timeLeft: dur,
          isRunning: false,
        },
      };
    }
    case "TIMER_TOGGLE": {
      return {
        ...state,
        timer: { ...state.timer, isRunning: !state.timer.isRunning },
      };
    }
    case "TIMER_TICK": {
      const next = state.timer.timeLeft - 1;
      if (next <= 0) {
        const dur = state.timer.durations[state.timer.mode];
        return {
          ...state,
          timer: {
            ...state.timer,
            timeLeft: dur,
            isRunning: false,
            sessionsToday: state.timer.sessionsToday + 1,
          },
        };
      }
      return {
        ...state,
        timer: { ...state.timer, timeLeft: next },
      };
    }
    case "TIMER_RESET": {
      const dur = state.timer.durations[state.timer.mode];
      return {
        ...state,
        timer: { ...state.timer, timeLeft: dur, isRunning: false },
      };
    }

    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────

const StoreCtx = createContext(null);

export function DemoStoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useDemoStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useDemoStore must be used inside DemoStoreProvider");
  return ctx;
}
