export default function GlobalBackground() {
  return (
    <div
      id="global-bg"
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{
        zIndex: -1,
        backgroundColor: "var(--bg-canvas)",
        transition: "background-color 600ms ease",
      }}
    />
  );
}
