import { useState } from 'react';
import SearchBar from './components/SearchBar';
import PhoneCard from './components/PhoneCard';
import PhoneModal from './components/PhoneModal';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

function App() {
  const [phones, setPhones] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const searchPhone = async (query) => {
    setSearchQuery(query);

    // 🔥 Prevent unnecessary load
    if (!query || query.length < 2) {
      setPhones([]);
      return;
    }

    try {
      const res = await fetch('/phones.json');
      const data = await res.json();

      const filtered = data.phones
        .filter(phone =>
          phone.phone_name.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 12); // 🔥 LIMIT results (VERY IMPORTANT)

      setPhones(filtered);
    } catch (error) {
      console.error("Failed to load phone data:", error);
      setPhones([]);
    }
  };

  return (
    <div className="app-container">

      {/* NAVBAR */}
      <Navbar />

      {/* MAIN LAYOUT */}
      <div className="main-layout">

        {/* SIDEBAR */}
        <Sidebar />

        {/* CONTENT */}
        <main className="content">

          <h1 className="page-title">📱 Phone Arena Dashboard</h1>

          <SearchBar onSearch={searchPhone} />

          <div className="phone-grid">
            {phones.length > 0 ? (
              phones.map((phone, index) => (
                <PhoneCard
                  key={index}
                  phone={phone}
                  query={searchQuery}
                  onView={() => setSelectedPhone(phone)} // ✅ FIXED
                />
              ))
            ) : (
              <p className="empty">
                🔍 Start typing to search phones...
              </p>
            )}
          </div>

        </main>
      </div>

      {/* MODAL */}
      {selectedPhone && (
        <PhoneModal
          phone={selectedPhone}
          onClose={() => setSelectedPhone(null)}
        />
      )}

      {/* FOOTER */}
      <Footer />

    </div>
  );
}

export default App;