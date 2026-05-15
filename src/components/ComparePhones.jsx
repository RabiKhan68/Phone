import { useState, useEffect, useCallback } from "react";
import "./ComparePhones.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_COMPARE     = 2;
const FALLBACK_IMAGE  = "https://placehold.co/120";
const STORAGE_KEY     = "compare_phones";

const SPEC_LABELS = {
  battery:   { icon: "ti-battery-2",       label: "Battery"   },
  display:   { icon: "ti-device-mobile",   label: "Display"   },
  camera:    { icon: "ti-camera",          label: "Camera"    },
  processor: { icon: "ti-cpu",             label: "Processor" },
  ram:       { icon: "ti-database",        label: "RAM"       },
  storage:   { icon: "ti-device-floppy",   label: "Storage"   },
  os:        { icon: "ti-brand-android",   label: "OS"        },
  network:   { icon: "ti-wifi",            label: "Network"   },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const loadSaved = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const savePair = (pair) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pair));

const getAllSpecKeys = (phones) => {
  const keys = new Set();
  phones.forEach((p) =>
    p?.specs && Object.keys(p.specs).forEach((k) => keys.add(k))
  );
  return [...keys];
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function PhoneSlot({ phone, index, phones, onSelect, onRemove }) {
  const [query,  setQuery]  = useState("");
  const [open,   setOpen]   = useState(false);

  const filtered = phones.filter(
    (p) =>
      p.phone_name.toLowerCase().includes(query.toLowerCase()) &&
      p.phone_name !== phone?.phone_name
  );

  const handlePick = (p) => {
    onSelect(index, p);
    setQuery("");
    setOpen(false);
  };

  if (phone) {
    return (
      <div className="cp-slot cp-slot--filled">
        <button
          className="cp-remove-btn"
          onClick={() => onRemove(index)}
          aria-label={`Remove ${phone.phone_name}`}
        >
          <i className="ti ti-x" aria-hidden="true" />
        </button>
        <div className="cp-slot-img">
          <img
            src={phone.image || FALLBACK_IMAGE}
            alt={phone.phone_name}
            onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
          />
        </div>
        <p className="cp-slot-brand">{phone.brand}</p>
        <p className="cp-slot-name">{phone.phone_name}</p>
      </div>
    );
  }

  return (
    <div className="cp-slot cp-slot--empty">
      <i className="ti ti-device-mobile cp-slot-icon" aria-hidden="true" />
      <p className="cp-slot-hint">Select a phone</p>

      <div className="cp-search-wrap">
        <div className="cp-search-box">
          <i className="ti ti-search cp-search-icon" aria-hidden="true" />
          <input
            type="text"
            className="cp-search-input"
            placeholder="Search model…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            aria-label="Search phones to compare"
          />
          {query && (
            <button
              className="cp-search-clear"
              onClick={() => { setQuery(""); setOpen(false); }}
              aria-label="Clear"
            >
              <i className="ti ti-x" aria-hidden="true" />
            </button>
          )}
        </div>

        {open && query.length >= 1 && (
          <ul className="cp-dropdown" role="listbox" aria-label="Phone suggestions">
            {filtered.length === 0 ? (
              <li className="cp-dropdown-empty">No phones found</li>
            ) : (
              filtered.slice(0, 8).map((p) => (
                <li
                  key={p.phone_name}
                  className="cp-dropdown-item"
                  role="option"
                  onClick={() => handlePick(p)}
                >
                  <img
                    src={p.image || FALLBACK_IMAGE}
                    alt=""
                    className="cp-dropdown-img"
                    onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                  />
                  <span className="cp-dropdown-name">{p.phone_name}</span>
                  <span className="cp-dropdown-brand">{p.brand}</span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

function SpecRow({ specKey, phones }) {
  const meta   = SPEC_LABELS[specKey] || { icon: "ti-list", label: specKey };
  const values = phones.map((p) => p?.specs?.[specKey] ?? "—");
  const isDiff = values[0] !== values[1] && values[0] !== "—" && values[1] !== "—";

  return (
    <div className={`cp-spec-row${isDiff ? " cp-spec-row--diff" : ""}`}>
      <div className="cp-spec-key">
        <i className={`ti ${meta.icon}`} aria-hidden="true" />
        <span>{meta.label || specKey}</span>
      </div>
      {values.map((val, i) => (
        <div key={i} className="cp-spec-val">
          {val}
        </div>
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ComparePhones({ phones = [], showToast }) {
  const [selected, setSelected] = useState([null, null]);

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = loadSaved();
    if (saved.length) setSelected(saved);
  }, []);

  // Persist whenever selection changes
  useEffect(() => {
    savePair(selected);
  }, [selected]);

  const handleSelect = useCallback((index, phone) => {
    setSelected((prev) => {
      // Prevent duplicate
      const otherIdx  = index === 0 ? 1 : 0;
      if (prev[otherIdx]?.phone_name === phone.phone_name) {
        showToast?.("Already selected in the other slot!", "error");
        return prev;
      }
      const next = [...prev];
      next[index] = phone;
      return next;
    });
  }, [showToast]);

  const handleRemove = useCallback((index) => {
    setSelected((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  }, []);

  const handleClear = () => {
    setSelected([null, null]);
    savePair([null, null]);
  };

  const bothSelected  = selected[0] && selected[1];
  const specKeys      = bothSelected ? getAllSpecKeys(selected) : [];

  return (
    <div className="compare-page">

      {/* ── Header ── */}
      <div className="cp-header">
        <div className="cp-header-left">
          <i className="ti ti-scale cp-header-icon" aria-hidden="true" />
          <div>
            <h1 className="cp-title">Compare Phones</h1>
            <p className="cp-subtitle">Select two phones to compare side-by-side</p>
          </div>
        </div>
        {(selected[0] || selected[1]) && (
          <button className="cp-clear-btn" onClick={handleClear} aria-label="Clear comparison">
            <i className="ti ti-refresh" aria-hidden="true" />
            Clear
          </button>
        )}
      </div>

      {/* ── Slots ── */}
      <div className="cp-slots">
        {selected.map((phone, i) => (
          <PhoneSlot
            key={i}
            index={i}
            phone={phone}
            phones={phones}
            onSelect={handleSelect}
            onRemove={handleRemove}
          />
        ))}

        {/* VS divider */}
        <div className="cp-vs" aria-hidden="true">VS</div>
      </div>

      {/* ── Spec table ── */}
      {bothSelected && specKeys.length > 0 && (
        <section className="cp-specs" aria-label="Specification comparison">
          <div className="cp-specs-header">
            <span className="cp-specs-title">Specifications</span>
            <span className="cp-diff-legend">
              <span className="cp-diff-dot" aria-hidden="true" />
              Differs
            </span>
          </div>

          {/* Column headers */}
          <div className="cp-spec-row cp-spec-row--head">
            <div className="cp-spec-key" />
            {selected.map((p, i) => (
              <div key={i} className="cp-spec-val cp-spec-val--head">
                {p.phone_name}
              </div>
            ))}
          </div>

          {specKeys.map((key) => (
            <SpecRow key={key} specKey={key} phones={selected} />
          ))}
        </section>
      )}

      {/* ── Empty nudge ── */}
      {!bothSelected && !selected[0] && !selected[1] && (
        <div className="cp-empty">
          <i className="ti ti-device-mobile-search cp-empty-icon" aria-hidden="true" />
          <p className="cp-empty-text">Pick two phones above to see how they stack up</p>
        </div>
      )}

    </div>
  );
}