import { motion, AnimatePresence } from "framer-motion";
import "./Toast.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOAST_ICONS = {
  success: "ti-circle-check",
  error:   "ti-circle-x",
};

const TOAST_ANIMATION = {
  initial:    { opacity: 0, y: -16, x: 20  },
  animate:    { opacity: 1, y: 0,   x: 0   },
  exit:       { opacity: 0, y: -10, x: 20  },
  transition: { duration: 0.25, ease: "easeOut" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Toast({ message, type = "success", show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          {...TOAST_ANIMATION}
          className={`toast toast--${type}`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="toast-icon" aria-hidden="true">
            <i className={`ti ${TOAST_ICONS[type]}`} />
          </span>
          <span className="toast-message">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}