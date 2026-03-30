import React from "react";
import { motion } from "framer-motion";

function PhoneCard({ phone, query, onView }) {

  // 🔥 Restore highlight feature
  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");

    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="highlight">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="card"
    >
      {/* IMAGE */}
      <div className="card-img">
        <img src={phone.image} alt={phone.phone_name} />
      </div>

      {/* INFO */}
      <div className="card-body">
        <h3 className="card-title">
          {highlightMatch(phone.phone_name, query)}
        </h3>

        <p className="card-brand">{phone.brand}</p>

        <button onClick={onView} className="view-btn">
          View Details
        </button>
      </div>
    </motion.div>
  );
}

export default PhoneCard;