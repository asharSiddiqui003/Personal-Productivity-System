export default function GlobalBackground() {
  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ zIndex: -10, background: "radial-gradient(ellipse at 50% 0%, #12103a 0%, #06070f 70%)" }}
    >
      {/* Blob 1 — purple-magenta, top-left */}
      <div className="blob blob-1" />

      {/* Blob 2 — deep indigo, bottom-right */}
      <div className="blob blob-2" />

      {/* Blob 3 — violet-blue, mid-center */}
      <div className="blob blob-3" />
    </div>
  );
}
