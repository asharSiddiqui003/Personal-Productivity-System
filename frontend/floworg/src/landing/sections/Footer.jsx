import { useNavigate } from "react-router-dom";
import {
  EMAIL,
  PHONE,
  LINKEDIN_URL,
  YOUR_NAME,
  PORTFOLIO_URL,
  FOOTER_YEAR,
} from "../content";

export default function Footer() {
  const navigate = useNavigate();

  const linkStyle = {
    fontFamily: "var(--font-body)",
    fontSize: "1.25rem",
    color: "var(--color-linen)",
    textDecoration: "none",
    opacity: 0.65,
    display: "block",
    marginBottom: "0.5rem",
    transition: "opacity 150ms",
  };

  const colHeadStyle = {
    fontFamily: "var(--font-body)",
    fontWeight: 600,
    fontSize: "1.5rem",
    color: "var(--color-linen)",
    letterSpacing: "0.03em",
    opacity: 0.45,
    marginBottom: "1rem",
    display: "block",
  };

  return (
    <footer
      id="footer"
      aria-label="Footer"
      style={{
        position: "relative",
        zIndex: 10,
        background: "var(--color-carbon)",
        borderTop: "1px solid var(--border)",
        padding: "clamp(48px, 6vw, 80px) 0 clamp(32px, 4vw, 48px)",
      }}
    >
      <div
        style={{
          maxWidth: 1800,
          margin: "0 auto",
          padding: "0 clamp(20px, 5vw, 48px)",
        }}
      >
        {/* Three columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "2rem",
            marginBottom: "3rem",
          }}
        >
          {/* Contact */}
          <div>
            <span style={colHeadStyle}>Contact</span>
            <a href={`mailto:${EMAIL}`} style={linkStyle}>
              {EMAIL}
            </a>
            <a href={`tel:${PHONE}`} style={linkStyle}>
              {PHONE}
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              LinkedIn
            </a>
          </div>

          {/* Product */}
          <div>
            <span style={colHeadStyle}>Product</span>
            <a
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
              style={linkStyle}
            >
              Login
            </a>
            <a
              href="/signup"
              onClick={(e) => {
                e.preventDefault();
                navigate("/signup");
              }}
              style={linkStyle}
            >
              Sign up
            </a>
          </div>

          {/* Credit */}
          <div>
            <span style={colHeadStyle}>Credit</span>
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              Built by {YOUR_NAME}
            </a>
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              Hemakshi Mehta
            </a>
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              Jasmine Khan
            </a>
          </div>
        </div>

        {/* Bottom line */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            color: "var(--color-linen)",
            opacity: 0.35,
            margin: 0,
          }}
        >
          © {FOOTER_YEAR} FlowOrg
        </p>
      </div>
    </footer>
  );
}
