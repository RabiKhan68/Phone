import { useState, useEffect } from "react";
import "./Settings.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY_DARK_MODE = "darkMode";
const STORAGE_KEY_LANGUAGE  = "language";

const LANGUAGES = [
  { code: "en", label: "English"    },
  { code: "es", label: "Spanish"    },
  { code: "fr", label: "French"     },
  { code: "de", label: "German"     },
  { code: "zh", label: "Chinese"    },
  { code: "hi", label: "Hindi"      },
  { code: "ar", label: "Arabic"     },
  { code: "ru", label: "Russian"    },
  { code: "ja", label: "Japanese"   },
  { code: "pt", label: "Portuguese" },
];

const SETTING_SECTIONS = [
  {
    id:    "appearance",
    icon:  "ti-palette",
    label: "Appearance",
  },
  {
    id:    "language",
    icon:  "ti-language",
    label: "Language",
  },
  {
    id:    "about",
    icon:  "ti-info-circle",
    label: "About",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const loadDarkMode = () => localStorage.getItem(STORAGE_KEY_DARK_MODE) === "true";
const loadLanguage = () => localStorage.getItem(STORAGE_KEY_LANGUAGE) || "en";

// ─── Sub-components ───────────────────────────────────────────────────────────

function SettingsCard({ icon, title, children }) {
  return (
    <div className="settings-card">
      <div className="settings-card-header">
        <i className={`ti ${icon} settings-card-icon`} aria-hidden="true" />
        <h2 className="settings-card-title">{title}</h2>
      </div>
      <div className="settings-card-body">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange, id, label }) {
  return (
    <label className="toggle-row" htmlFor={id}>
      <div className="toggle-info">
        <span className="toggle-label">{label}</span>
        <span className="toggle-sub">
          {checked ? "Dark theme active" : "Light theme active"}
        </span>
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={`toggle-switch${checked ? " toggle-switch--on" : ""}`}
        onClick={() => onChange(!checked)}
        type="button"
      >
        <span className="toggle-thumb" />
      </button>
    </label>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Settings() {
  const [darkMode, setDarkMode] = useState(loadDarkMode);
  const [language, setLanguage] = useState(loadLanguage);

  // Dark mode: update body class (not inline styles — plays nicely with CSS vars)
  useEffect(() => {
    document.body.classList.toggle("light-mode", !darkMode);
    localStorage.setItem(STORAGE_KEY_DARK_MODE, String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LANGUAGE, language);
  }, [language]);

  const selectedLang = LANGUAGES.find((l) => l.code === language)?.label ?? "English";

  return (
    <div className="settings-container">

      {/* Page header */}
      <div className="settings-header">
        <i className="ti ti-settings settings-header-icon" aria-hidden="true" />
        <div>
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Manage your preferences</p>
        </div>
      </div>

      {/* ── Appearance ── */}
      <SettingsCard icon="ti-palette" title="Appearance">
        <Toggle
          id="dark-mode-toggle"
          label="Dark Mode"
          checked={darkMode}
          onChange={setDarkMode}
        />
      </SettingsCard>

      {/* ── Language ── */}
      <SettingsCard icon="ti-language" title="Language">
        <div className="settings-row">
          <div className="settings-row-info">
            <span className="toggle-label">Display Language</span>
            <span className="toggle-sub">Currently: {selectedLang}</span>
          </div>
          <div className="settings-select-wrap">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="settings-select"
              aria-label="Select display language"
            >
              {LANGUAGES.map(({ code, label }) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </select>
            <i className="ti ti-chevron-down settings-select-arrow" aria-hidden="true" />
          </div>
        </div>
      </SettingsCard>

      {/* ── About ── */}
      <SettingsCard icon="ti-info-circle" title="About">
        <div className="about-content">
          <div className="about-logo">
            <span aria-hidden="true">📱</span>
          </div>
          <div className="about-text">
            <p className="about-name">
              Phone<strong>Arena</strong>
            </p>
            <p className="about-desc">
              Search, explore, and compare phones easily. Save your favorites
              and manage preferences from one clean dashboard.
            </p>
            <div className="about-meta">
              <span className="about-tag">v1.0.0</span>
              <span className="about-tag">Built by <strong>Rabi Khan</strong></span>
            </div>
          </div>
        </div>
      </SettingsCard>

    </div>
  );
}