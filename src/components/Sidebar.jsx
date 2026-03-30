import { motion, AnimatePresence } from "framer-motion";
import "./Sidebar.css";

export default function Sidebar({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* OVERLAY */}
          <div className="sidebar-overlay" onClick={onClose}></div>

          {/* SIDEBAR PANEL */}
          <motion.aside
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ duration: 0.3 }}
            className="sidebar"
          >
            <h2 className="sidebar-title">Menu</h2>

            <ul>
              <li>🏠 Dashboard</li>
              <li>📱 Phones</li>
              <li>❤️ Favorites</li>
              <li>⚙️ Settings</li>
            </ul>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}