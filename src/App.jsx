import { useState, useCallback, useEffect, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import SearchBar     from './components/SearchBar';
import PhoneCard     from './components/PhoneCard';
import PhoneModal    from './components/PhoneModal';
import Navbar        from './components/Navbar';
import Sidebar       from './components/Sidebar';
import Footer        from './components/Footer';
import Settings      from './pages/Settings';
import PhonesPage    from './pages/PhonesPage';
import FavoritesPage from './pages/FavoritesPage';
import ComparePhones from './components/ComparePhones';
import Reviews       from './components/Reviews';
import Toast         from './components/Toast';
import './App.css';

// ─── Constants ────────────────────────────────────────────────────────────────

const SEARCH_MIN_LENGTH        = 2;
const SEARCH_MAX_RESULTS       = 12;
const TRENDING_MAX_RESULTS     = 10;
const TOAST_DURATION_MS        = 2500;
const TOAST_RESET_DELAY_MS     = 50;
const STORAGE_KEY_SEARCH_STATS = 'searchStats';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const loadSearchStats = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_SEARCH_STATS)) || {};
  } catch {
    return {};
  }
};

const saveSearchStats = (stats) =>
  localStorage.setItem(STORAGE_KEY_SEARCH_STATS, JSON.stringify(stats));

const fetchPhones = async () => {
  const res = await fetch('/phones.json');
  if (!res.ok) throw new Error(`Failed to fetch phones: ${res.status}`);
  const data = await res.json();
  return data.phones ?? [];
};

const filterPhones = (phones, query) => {
  const lower = query.toLowerCase();
  return phones
    .filter((p) => (p.phone_name ?? '').toLowerCase().includes(lower))
    .slice(0, SEARCH_MAX_RESULTS);
};

const rankByCount = (stats, limit) =>
  Object.entries(stats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit);

const RANK_MEDALS = ['🥇', '🥈', '🥉'];
const rankLabel   = (index) => RANK_MEDALS[index] ?? `${index + 1}.`;

// ─── Sub-components ───────────────────────────────────────────────────────────

function TrendingList({ stats }) {
  const trending = useMemo(
    () => rankByCount(stats, TRENDING_MAX_RESULTS),
    [stats]
  );

  if (trending.length === 0) return null;

  return (
    <section className="trending-section" aria-label="Trending phones">
      <h2 className="section-title">
        <span className="section-title-icon" aria-hidden="true">🔥</span>
        Trending by Users
      </h2>
      <div className="trending-list">
        {trending.map(([name, count], index) => (
          <div key={name} className="trending-item">
            <span className="trending-rank" aria-label={`Rank ${index + 1}`}>
              {rankLabel(index)}
            </span>
            <span className="trending-name">{name}</span>
            <span className="trending-count" aria-label={`${count} searches`}>
              🔍 {count}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function PhoneGrid({ phones, searchQuery, onView, showToast }) {
  if (phones.length === 0) {
    return (
      <div className="empty-state" aria-live="polite">
        <span className="empty-icon" aria-hidden="true">🔍</span>
        <p className="empty-text">Start searching for phones…</p>
        <p className="empty-sub">Type at least 2 characters to see results</p>
      </div>
    );
  }

  return (
    <div className="phone-grid" aria-label="Search results">
      {phones.map((phone) => (
        <PhoneCard
          key={phone.phone_name}
          phone={phone}
          query={searchQuery}
          onView={() => onView(phone)}
          showToast={showToast}
        />
      ))}
    </div>
  );
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useToast() {
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: false, message: '', type });
    const resetId = setTimeout(
      () => setToast({ show: true, message, type }),
      TOAST_RESET_DELAY_MS
    );
    const hideId = setTimeout(
      () => setToast((prev) => ({ ...prev, show: false })),
      TOAST_DURATION_MS
    );
    return () => { clearTimeout(resetId); clearTimeout(hideId); };
  }, []);

  return { toast, showToast };
}

function useAllPhones() {
  const [allPhones, setAllPhones] = useState([]);

  useEffect(() => {
    fetchPhones()
      .then(setAllPhones)
      .catch((err) => console.error('Failed to load all phones:', err));
  }, []);

  return allPhones;
}

function usePhoneSearch() {
  const [phones,      setPhones]      = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchStats, setSearchStats] = useState(loadSearchStats);

  const searchPhone = useCallback(async (query) => {
    setSearchQuery(query);

    if (!query || query.length < SEARCH_MIN_LENGTH) {
      setPhones([]);
      return;
    }

    try {
      const allPhones = await fetchPhones();
      const filtered  = filterPhones(allPhones, query);
      setPhones(filtered);

      if (filtered.length > 0) {
        setSearchStats((prev) => {
          const next = { ...prev };
          filtered.forEach(({ phone_name }) => {
            if (phone_name) next[phone_name] = (next[phone_name] ?? 0) + 1;
          });
          saveSearchStats(next);
          return next;
        });
      }
    } catch (err) {
      console.error('Failed to load phone data:', err);
      setPhones([]);
    }
  }, []);

  return { phones, searchQuery, searchStats, searchPhone };
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ phones, searchQuery, searchStats, onSearch, onView, showToast }) {
  return (
    <div className="dashboard">
      <div className="dashboard-hero">
        <h1 className="page-title">
          Phone<strong>Arena</strong>
          <span className="page-title-badge">Dashboard</span>
        </h1>
        <p className="page-subtitle">
          Search, compare, and discover the latest smartphones.
        </p>
        <SearchBar onSearch={onSearch} />
      </div>

      <PhoneGrid
        phones={phones}
        searchQuery={searchQuery}
        onView={onView}
        showToast={showToast}
      />

      <TrendingList stats={searchStats} />
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { toast, showToast }                              = useToast();
  const { phones, searchQuery, searchStats, searchPhone } = usePhoneSearch();
  const allPhones                                         = useAllPhones();

  return (
    <div className="app-container">
      {/* Background mesh */}
      <div className="app-bg" aria-hidden="true">
        <div className="app-bg-blob app-bg-blob--1" />
        <div className="app-bg-blob app-bg-blob--2" />
        <div className="app-bg-blob app-bg-blob--3" />
      </div>

      <Navbar openSidebar={() => setIsSidebarOpen(true)} />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="content" id="main-content">
        <div className="content-wrapper">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  phones={phones}
                  searchQuery={searchQuery}
                  searchStats={searchStats}
                  onSearch={searchPhone}
                  onView={setSelectedPhone}
                  showToast={showToast}
                />
              }
            />
            <Route path="/phones"    element={<PhonesPage    showToast={showToast} />} />
            <Route path="/favorites" element={<FavoritesPage showToast={showToast} />} />
            <Route
              path="/compare"
              element={<ComparePhones phones={allPhones} showToast={showToast} />}
            />
            <Route
              path="/reviews"
              element={<Reviews phones={allPhones} showToast={showToast} />}
            />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>

      {selectedPhone && (
        <PhoneModal
          phone={selectedPhone}
          onClose={() => setSelectedPhone(null)}
        />
      )}

      <Toast show={toast.show} message={toast.message} type={toast.type} />

      <Footer />
    </div>
  );
}