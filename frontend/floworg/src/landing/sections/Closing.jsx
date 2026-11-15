/**
 * Closing Section (Step 1 placeholder)
 * Oxblood background, flower reappears. Full polish in step 8.
 */
import { useNavigate } from "react-router-dom";
import {
  CLOSING_H2,
  CLOSING_SUB,
  CTA_PRIMARY,
  CTA_LOGIN,
  EMAIL,
  PHONE,
  LINKEDIN_URL,
} from "../content";

export default function Closing({ flowerRef }) {
  const navigate = useNavigate();

  return (
    <section
      id="closing"
      aria-labelledby="closing-heading"
      style={{
        position: "relative",
        zIndex: 10,
        background: "var(--color-oxblood)",
        overflow: "hidden",
        padding: "clamp(80px, 12vw, 160px) 0",
      }}
    >
      {/* Flower bookend (smaller, bottom-right) */}
      <img
        ref={flowerRef}
        src="/flower-hero.webp"
        alt=""
        role="presentation"
        aria-hidden="true"
        style={{
          position: "absolute",
          right: "clamp(-80px, -4vw, -40px)",
          bottom: "clamp(-80px, -6vh, -40px)",
          width: "clamp(200px, 30vw, 480px)",
          height: "auto",
          opacity: 0.7,
          pointerEvents: "none",
          userSelect: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1600,
          margin: "0 auto",
          padding: "0 clamp(20px, 5vw, 48px)",
        }}
      >
        <h2
          id="closing-heading"
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: "clamp(2rem, 4.5vw, 3.75rem)",
            letterSpacing: "-0.02em",
            color: "var(--color-white)",
            margin: "0 0 1rem",
            maxWidth: "20ch",
          }}
        >
          {CLOSING_H2}
        </h2>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.25rem",
            lineHeight: 1.6,
            color: "var(--color-linen)",
            margin: "0 0 2.5rem",
          }}
        >
          {CLOSING_SUB}
        </p>

        {/* CTA group */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "3rem",
          }}
        >
          <a
            href="/signup"
            onClick={(e) => {
              e.preventDefault();
              navigate("/signup");
            }}
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
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.filter = "brightness(1.08)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.filter = "brightness(1)")
            }
            onFocus={(e) => {
              e.currentTarget.style.outline = "2px solid var(--color-linen)";
              e.currentTarget.style.outlineOffset = "2px";
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "none";
            }}
          >
            {CTA_PRIMARY}
          </a>

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
              textDecoration: "underline",
              textDecorationColor: "rgba(224,226,219,0.35)",
              textUnderlineOffset: "3px",
            }}
          >
            {CTA_LOGIN}
          </a>
        </div>

        {/* Contact row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <a
            href={`mailto:${EMAIL}`}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.25rem",
              color: "var(--color-linen)",
              textDecoration: "none",
              opacity: 0.75,
            }}
          >
            {EMAIL}
          </a>
          <a
            href={`tel:${PHONE}`}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.25rem",
              color: "var(--color-linen)",
              textDecoration: "none",
              opacity: 0.75,
            }}
          >
            {PHONE}
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.25rem",
              color: "var(--color-linen)",
              textDecoration: "none",
              opacity: 0.75,
            }}
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
