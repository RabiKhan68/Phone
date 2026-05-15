import "./Footer.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear();

const FOOTER_LINKS = [
  { label: "Privacy Policy",   href: "/privacy"  },
  { label: "Terms of Service", href: "/terms"    },
  { label: "Contact",          href: "/contact"  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="footer">
      {/* Decorative top border accent */}
      <div className="footer-accent" aria-hidden="true">
        <span /><span /><span />
      </div>

      <div className="footer-container">
        {/* Brand + copyright */}
        <div className="footer-brand">
          <span className="footer-logo" aria-hidden="true">📱</span>
          <p className="footer-text">
            &copy; {CURRENT_YEAR}{" "}
            <strong className="footer-name">Phone Arena</strong>
            <span className="footer-divider" aria-hidden="true"> · </span>
            Built by <span className="footer-author">Rabi Khan</span>
          </p>
        </div>

        {/* Navigation */}
        <nav className="footer-links" aria-label="Footer navigation">
          {FOOTER_LINKS.map(({ label, href }) => (
            <a key={label} href={href} className="footer-link">
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}