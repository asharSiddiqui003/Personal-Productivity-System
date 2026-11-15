/**
 * Lenis smooth-scroll factory, synced with GSAP ScrollTrigger.
 * Call startLenis() inside a useEffect in Landing.jsx and return the cleanup.
 * Skip entirely when prefers-reduced-motion is set.
 *
 * getLenis() — module-level getter so other modules can call lenis.scrollTo().
 */
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "../lib/gsap";

/** The active Lenis instance (null before startLenis / after cleanup). */
let _lenis = null;

/** Returns the active Lenis instance, or null if not running. */
export function getLenis() {
  return _lenis;
}

export function startLenis() {
  // Respect reduced-motion preference
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return () => {};
  }

  _lenis = new Lenis({ lerp: 0.1, smoothWheel: true, autoRaf: false });

  // Keep ScrollTrigger in sync with Lenis scroll position
  _lenis.on("scroll", ScrollTrigger.update);

  // Drive Lenis from GSAP's RAF loop
  const tick = (t) => _lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  // Return cleanup — called when Landing unmounts (route change)
  return () => {
    gsap.ticker.remove(tick);
    _lenis.destroy();
    _lenis = null;
  };
}
