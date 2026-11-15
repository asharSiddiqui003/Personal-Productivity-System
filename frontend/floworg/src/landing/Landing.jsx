/**
 * Landing.jsx — Root composer
 *
 * ── DOM structure (per DESIGN.md §7.1) ───────────────────────────────────────
 *
 *   <div.landing-root>                  ← overflow-x: clip only
 *     <LandingNavbar />
 *     <main class="relative bg-carbon"> ← page bg is Carbon; hero dissolves INTO this
 *       <section#hero sticky z-20 />    ← sits ON TOP; fades out (hero + flower + text)
 *       <section#whats-inside z-10 />   ← Carbon bg; rises as hero fades
 *       <section#how-it-works />
 *       <section#try-it />
 *       <section#closing />
 *     </main>
 *     <Footer />
 *   </div>
 *
 * ── Why this works ─────────────────────────────────────────────────────────
 *   Hero is sticky inside <main> which is taller than 100svh (it holds all
 *   sections). As you scroll, the HERO STAYS PINNED while the Carbon sections
 *   underneath it scroll into view. GSAP then fades the oxblood bg + flower +
 *   text to transparent, revealing the Carbon that was always there behind it.
 *
 * ── Ancestor overflow rules ─────────────────────────────────────────────────
 *   <main>, .landing-root, #root, <body>, <html> must NOT have
 *   overflow: hidden | auto | scroll. Use overflow-x: clip if needed.
 *   No transform on any ancestor of hero.
 */
import { useEffect } from "react";
import { startLenis } from "./hooks/useLenis";
import LandingNavbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import WhatsInside from "./sections/WhatsInside";
import HowItWorks from "./sections/HowItWorks";
import TryIt from "./sections/TryIt";
import Closing from "./sections/Closing";
import Footer from "./sections/Footer";
import "./lib/gsap"; // register plugins once

export default function Landing() {
  // Lenis lifecycle: start when Landing mounts, destroy on unmount
  useEffect(() => {
    const cleanup = startLenis();
    return cleanup;
  }, []);

  return (
    <div
      className="landing-root"
      style={{
        // Must NOT be overflow: hidden or auto — use clip for horizontal only
        overflowX: "clip",
      }}
    >
      {/* Skip link */}
      <a
        href="#hero"
        className="sr-only focus:not-sr-only"
        style={{
          position: "fixed",
          top: "1rem",
          left: "1rem",
          zIndex: 200,
          background: "var(--color-saffron)",
          color: "var(--color-carbon)",
          padding: "0.5rem 1rem",
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          borderRadius: "var(--radius)",
          textDecoration: "none",
          transform: "translateY(-120%)",
          transition: "transform 150ms",
        }}
        onFocus={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        onBlur={(e) =>
          (e.currentTarget.style.transform = "translateY(-120%)")
        }
      >
        Skip to content
      </a>

      <LandingNavbar />

      {/*
       * ★ CRITICAL: <main> is the ONE shared parent for the hero and all sections.
       *   - bg-carbon so a transparent hero reveals carbon beneath
       *   - position: relative so sticky works (sticky needs a scrolling ancestor)
       *   - NO overflow property (would break sticky)
       *   - NO transform (would break sticky)
       */}
      <main
        id="main-content"
        style={{
          position: "relative",
          background: "var(--color-carbon)",
          // No overflow set here — sticky requires the parent to scroll normally
        }}
      >
        <Hero />
        <WhatsInside />
        <HowItWorks />
        <TryIt />
        <Closing />
      </main>

      <Footer />
    </div>
  );
}
