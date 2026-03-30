import React, { useState, useEffect } from "react";
import "./SearchBar.css";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  // 🔥 Debounced search
  useEffect(() => {
    const delay = setTimeout(() => {
      onSearch(query);
    }, 400);

    return () => clearTimeout(delay);
  }, [query, onSearch]);

  // 🔥 Clear input
  const clearSearch = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="search-container">

      <div className="search-box">

        {/* ICON */}
        <span className="search-icon">🔍</span>

        {/* INPUT */}
        <input
          type="text"
          placeholder="Search phone model..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") clearSearch();
          }}
          className="search-input"
        />

        {/* CLEAR BUTTON */}
        {query && (
          <button onClick={clearSearch} className="clear-btn">
            ✖
          </button>
        )}

      </div>

    </div>
  );
}

export default SearchBar;