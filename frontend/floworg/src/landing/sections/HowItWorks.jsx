import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { ChevronDown } from "lucide-react";
import { HOW_H2, HOW_STEPS } from "../content";

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);        // animated SVG path element
  const lineWrapRef = useRef(null);    // SVG container (desktop)
  const lineVWrapRef = useRef(null);   // SVG container (mobile/vertical)
  const lineVRef = useRef(null);

  const scrollToTryIt = (e) => {
    e.preventDefault();
    document.getElementById("try-it")?.scrollIntoView({ behavior: "smooth" });
  };

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) {
        // Show the full line immediately
        if (lineRef.current) lineRef.current.style.strokeDashoffset = "0";
        if (lineVRef.current) lineVRef.current.style.strokeDashoffset = "0";
        return;
      }

      // Horizontal line (desktop — hidden on mobile via CSS)
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              end: "top 25%",
              scrub: 0.6,
            },
          }
        );
      }

      // Vertical line (mobile — hidden on desktop via CSS)
      if (lineVRef.current) {
        gsap.fromTo(
          lineVRef.current,
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              end: "center 40%",
              scrub: 0.6,
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  /* Inline style for the mobile/desktop SVG visibility */
  const mediaCss = `
    .how-line-h { display: block; }
    .how-line-v { display: none; }
    .how-steps  { flex-direction: row; }
    @media (max-width: 767px) {
      .how-line-h { display: none; }
      .how-line-v { display: block; }
      .how-steps  { flex-direction: column; }
    }
  `;

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      aria-labelledby="how-heading"
      style={{
        position: "relative",
        zIndex: 10,
        background: "var(--color-linen)",
        padding: "clamp(80px, 12vw, 160px) 0",
      }}
    >
      <style>{mediaCss}</style>

      <div
        style={{
          maxWidth: 1700,
          margin: "0 auto",
          padding: "0 clamp(20px, 5vw, 48px)",
        }}
      >
        {/* H2 */}
        <h2
          id="how-heading"
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 300,
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1.06,
            color: "var(--color-carbon)",
            margin: "0 0 4rem",
          }}
        >
          {HOW_H2}
        </h2>

        {/* ── Desktop: steps in a row with an SVG horizontal line ── */}
        <div style={{ position: "relative" }}>
          {/* Horizontal connecting line — desktop only */}
          <svg
            ref={lineWrapRef}
            className="how-line-h"
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 11,          /* aligns with centre of step number text */
              left: 0,
              right: 0,
              width: "100%",
              height: 2,
              overflow: "visible",
              pointerEvents: "none",
            }}
            preserveAspectRatio="none"
            viewBox="0 0 100 1"
          >
            {/* Static dim track */}
            <line
              x1="0" y1="0.5" x2="100" y2="0.5"
              stroke="var(--color-carbon)"
              strokeOpacity="0.12"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
            />
            {/* Animated fill */}
            <line
              ref={lineRef}
              x1="0" y1="0.5" x2="100" y2="0.5"
              stroke="var(--color-carbon)"
              strokeOpacity="0.5"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
              pathLength="1"
              style={{
                strokeDasharray: 1,
                strokeDashoffset: 1,
              }}
            />
          </svg>

          {/* Vertical connecting line — mobile only */}
          <svg
            ref={lineVWrapRef}
            className="how-line-v"
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 10,
              width: 2,
              height: "100%",
              overflow: "visible",
              pointerEvents: "none",
            }}
            preserveAspectRatio="none"
            viewBox="0 0 1 100"
          >
            <line
              x1="0.5" y1="0" x2="0.5" y2="100"
              stroke="var(--color-carbon)"
              strokeOpacity="0.12"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
            />
            <line
              ref={lineVRef}
              x1="0.5" y1="0" x2="0.5" y2="100"
              stroke="var(--color-carbon)"
              strokeOpacity="0.5"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
              pathLength="1"
              style={{
                strokeDasharray: 1,
                strokeDashoffset: 1,
              }}
            />
          </svg>

          {/* Steps */}
          <div
            className="how-steps"
            style={{
              display: "flex",
              gap: "clamp(2rem, 4vw, 4rem)",
            }}
          >
            {HOW_STEPS.map((step) => (
              <div
                key={step.num}
                style={{
                  flex: "1 1 220px",
                  paddingLeft: "0",
                }}
              >
                {/* Mono numeral */}
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontVariantNumeric: "tabular-nums",
                    fontSize: "0.8125rem",
                    color: "var(--color-carbon)",
                    opacity: 0.5,
                    display: "block",
                    marginBottom: "1.25rem",
                    letterSpacing: "0.04em",
                  }}
                >
                  {step.num}
                </span>

                {/* Step title */}
                <h3
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                    fontSize: "1.1875rem",
                    letterSpacing: "-0.01em",
                    color: "var(--color-carbon)",
                    margin: "0 0 0.5rem",
                  }}
                >
                  {step.title}
                </h3>

                {/* Step body */}
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    lineHeight: 1.65,
                    color: "var(--color-carbon)",
                    opacity: 0.72,
                    margin: 0,
                    maxWidth: "36ch",
                  }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Cue into next section ── */}
        <div
          style={{
            marginTop: "5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "0.4rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              fontSize: "0.9375rem",
              color: "var(--color-carbon)",
              opacity: 0.6,
            }}
          >
            Now try it yourself
          </span>
          <a
            href="#try-it"
            onClick={scrollToTryIt}
            aria-label="Scroll to interactive demo"
            style={{
              color: "var(--color-carbon)",
              lineHeight: 1,
              display: "inline-flex",
              outline: "none",
              borderRadius: 2,
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = "2px solid var(--color-carbon)";
              e.currentTarget.style.outlineOffset = "2px";
            }}
            onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
          >
            <ChevronDown size={22} strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </section>
  );
}
