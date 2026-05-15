import { useState, useEffect, useRef, useCallback } from "react";
import "./SearchBar.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const DEBOUNCE_DELAY_MS = 400;

// ─── Component ────────────────────────────────────────────────────────────────

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  // Debounced search
  useEffect(() => {
  const delay = setTimeout(() => {
    onSearch(query);
    window.dispatchEvent(
      new CustomEvent("phone-search", { detail: { query } })
    );
  }, DEBOUNCE_DELAY_MS);
  return () => clearTimeout(delay);
}, [query, onSearch]);

  // Clear input and return focus to input
  const clearSearch = useCallback(() => {
    setQuery("");
    onSearch("");
    inputRef.current?.focus();
  }, [onSearch]);

  return (
    <div className="search-container">
      <div className="search-box">

        {/* Icon */}
        <span className="search-icon" aria-hidden="true">
          <i className="ti ti-search" />
        </span>

        {/* Input */}
        <input
          ref={inputRef}
          type="search"
          placeholder="Search phone model..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Escape") clearSearch(); }}
          className="search-input"
          aria-label="Search phones"
        />

        {/* Clear button */}
        {query && (
          <button
            className="clear-btn"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            ✖
          </button>
        )}

      </div>
    </div>
  );
}