import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { useNavigate } from "react-router-dom";
import { CTA_LOGIN } from "../content";

export default function LandingNavbar() {
  const navigate = useNavigate();
  const headerRef = useRef(null);
  // Track surface so focus rings use the right colour
  const surfaceRef = useRef("oxblood"); // "oxblood" | "carbon"
  // Track hide state to avoid redundant GSAP calls
  const hiddenRef = useRef(false);
  const lastYRef = useRef(0);

  useGSAP(
    () => {
      const nav = headerRef.current;
      if (!nav) return;

      // ── 1. Solid Carbon once Section 2 top reaches nav bottom ────────────
      const whatsInside = document.getElementById("whats-inside");
      if (whatsInside) {
        ScrollTrigger.create({
          trigger: whatsInside,
          // "top 68px" = section-top hits the 68px-tall nav's bottom edge
          start: "top 68px",
          onEnter: () => {
            gsap.to(nav, {
              backgroundColor: "var(--color-carbon)",
              duration: 0.25,
              ease: "none",
              overwrite: "auto",
            });
            nav.style.borderBottom = "1px solid var(--border)";
            surfaceRef.current = "carbon";
          },
          onLeaveBack: () => {
            gsap.to(nav, {
              backgroundColor: "transparent",
              duration: 0.25,
              ease: "none",
              overwrite: "auto",
            });
            nav.style.borderBottom = "none";
            surfaceRef.current = "oxblood";
          },
        });
      }

      // ── 2. Hide on scroll-down, show on scroll-up (transform only) ───────
      let ticking = false;

      const handleScroll = () => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const delta = currentY - lastYRef.current;

          // Only hide after scrolling more than 80px from top (avoid hiding on micro-bounce)
          if (delta > 6 && currentY > 80 && !hiddenRef.current) {
            gsap.to(nav, {
              y: -nav.offsetHeight,
              duration: 0.22,
              ease: "power2.in",
              overwrite: "auto",
            });
            hiddenRef.current = true;
          } else if (delta < -4 && hiddenRef.current) {
            gsap.to(nav, {
              y: 0,
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto",
            });
            hiddenRef.current = false;
          }

          lastYRef.current = currentY;
          ticking = false;
        });
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      // Return cleanup — useGSAP also kills all ScrollTriggers on unmount
      return () => window.removeEventListener("scroll", handleScroll);
    },
    { scope: headerRef, dependencies: [] }
  );

  // Focus ring colour depends on current surface
  const getFocusRing = () =>
    surfaceRef.current === "carbon"
      ? "2px solid var(--color-saffron)"
      : "2px solid var(--color-linen)";

  return (
    <header
      id="landing-nav"
      ref={headerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "transparent",
        borderBottom: "none",
        // CSS transition handles the border-bottom colour change;
        // GSAP handles background (animated) and transform (hide/show).
        transition: "border-color 250ms",
        willChange: "transform",
      }}
    >
      {/* Inner container — matches all section containers exactly */}
      <div
        style={{
          maxWidth: 1800,
          margin: "0 auto",
          padding: "0 clamp(20px, 5vw, 48px)",
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Wordmark */}
        <a
          href="#top"
          aria-label="FlowOrg home"
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: "1.5rem",
            color: "var(--color-white)",
            textDecoration: "none",
            letterSpacing: "-0.02em",
            outline: "none",
            borderRadius: 2,
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = getFocusRing();
            e.currentTarget.style.outlineOffset = "3px";
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = "none";
          }}
        >
          FlowOrg
        </a>

        {/* Login link */}
        <a
          href="/login"
          onClick={(e) => {
            e.preventDefault();
            navigate("/login");
          }}
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            fontSize: "1.25rem",
            color: "var(--color-linen)",
            textDecoration: "none",
            opacity: 0.75,
            transition: "opacity 150ms",
            outline: "none",
            borderRadius: 2,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.75")}
          onFocus={(e) => {
            e.currentTarget.style.outline = getFocusRing();
            e.currentTarget.style.outlineOffset = "3px";
            e.currentTarget.style.opacity = "1";
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = "none";
            e.currentTarget.style.opacity = "0.75";
          }}
        >
          {CTA_LOGIN}
        </a>
      </div>
    </header>
  );
}
