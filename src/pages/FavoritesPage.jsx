import { useState, useEffect } from "react";
import PhoneCard from "../components/PhoneCard";
import PhoneModal from "../components/PhoneModal";
import "./FavoritesPage.css";
import { color } from "framer-motion";

export default function FavoritesPage({ showToast }) {
  const [favorites, setFavorites] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(stored);
  }, []);

  const removeFavorite = (phoneName) => {
    const updated = favorites.filter(
      (p) => p.phone_name !== phoneName
    );
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <div className="favorites-container">
      <h1 style={{ color: "black", fontSize: "24px", textAlign: "center"}}>Favorite Phones</h1>

      {favorites.length === 0 ? (
        <p className="empty">No favorites yet.</p>
      ) : (
        <div className="phone-grid">
          {favorites.map((phone, index) => (
            <div key={index} className="fav-card-wrapper">
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