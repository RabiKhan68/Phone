import { useState, useCallback, useEffect, useRef } from "react";
import "./TrendingPanel.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const POPULARITY_MIN = 1;
const POPULARITY_MAX = 100;
const STORAGE_KEY    = "phone_search_counts";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const clampPopularity = (value) =>
  Math.min(POPULARITY_MAX, Math.max(POPULARITY_MIN, Number(value)));

const isValid = (selected, popularity) =>
  selected !== "" &&
  popularity !== "" &&
  !isNaN(Number(popularity)) &&
  Number(popularity) >= POPULARITY_MIN &&
  Number(popularity) <= POPULARITY_MAX;

const loadCounts = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
};

const saveCounts = (counts) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));

const formatCount = (count) =>
  count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count;

// ─── Sub-components ───────────────────────────────────────────────────────────

function SearchCountBadge({ count }) {
  if (!count) return null;
  return (
    <span className="tp-badge" aria-label={`${count} searches`}>
      {formatCount(count)}
    </span>
  );
}

function TrendingRow({ phone, count, rank, maxCount, onAdd, alreadyTrending }) {
  // Bar width relative to the highest count in the list
  const barPct = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;

  return (
    <li className="tp-row">
      <span className="tp-rank" aria-label={`Rank ${rank}`}>
        #{rank}
      </span>

      <div className="tp-row-info">
        <span className="tp-row-name">{phone.phone_name}</span>
        <div className="tp-bar-wrap" aria-hidden="true">
          <div
            className="tp-bar"
            style={{ width: `${barPct}%` }}
          />
        </div>
      </div>

      <SearchCountBadge count={count} />

      <button
        className={`tp-row-btn${alreadyTrending ? " tp-row-btn--done" : ""}`}
        onClick={() => onAdd(phone, count)}
        disabled={alreadyTrending}
        aria-label={
          alreadyTrending
            ? `${phone.phone_name} is already trending`
            : `Add ${phone.phone_name} to trending`
        }
      >
        <i
          className={`ti ${alreadyTrending ? "ti-check" : "ti-plus"}`}
          aria-hidden="true"
        />
      </button>
    </li>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TrendingPanel({
  phones,
  updateTrending,
  trendingList = [],
}) {
  const [selected,     setSelected]     = useState("");
  const [popularity,   setPopularity]   = useState("");
  const [searchCounts, setSearchCounts] = useState(loadCounts);
  const [filter,       setFilter]       = useState("");
  const prevMatchRef                    = useRef({});

  // ── Listen for SearchBar events ───────────────────────────────────────────
  useEffect(() => {
    const handleSearch = (e) => {
      const query = (e.detail?.query || "").trim().toLowerCase();
      if (!query || query.length < 2) return;

      const prev = prevMatchRef.current;

      phones.forEach((phone) => {
        const name     = phone.phone_name.toLowerCase();
        const wasMatch = prev[phone.phone_name] ?? false;
        const isMatch  = name.includes(query);

        if (isMatch && !wasMatch) {
          setSearchCounts((counts) => {
            const updated = {
              ...counts,
              [phone.phone_name]: (counts[phone.phone_name] || 0) + 1,
            };
            saveCounts(updated);
            return updated;
          });
        }
        prevMatchRef.current[phone.phone_name] = isMatch;
      });
    };

    window.addEventListener("phone-search", handleSearch);
    return () => window.removeEventListener("phone-search", handleSearch);
  }, [phones]);

  // ── Manual add ────────────────────────────────────────────────────────────
  const handleAdd = useCallback(() => {
    if (!isValid(selected, popularity)) return;
    const phone = phones.find((p) => p.phone_name === selected);
    if (!phone) return;
    updateTrending(phone, clampPopularity(popularity));
    setSelected("");
    setPopularity("");
  }, [selected, popularity, phones, updateTrending]);

  const handlePopularityChange = (e) => {
    const val = e.target.value;
    if (val === "" || (!isNaN(Number(val)) && Number(val) >= 0))
      setPopularity(val);
  };

  const handleResetCounts = () => {
    saveCounts({});
    setSearchCounts({});
    prevMatchRef.current = {};
  };

  // ── Sorted list ───────────────────────────────────────────────────────────
  const sortedPhones = [...phones]
    .map((phone) => ({ phone, count: searchCounts[phone.phone_name] || 0 }))
    .filter(({ phone }) =>
      !filter ||
      phone.phone_name.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const maxCount     = sortedPhones[0]?.count || 0;
  const trendingSet  = new Set(trendingList.map((t) => t.phone_name));

  const handleRowAdd = useCallback(
    (phone, count) => updateTrending(phone, clampPopularity(count || POPULARITY_MIN)),
    [updateTrending]
  );

  return (
    <div className="trending-panel">

      {/* ── Header ── */}
      <div className="tp-header">
        <div className="tp-title-row">
          <i className="ti ti-flame tp-flame" aria-hidden="true" />
          <h2 className="tp-title">Manage Trending</h2>
        </div>
        <button
          className="tp-reset-btn"
          onClick={handleResetCounts}
          aria-label="Reset all search counts"
        >
          <i className="ti ti-refresh" aria-hidden="true" />
          Reset counts
        </button>
      </div>

      {/* ── Manual add ── */}
      <section className="tp-section">
        <p className="tp-section-label">
          <i className="ti ti-adjustments-horizontal" aria-hidden="true" />
          Add manually
        </p>
        <div className="tp-controls">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="tp-select"
            aria-label="Select a phone"
          >
            <option value="">Select phone…</option>
            {phones.map((p) => (
              <option key={p.phone_name} value={p.phone_name}>
                {p.phone_name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder={`Score ${POPULARITY_MIN}–${POPULARITY_MAX}`}
            value={popularity}
            min={POPULARITY_MIN}
            max={POPULARITY_MAX}
            onChange={handlePopularityChange}
            className="tp-input"
            aria-label="Popularity score"
          />

          <button
            className="tp-add-btn"
            onClick={handleAdd}
            disabled={!isValid(selected, popularity)}
            aria-label="Add phone to trending"
          >
            <i className="ti ti-plus" aria-hidden="true" />
            Add
          </button>
        </div>
      </section>

      {/* ── Live search counts ── */}
      <section className="tp-section tp-section--live">
        <div className="tp-live-header">
          <p className="tp-section-label">
            <i className="ti ti-activity" aria-hidden="true" />
            Real-time search activity
          </p>
          <input
            type="search"
            className="tp-filter"
            placeholder="Filter…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter phone list"
          />
        </div>

        {sortedPhones.length === 0 ? (
          <p className="tp-empty">No search activity yet.</p>
        ) : (
          <ul className="tp-list" aria-label="Trending phones by search count">
            {sortedPhones.map(({ phone, count }, index) => (
              <TrendingRow
                key={phone.phone_name}
                phone={phone}
                count={count}
                rank={index + 1}
                maxCount={maxCount}
                onAdd={handleRowAdd}
                alreadyTrending={trendingSet.has(phone.phone_name)}
              />
            ))}
          </ul>
        )}
      </section>

    </div>
  );
}