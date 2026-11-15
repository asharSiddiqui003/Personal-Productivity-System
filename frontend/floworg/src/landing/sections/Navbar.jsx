import { useRef, useState, useEffect, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CTA_LOGIN } from "../content";
import { getLenis } from "../hooks/useLenis";

// ── Nav link definitions ───────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Home", id: "home", sectionId: "home" },
  { label: "What's inside", id: "whats-inside", sectionId: "whats-inside" },
  { label: "How it works", id: "how-it-works", sectionId: "how-it-works" },
  { label: "Try it yourself", id: "try-it", sectionId: "try-it" },
  { label: "Contact us", id: "contact", sectionId: "contact" },
];

// ── Injected CSS (focus-visible only, no inline onFocus/onBlur duplication) -

const NAV_CSS = `
  .nav-link {
    font-family: var(--font-body);
    font-weight: 500;
    font-size: 1.15rem;
    color: rgba(224,226,219,0.75);
    text-decoration: none;
    white-space: nowrap;
    position: relative;
    padding-bottom: 2px;
    transition: color 150ms;
    outline: none;
    border-radius: 2px;
  }
  .nav-link::after {
    content: "";
    position: absolute;
    left: 0; right: 0; bottom: -2px;
    height: 2px;
    background: var(--nav-underline, var(--color-saffron));
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 150ms;
  }
  .nav-link:hover { color: var(--color-white); }
  .nav-link[aria-current="true"] {
    color: var(--color-white);
  }
  .nav-link[aria-current="true"]::after {
    transform: scaleX(1);
  }
  .nav-link:focus-visible {
    outline: 2px solid var(--nav-focus-ring, var(--color-saffron));
    outline-offset: 3px;
  }
  .nav-login-link {
    font-family: var(--font-body);
    font-weight: 500;
    font-size: 1.25rem;
    color: rgba(224,226,219,0.75);
    text-decoration: none;
    transition: color 150ms, opacity 150ms;
    outline: none;
    border-radius: 2px;
  }
  .nav-login-link:hover { color: var(--color-white); opacity: 1; }
  .nav-login-link:focus-visible {
    outline: 2px solid var(--nav-focus-ring, var(--color-saffron));
    outline-offset: 3px;
  }
  /* Mobile menu link */
  .nav-mobile-link {
    display: flex;
    align-items: center;
    min-height: 48px;
    font-family: var(--font-body);
    font-weight: 500;
    font-size: 1rem;
    color: rgba(224,226,219,0.75);
    text-decoration: none;
    padding: 0 clamp(20px, 5vw, 48px);
    border-bottom: 1px solid var(--border);
    transition: color 150ms, background 150ms;
    outline: none;
    border-radius: 0;
  }
  .nav-mobile-link:hover,
  .nav-mobile-link[aria-current="true"] { color: var(--color-white); background: rgba(224,226,219,0.04); }
  .nav-mobile-link:focus-visible {
    outline: 2px solid var(--color-saffron);
    outline-offset: -2px;
  }
  @media (min-width: 900px) {
    .nav-mobile-only { display: none !important; }
  }
  @media (max-width: 899px) {
    .nav-desktop-links { display: none !important; }
  }
`;

// ── Helper: scroll to a section or the bottom ─────────────────────────────

function useNavScroll({ navScrollingRef, hiddenRef, navEl }) {
  const scrollTo = useCallback(
    (sectionId) => {
      const lenis = getLenis();

      // Keep nav visible during jump
      if (navEl.current) {
        gsap.to(navEl.current, { y: 0, duration: 0.2, ease: "power2.out", overwrite: "auto" });
      }
      hiddenRef.current = false;
      navScrollingRef.current = true;

      const done = () => {
        navScrollingRef.current = false;
      };

      if (sectionId === "home" || sectionId === "hero") {
        // Scroll to top
        if (lenis) {
          lenis.scrollTo(0, { duration: 1.1, onComplete: done });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
          done();
        }
        setTimeout(done, 1300);
        return;
      }

      if (sectionId === "contact") {
        const el = document.getElementById("contact");
        if (el) {
          if (lenis) {
            lenis.scrollTo(el, { offset: 0, duration: 1.1, onComplete: done });
          } else {
            el.scrollIntoView({ behavior: "auto" });
            done();
          }
        } else {
          // Scroll to page bottom
          if (lenis) {
            lenis.scrollTo(document.body.scrollHeight, { duration: 1.1, onComplete: done });
          } else {
            window.scrollTo({ top: document.body.scrollHeight, behavior: "auto" });
            done();
          }
        }
        return;
      }

      const el = document.getElementById(sectionId);
      if (!el) { done(); return; }

      if (lenis) {
        lenis.scrollTo(el, { offset: 0, duration: 1.1, onComplete: done });
      } else {
        el.scrollIntoView({ behavior: "auto" });
        done();
      }

      // 1200ms timeout fallback in case onComplete never fires
      setTimeout(done, 1300);
    },
    [navEl, hiddenRef, navScrollingRef]
  );

  return scrollTo;
}

