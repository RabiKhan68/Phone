import { motion } from "framer-motion";
import { useEffect } from "react";

export default function PhoneModal({ phone, onClose }) {
  if (!phone) return null;

  // 🔥 ESC key close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);

    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // 🔥 Click outside close
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>

      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="modal-box"
      >
        {/* CLOSE BUTTON */}
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        {/* IMAGE */}
        <div className="modal-img-container">
          <img src={phone.image} alt={phone.phone_name} />
        </div>

        {/* INFO */}
        <h2 className="modal-title">{phone.phone_name}</h2>
        <p className="brand">{phone.brand}</p>

        {/* SPECS */}
        <div className="specs">
          {phone.specs ? (
            Object.entries(phone.specs).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {value}
              </p>
            ))
          ) : (
            <p>No specifications available</p>
          )}
        </div>

      </motion.div>
    </div>
  );
}