import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[var(--bg-canvas)] text-[var(--text)] text-center">
          <div className="w-16 h-16 bg-[var(--surface)] border border-[var(--line-card)] rounded-2xl flex items-center justify-center mb-6">
            <span className="text-[var(--danger)] text-2xl font-bold">!</span>
          </div>
          <h1 className="text-2xl font-heading text-[var(--text-strong)] mb-2">
            Something went wrong
          </h1>
          <p className="text-sm text-[var(--text-muted)] max-w-md mb-6">
            {this.state.error?.message || "An unexpected error occurred while rendering this page."}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = "/";
            }}
            className="inline-flex items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--on-accent)] font-semibold px-6 py-2.5 transition hover:bg-[var(--accent-hover)]"
          >
            Return to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
