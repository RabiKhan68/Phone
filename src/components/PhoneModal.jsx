import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import "./PhoneModal.css";

export default function PhoneModal({ phone, onClose }) {
  if (!phone) return null;

  // 🔥 ESC key + scroll lock
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden"; // 🔥 lock scroll

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto"; // 🔥 restore scroll
    };
  }, [onClose]);

  // 🔥 Click outside
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={handleOverlayClick}>

        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="modal-box"
        >
          {/* CLOSE BUTTON */}
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>

          {/* IMAGE */}
          <div className="modal-img-container">
            <img
              src={phone.image}
              alt={phone.phone_name}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/200";
              }}
            />
          </div>

          {/* INFO */}
          <h2 className="modal-title">{phone.phone_name}</h2>
          <p className="brand">{phone.brand}</p>

          {/* SPECS */}
          <div className="specs">
            {phone.specs ? (
              Object.entries(phone.specs).map(([key, value]) => (
                <div key={key} className="spec-item">
                  <span className="spec-key">{key}</span>
                  <span className="spec-value">{value}</span>
                </div>
              ))
            ) : (
              <p className="no-specs">No specifications available</p>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}