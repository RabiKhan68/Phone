import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom"; // use NavLink for active styling
import "./Sidebar.css";

export default function Sidebar({ isOpen, onClose }) {
  // Helper for active link class
  const activeClass = ({ isActive }) => (isActive ? "active-link" : "");

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
              <li>
                <NavLink to="/" className={activeClass} onClick={onClose}>
                  🏠 Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/phones" className={activeClass} onClick={onClose}>
                  📱 Phones
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/favorites"
                  className={activeClass}
                  onClick={onClose}
                >
                  ❤️ Favorites
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/settings"
                  className={activeClass}
                  onClick={onClose}
                >
                  ⚙️ Settings
                </NavLink>
              </li>
            </ul>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}