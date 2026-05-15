import { useState, useEffect, useCallback } from "react";
import PhoneCard from "../components/PhoneCard";
import PhoneModal from "../components/PhoneModal";
import "./FavoritesPage.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY_FAVORITES = "favorites";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const loadFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_FAVORITES)) || [];
  } catch {
    return [];
  }
};

const saveFavorites = (favorites) => {
  localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites));
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function FavoritesPage({ showToast }) {
  const [favorites, setFavorites]       = useState(loadFavorites);
  const [selectedPhone, setSelectedPhone] = useState(null);

  // Keep localStorage in sync whenever favorites change
  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const removeFavorite = useCallback((phoneName) => {
    setFavorites((prev) => prev.filter((p) => p.phone_name !== phoneName));
  }, []);

  return (
    <div className="favorites-container">
      <h1 className="page-title">Favorite Phones</h1>

      {favorites.length === 0 ? (
        <p className="empty">No favorites yet.</p>
      ) : (
        <div className="phone-grid">
          {favorites.map((phone) => (
            <div key={phone.phone_name} className="fav-card-wrapper">
              <PhoneCard
                phone={phone}
                onView={() => setSelectedPhone(phone)}
                showToast={showToast}
              />
              <button
                className="remove-btn"
                onClick={() => removeFavorite(phone.phone_name)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedPhone && (
        <PhoneModal
          phone={selectedPhone}
          onClose={() => setSelectedPhone(null)}
        />
      )}
    </div>
  );
}