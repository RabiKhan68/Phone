import { useState } from 'react';
import SearchBar from './components/SearchBar';
import PhoneCard from './components/PhoneCard';
import PhoneModal from './components/PhoneModal';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [phones, setPhones] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const searchPhone = async (query) => {
    setSearchQuery(query);

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
        .slice(0, 12);

      setPhones(filtered);
    } catch (error) {
      console.error("Failed to load phone data:", error);
      setPhones([]);
    }
  };

  return (
    <div className="app-container">

      {/* NAVBAR */}
      <Navbar openSidebar={() => setIsSidebarOpen(true)} />

      {/* SIDEBAR (overlay style) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* CONTENT */}
      <main className="content">

        <div className="content-wrapper">

          <h1 className="page-title">Phone Arena Dashboard</h1>

          <SearchBar onSearch={searchPhone} />

          <div className="phone-grid">
            {phones.length > 0 ? (
              phones.map((phone, index) => (
                <PhoneCard
                  key={index}
                  phone={phone}
                  query={searchQuery}
                  onView={() => setSelectedPhone(phone)}
                />
              ))
            ) : (null)}
          </div>

        </div>

      </main>

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