import { useState, useEffect } from "react";
import "./Navbar.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Home",       href: "/"         },
  { label: "Reviews",    href: "/reviews"  },
  { label: "Favorites",    href: "/favorites"  },
  { label: "News",       href: "/news"     },
  { label: "Deals",      href: "/deals"    },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Navbar() {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  // Add a shadow + blur when the user scrolls down
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
      {/* Tri-colour accent bar — mirrors Footer */}
      <div className="navbar-accent" aria-hidden="true">
        <span /><span /><span />
      </div>

      <div className="navbar-container">
        {/* ── Brand ── */}
        <a href="/" className="navbar-brand" aria-label="Phone Arena home">
          <span className="navbar-logo" aria-hidden="true">📱</span>
          <span className="navbar-site-name">
            Phone<strong>Arena</strong>
          </span>
        </a>

        {/* ── Desktop nav ── */}
        <nav className="navbar-links" aria-label="Primary navigation">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href} className="navbar-link">
              {label}
            </a>
          ))}
        </nav>

        {/* ── CTA ── */}
        <a href="/compare" className="navbar-cta" aria-label="Compare phones">
          Compare
        </a>

        {/* ── Hamburger (mobile) ── */}
        <button
          className={`navbar-hamburger${menuOpen ? " is-open" : ""}`}
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      <nav
        id="mobile-menu"
        className={`navbar-mobile${menuOpen ? " is-open" : ""}`}
        aria-label="Mobile navigation"
      >
        {NAV_LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="navbar-mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </a>
        ))}
        <a href="/compare" className="navbar-mobile-cta" onClick={() => setMenuOpen(false)}>
          Compare Phones
        </a>
      </nav>
    </header>
  );
}