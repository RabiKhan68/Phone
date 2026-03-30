import React from "react";
import { motion } from "framer-motion";
import "./PhoneCard.css";

function PhoneCard({ phone, query, onView }) {

  // ✅ FIXED highlight (no regex.test bug)
  const highlightMatch = (text, query) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
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
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="card"
      onClick={onView} // 🔥 whole card clickable
    >
      {/* IMAGE */}
      <div className="card-img">
        <img
          src={phone.image}
          alt={phone.phone_name}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150";
          }}
        />
      </div>

      {/* INFO */}
      <div className="card-body">
        <h3 className="card-title">
          {highlightMatch(phone.phone_name, query)}
        </h3>

        <p className="card-brand">{phone.brand}</p>

        {/* BUTTON */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // 🔥 prevent double trigger
            onView();
          }}
          className="view-btn"
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
}

export default PhoneCard;