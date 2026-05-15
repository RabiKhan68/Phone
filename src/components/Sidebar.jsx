import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { to: "/",          label: "Dashboard", icon: "ti-layout-dashboard" },
  { to: "/phones",    label: "Phones",    icon: "ti-device-mobile"    },
  { to: "/favorites", label: "Favorites", icon: "ti-heart"            },
  { to: "/settings",  label: "Settings",  icon: "ti-settings"         },
];

const SIDEBAR_ANIMATION = {
  initial:    { x: -280, opacity: 0.6 },
  animate:    { x: 0,    opacity: 1   },
  exit:       { x: -280, opacity: 0   },
  transition: { type: "spring", stiffness: 260, damping: 28 },
};

const OVERLAY_ANIMATION = {
  initial:    { opacity: 0 },
  animate:    { opacity: 1 },
  exit:       { opacity: 0 },
  transition: { duration: 0.2 },
};

const getActiveClass = ({ isActive }) =>
  isActive ? "sidebar-link sidebar-link--active" : "sidebar-link";

// ─── Component ────────────────────────────────────────────────────────────────

export default function Sidebar({ isOpen, onClose }) {
  // ESC key to close + scroll lock while open
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            {...OVERLAY_ANIMATION}
            className="sidebar-overlay"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* ── Sidebar panel ── */}
          <motion.aside
            {...SIDEBAR_ANIMATION}
            className="sidebar"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            {/* Tri-colour accent bar */}
            <div className="sidebar-accent" aria-hidden="true">
              <span /><span /><span />
            </div>

            {/* Header */}
            <div className="sidebar-header">
              <span className="sidebar-logo" aria-hidden="true">📱</span>
              <span className="sidebar-brand">
                Phone<strong>Arena</strong>
              </span>
              <button
                className="sidebar-close-btn"
                onClick={onClose}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* Nav */}
            <nav className="sidebar-nav" aria-label="Sidebar navigation">
              <ul className="sidebar-list">
                {NAV_LINKS.map(({ to, label, icon }, index) => (
                  <li key={to} className="sidebar-item">
                    {/* Divider before Settings */}
                    {index === NAV_LINKS.length - 1 && (
                      <div className="sidebar-divider" aria-hidden="true" />
                    )}
                    <NavLink
                      to={to}
                      className={getActiveClass}
                      onClick={onClose}
                      end={to === "/"}
                    >
                      <span className="sidebar-icon" aria-hidden="true">
                        <i className={`ti ${icon}`} />
                      </span>
                      <span className="sidebar-label">{label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Footer credit */}
            <p className="sidebar-footer">Built by <span>Rabi Khan</span></p>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}