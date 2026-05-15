import { useCallback } from "react";
import { motion } from "framer-motion";
import "./PhoneCard.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY_FAVORITES  = "favorites";
const FALLBACK_IMAGE         = "https://placehold.co/150";
const CARD_ANIMATION = {
  whileHover:  { y: -6, scale: 1.02 },
  whileTap:    { scale: 0.98 },
  transition:  { type: "spring", stiffness: 200 },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const highlightMatch = (text, query) => {
  if (!query || !text) return text;

  const regex = new RegExp(`(${query})`, "gi");
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="highlight">{part}</mark>
      : part
  );
};

const loadFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_FAVORITES)) || [];
  } catch {
    return [];
  }
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function PhoneCard({ phone, query, onView, showToast }) {
  const handleAddToFavorites = useCallback(() => {
    const favorites = loadFavorites();
    const alreadyAdded = favorites.some((p) => p.phone_name === phone.phone_name);

    if (alreadyAdded) {
      showToast?.("Already in favorites!", "error");
      return;
    }

    const updated = [...favorites, phone];
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(updated));
    showToast?.("Added to favorites!", "success");
  }, [phone, showToast]);

  return (
    <motion.div
      {...CARD_ANIMATION}
      className="card"
      onClick={onView}
    >
      {/* Image */}
      <div className="card-img">
        <img
          src={phone.image}
          alt={phone.phone_name}
          onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
        />
      </div>

      {/* Info */}
      <div className="card-body">
        <h3 className="card-title">
          {highlightMatch(phone.phone_name, query)}
        </h3>
        <p className="card-brand">{phone.brand}</p>

        <button
          className="view-btn"
          onClick={(e) => { e.stopPropagation(); onView(); }}
        >
          View Details
        </button>

        <button
          className="fav-btn"
          onClick={(e) => { e.stopPropagation(); handleAddToFavorites(); }}
        >
          Add to Favorites
        </button>
      </div>
    </motion.div>
  );
}