// ── Main component ─────────────────────────────────────────────────────────

export default function LandingNavbar() {
  const navigate = useNavigate();
  const headerRef = useRef(null);

  // Surface tracking for focus ring / underline colour CSS vars
  const surfaceRef = useRef("oxblood"); // "oxblood" | "carbon"

  // Hide/show state
  const hiddenRef = useRef(false);
  const lastYRef = useRef(0);

  // Nav-triggered scroll: suppress hide logic while true
  const navScrollingRef = useRef(false);

  // Active link tracking (by sectionId key)
  const [activeSection, setActiveSection] = useState("home");

  // Mobile menu
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef(null);

  const scrollTo = useNavScroll({ navScrollingRef, hiddenRef, navEl: headerRef });

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Close menu on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useGSAP(
    () => {
      const nav = headerRef.current;
      if (!nav) return;

      // ── 1. Solid Carbon once #whats-inside top reaches nav bottom ─────────
      const whatsInside = document.getElementById("whats-inside");
      if (whatsInside) {
        ScrollTrigger.create({
          trigger: whatsInside,
          start: "top 68px",
          onEnter: () => {
            gsap.to(nav, { backgroundColor: "var(--color-carbon)", duration: 0.25, ease: "none", overwrite: "auto" });
            nav.style.borderBottom = "1px solid var(--border)";
            surfaceRef.current = "carbon";
            // Update CSS vars for underline / focus ring
            nav.style.setProperty("--nav-underline", "var(--color-saffron)");
            nav.style.setProperty("--nav-focus-ring", "var(--color-saffron)");
          },
          onLeaveBack: () => {
            gsap.to(nav, { backgroundColor: "transparent", duration: 0.25, ease: "none", overwrite: "auto" });
            nav.style.borderBottom = "none";
            surfaceRef.current = "oxblood";
            nav.style.setProperty("--nav-underline", "var(--color-linen)");
            nav.style.setProperty("--nav-focus-ring", "var(--color-linen)");
          },
        });
      }

      // ── 2. Active section ScrollTriggers ──────────────────────────────────
      const sectionMap = [
        { sectionId: "whats-inside", key: "whats-inside" },
        { sectionId: "how-it-works", key: "how-it-works" },
        { sectionId: "try-it", key: "try-it" },
        { sectionId: "contact", key: "contact" },
      ];

      sectionMap.forEach(({ sectionId, key }) => {
        const el = document.getElementById(sectionId);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: ({ isActive }) => {
            if (isActive) {
              setActiveSection(key);
            } else {
              // If nothing else is active, home wins — handled via "home" fallback below
              setActiveSection((prev) => (prev === key ? "__recalc__" : prev));
            }
          },
        });
      });

      // ── 3. Hide on scroll-down, show on scroll-up ─────────────────────────
      let ticking = false;
      const handleScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const delta = currentY - lastYRef.current;

          // Contact active near page bottom (within 80px)
          const nearBottom = window.innerHeight + currentY >= document.body.scrollHeight - 80;
          if (nearBottom) {
            setActiveSection("contact");
          }

          if (!navScrollingRef.current) {
            if (delta > 6 && currentY > 80 && !hiddenRef.current) {
              gsap.to(nav, { y: -nav.offsetHeight, duration: 0.22, ease: "power2.in", overwrite: "auto" });
              hiddenRef.current = true;
            } else if (delta < -4 && hiddenRef.current) {
              gsap.to(nav, { y: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
              hiddenRef.current = false;
            }
          }

          lastYRef.current = currentY;
          ticking = false;
        });
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    },
    { scope: headerRef, dependencies: [] }
  );

  // Resolve "__recalc__" to "home" if no trigger fired
  const resolvedActive = activeSection === "__recalc__" ? "home" : activeSection;

  // ── Link click handler ────────────────────────────────────────────────────
  const handleLinkClick = useCallback(
    (e, sectionId) => {
      e.preventDefault();
      setMenuOpen(false);
      scrollTo(sectionId);
    },
    [scrollTo]
  );

  const handleLoginClick = useCallback(
    (e) => {
      e.preventDefault();
      setMenuOpen(false);
      navigate("/login");
    },
    [navigate]
  );

  // ── Mobile menu: close when focus leaves the panel ───────────────────────
  const menuPanelRef = useRef(null);
  const handleMenuBlur = useCallback((e) => {
    // If focus moves outside both the menu button and the panel, close
    if (
      menuBtnRef.current?.contains(e.relatedTarget) ||
      menuPanelRef.current?.contains(e.relatedTarget)
    ) return;
    setMenuOpen(false);
  }, []);

  return (
    <>
      <style>{NAV_CSS}</style>

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
          transition: "border-color 250ms",
          willChange: "transform",
          // Initial CSS vars
          "--nav-underline": "var(--color-linen)",
          "--nav-focus-ring": "var(--color-linen)",
        }}
      >
        <nav
          aria-label="Primary"
          style={{
            width: "100%",
            padding: "0 clamp(24px, 5vw, 72px)",
            height: 68,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* ── Logo / wordmark ─────────────────────────────────────────── */}
          <a
            href="#hero"
            aria-label="FlowOrg — scroll to top"
            className="nav-link"
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "2rem",
              color: "var(--color-white)",
              letterSpacing: "-0.02em",
              flexShrink: 0,
            }}
            onClick={(e) => handleLinkClick(e, "home")}
          >
            FlowOrg
          </a>

          {/* ── Desktop in-page links (hidden on mobile) ─────────────────── */}
          <div
            className="nav-desktop-links"
            style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}
          >
            {NAV_LINKS.map(({ label, id, sectionId }) => (
              <a
                key={id}
                href={`#${sectionId === "home" ? "hero" : sectionId}`}
                className="nav-link"
                aria-current={resolvedActive === id ? "true" : undefined}
                onClick={(e) => handleLinkClick(e, sectionId)}
              >
                {label}
              </a>
            ))}

            {/* Separator */}
            <span
              aria-hidden="true"
              style={{
                width: 1,
                height: 20,
                background: "var(--border-strong)",
                flexShrink: 0,
                marginLeft: "0.25rem",
              }}
            />

            {/* Login */}
            <a
              href="/login"
              className="nav-login-link"
              onClick={handleLoginClick}
            >
              {CTA_LOGIN}
            </a>
          </div>

          {/* ── Mobile menu button (hidden on desktop) ───────────────────── */}
          <div
            className="nav-mobile-only"
            style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}
          >
            <button
              ref={menuBtnRef}
              aria-expanded={menuOpen}
              aria-controls="nav-mobile-panel"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((o) => !o)}
              style={{
                background: "transparent",
                border: "1px solid var(--border-strong)",
                borderRadius: 6,
                color: "var(--color-linen)",
                padding: "0.4rem 0.75rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                cursor: "pointer",
                outline: "none",
              }}
              onFocus={(e) => (e.currentTarget.style.outline = "2px solid var(--nav-focus-ring, var(--color-saffron))")}
              onBlur={(e) => {
                e.currentTarget.style.outline = "none";
                handleMenuBlur(e);
              }}
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile menu panel ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="nav-mobile-panel"
            ref={menuPanelRef}
            role="dialog"
            aria-label="Navigation menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onBlur={handleMenuBlur}
            style={{
              position: "fixed",
              top: 68,
              left: 0,
              right: 0,
              zIndex: 49,
              background: "var(--color-carbon)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            {NAV_LINKS.map(({ label, id, sectionId }) => (
              <a
                key={id}
                href={`#${sectionId === "home" ? "hero" : sectionId}`}
                className="nav-mobile-link"
                aria-current={resolvedActive === id ? "true" : undefined}
                onClick={(e) => {
                  handleLinkClick(e, sectionId);
                  menuBtnRef.current?.focus();
                }}
              >
                {label}
              </a>
            ))}
            <a
              href="/login"
              className="nav-mobile-link"
              style={{ borderBottom: "none" }}
              onClick={(e) => {
                handleLoginClick(e);
                menuBtnRef.current?.focus();
              }}
            >
              {CTA_LOGIN}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
