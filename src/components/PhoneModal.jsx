import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./PhoneModal.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const FALLBACK_IMAGE = "https://placehold.co/200";

const MODAL_ANIMATION = {
  initial:    { scale: 0.85, opacity: 0, y: 40 },
  animate:    { scale: 1,    opacity: 1, y: 0  },
  exit:       { scale: 0.85, opacity: 0, y: 20 },
  transition: { type: "spring", stiffness: 220, damping: 22 },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SpecsList({ specs }) {
  if (!specs || Object.keys(specs).length === 0)
    return <p className="no-specs">No specifications available.</p>;

  return (
    <div className="specs">
      {Object.entries(specs).map(([key, value]) => (
        <div key={key} className="spec-item">
          <span className="spec-key">{key}</span>
          <span className="spec-value">{value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PhoneModal({ phone, onClose }) {
  // ESC key + scroll lock
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Click-outside to close
  const handleOverlayClick = useCallback(
    (e) => { if (e.target === e.currentTarget) onClose(); },
    [onClose]
  );

  if (!phone) return null;

  return (
    <AnimatePresence>
      <div
        className="modal-overlay"
        onClick={handleOverlayClick}
        role="presentation"
      >
        <motion.div
          {...MODAL_ANIMATION}
          className="modal-box"
          role="dialog"
          aria-modal="true"
          aria-label={phone.phone_name}
        >
          {/* ── Close ── */}
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <span aria-hidden="true">✕</span>
          </button>

          {/* ── Image ── */}
          <div className="modal-img-container">
            <img
              src={phone.image || FALLBACK_IMAGE}
              alt={phone.phone_name}
              onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
            />
          </div>

          {/* ── Info ── */}
          <div className="modal-info">
            <p className="modal-brand">{phone.brand}</p>
            <h2 className="modal-title">{phone.phone_name}</h2>
          </div>

          {/* ── Specs ── */}
          <SpecsList specs={phone.specs} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}