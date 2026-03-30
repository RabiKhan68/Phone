import React, { useState, useEffect } from "react";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  // 🔥 Auto search when typing (debounced)
  useEffect(() => {
    const delay = setTimeout(() => {
      onSearch(query);
    }, 400); // delay for performance

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="search-container">
      
      <input
        type="text"
        placeholder="Search phone model..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />

    </div>
  );
}

export default SearchBar;