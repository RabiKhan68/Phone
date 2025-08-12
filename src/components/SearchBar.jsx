import React, { useState } from "react";

function SearchBar({ onSearch }) {
    const [query, setQuery] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit} className="flex justify-center">
            <input
                type="text"
                placeholder="Search phone model"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="rounded-full p-3 w-64 bg-white text-black outline-none"
            />
            <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 p-3 rounded-full font-bold"
            >
                Search
            </button>
        </form>
    );
}

export default SearchBar;
