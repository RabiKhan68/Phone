import React from "react";
import { motion } from "framer-motion";
import "./PhoneCard.css";

function PhoneCard({ phone, query, onView, showToast }) {

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

  const addToFavorites = (phone) => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // prevent duplicates
    const exists = favorites.find(p => p.phone_name === phone.phone_name);
    if (!exists) {
      favorites.push(phone);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    
    if(showToast) {
      showToast("Added to favorites!", "success");
    } else {
      if(showToast) {
        showToast("Already in favorites!", "error");
      }
    }
  }
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="card"
      onClick={onView} // whole card clickable
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
            e.stopPropagation(); // prevent double trigger
            onView();
          }}
          className="view-btn"
        >
          View Details
        </button>
        <button
          className="fav-btn"
          onClick={(e) => {
            e.stopPropagation();
            addToFavorites(phone);
          }}
          style={{border: "2px solid black", borderRadius: "7px", margin: "10px", cursor: "pointer"}}
        >
          Add to Favorites
        </button>
      </div>
    </motion.div>
  );
}

export default PhoneCard;