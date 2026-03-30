import { motion } from "framer-motion";

export default function PhoneModal({ phone, onClose }) {
  if (!phone) return null;

  return (
    <div className="modal-overlay">

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="modal-box"
      >
        {/* CLOSE BUTTON */}
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        {/* IMAGE */}
        <img
          src={phone.image}
          alt={phone.phone_name}
          className="modal-img"
        />

        {/* INFO */}
        <h2>{phone.phone_name}</h2>
        <p className="brand">{phone.brand}</p>

        {/* FULL SPECS */}
        <div className="specs">
          {phone.specs ? (
            Object.entries(phone.specs).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {value}
              </p>
            ))
          ) : (
            <p>No specs available</p>
          )}
        </div>

      </motion.div>
    </div>
  );
}