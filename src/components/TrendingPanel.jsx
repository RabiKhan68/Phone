import { useState } from "react";

export default function TrendingPanel({ phones, updateTrending }) {
  const [selected, setSelected] = useState("");
  const [popularity, setPopularity] = useState("");

  const handleAdd = () => {
    const phone = phones.find(p => p.phone_name === selected);

    if (!phone) return;

    updateTrending(phone, Number(popularity));
    setSelected("");
    setPopularity("");
  };

  return (
    <div className="trending-panel">
      <h2>🔥 Manage Trending</h2>

      <div className="trending-controls">
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="">Select phone</option>
          {phones.map((p, i) => (
            <option key={i} value={p.phone_name}>
              {p.phone_name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Popularity (1-100)"
          value={popularity}
          onChange={(e) => setPopularity(e.target.value)}
        />

        <button onClick={handleAdd}>Add</button>
      </div>
    </div>
  );
}