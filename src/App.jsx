import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import PhoneCard from './components/PhoneCard';
import PhoneModal from './components/PhoneModal';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Settings from './pages/Settings';
import PhonesPage from './pages/PhonesPage';
import FavoritesPage from './pages/FavoritesPage';
import Toast from './components/Toast';
import './App.css';

function App() {
  const [phones, setPhones] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [searchStats, setSearchStats] = useState(
    JSON.parse(localStorage.getItem("searchStats")) || {}
  );

  // ✅ Toast
  const showToast = (message, type = "success") => {
    setToast({ show: false, message: "", type });

    setTimeout(() => {
      setToast({ show: true, message, type });
    }, 50);

    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 2500);
  };

  // ✅ Search
  const searchPhone = async (query) => {
    setSearchQuery(query);

    if (!query || query.length < 2) {
      setPhones([]);
      return;
    }

    try {
      const res = await fetch('/phones.json');
      const data = await res.json();

      const lowerQuery = query.toLowerCase();

      const filtered = data.phones
        .filter(phone =>
          (phone.phone_name || "").toLowerCase().includes(lowerQuery)
        )
        .slice(0, 12);

      setPhones(filtered);

      // 🔥 Track searches
      if (filtered.length > 0) {
        const updatedStats = { ...searchStats };

        filtered.forEach(phone => {
          const name = phone.phone_name;
          if (!name) return;

          updatedStats[name] = (updatedStats[name] || 0) + 1;
        });

        setSearchStats(updatedStats);
        localStorage.setItem("searchStats", JSON.stringify(updatedStats));
      }

    } catch (error) {
      console.error("Failed to load phone data:", error);
      setPhones([]);
    }
  };

  // ✅ Get Top 10 Trending
  const getTrendingPhones = () => {
    return Object.entries(searchStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  };

  return (
    <div className="app-container">

      {/* NAVBAR */}
      <Navbar openSidebar={() => setIsSidebarOpen(true)} />

      {/* SIDEBAR */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* MAIN CONTENT */}
      <main className="content">
        <div className="content-wrapper">

          <Routes>

            {/* DASHBOARD */}
            <Route
              path="/"
              element={
                <>
                  <h1 className="page-title">Phone Arena Dashboard</h1>

                  <SearchBar onSearch={searchPhone} />

                  {/* SEARCH RESULTS */}
                  <div className="phone-grid">
                    {phones.length > 0 ? (
                      phones.map((phone, index) => (
                        <PhoneCard
                          key={index}
                          phone={phone}
                          query={searchQuery}
                          onView={() => setSelectedPhone(phone)}
                          showToast={showToast}
                        />
                      ))
                    ) : (
                      <p className="empty" style={{color: "black"}}>🔍 Start searching phones...</p>
                    )}
                  </div>

                  {/* 🔥 TRENDING SECTION */}
                  <h2 className="section-title">🔥 Trending by Users</h2>

                  <div className="trending-list">
                    {getTrendingPhones().map(([name, count], index) => (
                      <div key={index} className="trending-item">

                        <span className="rank">
                          {index === 0 && "🥇"}
                          {index === 1 && "🥈"}
                          {index === 2 && "🥉"}
                          {index > 2 && `${index + 1}.`}
                        </span>

                        <span>{name}</span>

                        <span className="popularity">
                          🔍 {count}
                        </span>

                      </div>
                    ))}
                  </div>
                </>
              }
            />

            {/* OTHER PAGES */}
            <Route path="/phones" element={<PhonesPage showToast={showToast} />} />
            <Route path="/favorites" element={<FavoritesPage showToast={showToast} />} />
            <Route path="/settings" element={<Settings />} />

          </Routes>

        </div>
      </main>

      {/* MODAL */}
      {selectedPhone && (
        <PhoneModal
          phone={selectedPhone}
          onClose={() => setSelectedPhone(null)}
        />
      )}

      {/* TOAST */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
      />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default App;