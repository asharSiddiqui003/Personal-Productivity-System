import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { useNavigate } from "react-router-dom";
import flowerImg from "../../assets/flower_image.png";
import { HERO_SUB, CTA_PRIMARY, CTA_SECONDARY } from "../content";

export default function Hero() {
  const navigate = useNavigate();

  // All refs are local — Hero owns the full animation
  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const flowerContainerRef = useRef(null);
  const flowerRef = useRef(null);
  const topLeftRef = useRef(null);
  const bottomRightRef = useRef(null);
  const ctaRef = useRef(null);

  const scrollToHowItWorks = (e) => {
    e.preventDefault();
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  // ── GSAP scroll-linked dissolve ───────────────────────────────────────────
  useGSAP(
    () => {
      if (
        !bgRef.current ||
        !flowerRef.current ||
        !topLeftRef.current ||
        !bottomRightRef.current
      ) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        flowerRef.current.style.willChange = "transform, opacity";

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "#whats-inside",
            start: "top bottom",
            end: "top top",
            scrub: true,
            onUpdate: (self) => {
              if (ctaRef?.current) {
                ctaRef.current.style.pointerEvents =
                  self.progress > 0.5 ? "none" : "auto";
              }
            },
            onLeave: () => {
              if (heroRef.current) gsap.set(heroRef.current, { autoAlpha: 0 });
            },
            onEnterBack: () => {
              if (heroRef.current) gsap.set(heroRef.current, { autoAlpha: 1 });
            },
          },
        });

        tl
          // Background fades over full range
          .to(bgRef.current,
            { opacity: 0, ease: "none", duration: 1 },
            0
          )
          // Flower: pseudo-3D turn + fade over full range
          .to(flowerRef.current,
            { rotateY: 28, rotateX: -6, x: -40, scale: 1.08, opacity: 0, ease: "none", duration: 1 },
            0
          )
          // Top-left text: drifts up-left + fades — done at 50%
          .to(topLeftRef.current,
            { opacity: 0, x: -32, y: -24, ease: "none", duration: 0.5 },
            0
          )
          // Bottom-right text: drifts down-right + fades — done at 50%
          .to(bottomRightRef.current,
            { opacity: 0, x: 32, y: 24, ease: "none", duration: 0.5 },
            0
          );

        return () => {
          tl.kill();
          if (flowerRef.current) flowerRef.current.style.willChange = "auto";
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => { });

      return () => mm.revert();
    },
    { dependencies: [] }
  );

  // Refresh ScrollTrigger after fonts + image are ready
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      document.fonts.ready,
      flowerRef.current?.decode?.() ?? Promise.resolve(),
    ]).then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      aria-label="Hero"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        height: "100svh",
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* ── 0. Oxblood background ── */}
      <div
        ref={bgRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--color-oxblood)",
          zIndex: 0,
        }}
      />

      <div
        ref={flowerContainerRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translateX(-50%) translateY(-40%)",
          width: "clamp(1300px, 98vw, 2000px)",
          perspective: "1200px",
          perspectiveOrigin: "50% 85%",
          zIndex: 1,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <img
          ref={flowerRef}
          src={flowerImg}
          alt=""
          role="presentation"
          aria-hidden="true"
          decoding="async"
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            transformOrigin: "50% 85%",
            transform: "rotateY(-20deg) rotateX(0deg)",
            filter: "brightness(0.82)",
            mixBlendMode: "screen",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      </div>

      {/*
       * ── 2. Top-left — setup phrase ────────────────────────────────────────
       * "Tasks, habits, and the timer." — editorial label scale, not punchline.
       * Sits just below the fixed navbar (68px) + breathing room.
       */}
      <div
        ref={topLeftRef}
        style={{
          position: "absolute",
          top: "clamp(84px, 10vh, 120px)",
          left: "clamp(24px, 5vw, 72px)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        {/*
         * Rendered as three lines at this size:
         *   "Tasks, habits,"
         *   "and the timer."
         */}
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: "clamp(3rem, 4.5vw, 4rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            color: "var(--color-white)",
            margin: "0 0 1.25rem",
          }}
        >
          Tasks, habits,
          <br />
          and the timer.
        </p>

        {/* Subhead — small, below the setup phrase */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 400,
            fontSize: "clamp(1.5rem, 0.9vw, 3rem)",
            lineHeight: 1.55,
            color: "var(--color-linen)",
            opacity: 0.7,
            margin: "0.75rem 0 0",
            maxWidth: "34ch",
          }}
        >
          {HERO_SUB}
        </p>
      </div>

      {/*
       * ── 3. Bottom-right — punchline + CTA ────────────────────────────────
       * "One tab." — the knockout closing line, large bold display.
       * CTA sits directly below it, right-aligned.
       */}
      <div
        ref={bottomRightRef}
        style={{
          position: "absolute",
          bottom: "clamp(28px, 5vh, 64px)",
          right: "clamp(24px, 5vw, 72px)",
          textAlign: "right",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        {/* The punchline */}
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: "clamp(3rem, 7.5vw, 6rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            color: "var(--color-white)",
            margin: "0 0 1.25rem",
          }}
        >
          One tab.
        </h1>

        {/* CTA group */}
        <div
          ref={ctaRef}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "0.75rem",
            pointerEvents: "auto",
          }}
        >
          {/* Primary */}
          <a
            href="/signup"
            onClick={(e) => { e.preventDefault(); navigate("/signup"); }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "var(--color-saffron)",
              color: "var(--color-carbon)",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "1.15rem",
              padding: "0.875rem 1.75rem",
              borderRadius: "var(--radius)",
              textDecoration: "none",
              transition: "filter 150ms",
              outline: "none",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
            onFocus={(e) => {
              e.currentTarget.style.outline = "2px solid var(--color-linen)";
              e.currentTarget.style.outlineOffset = "2px";
            }}
            onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
          >
            {CTA_PRIMARY}
          </a>

          {/* Secondary */}
          <a
            href="#how-it-works"
            onClick={scrollToHowItWorks}
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              fontSize: "1.15rem",
              color: "var(--color-linen)",
              textDecoration: "underline",
              textDecorationColor: "rgba(224,226,219,0.35)",
              textUnderlineOffset: "3px",
              outline: "none",
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = "2px solid var(--color-linen)";
              e.currentTarget.style.outlineOffset = "2px";
            }}
            onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
          >
            {CTA_SECONDARY}
          </a>
        </div>
      </div>

      {/* Mobile: stack vertically */}
      <style>{`
        @media (max-width: 640px) {
          /* Shrink flower */
          #hero [data-flower-container],
          #hero > div:nth-child(2) {
            width: clamp(260px, 80vw, 340px) !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            bottom: -40px !important;
          }
          /* Pull punchline up on small screens */
          #hero > div:last-of-type {
            bottom: 16px !important;
            right: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
