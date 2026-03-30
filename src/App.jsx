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

    try {
      const res = await fetch('/phones.json');
      const data = await res.json();

      const filtered = data.phones.filter(phone =>
        phone.phone_name.toLowerCase().includes(query.toLowerCase())
      );

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
                <PhoneCard key={index} phone={phone} query={searchQuery} />
              ))
            ) : (
              <p className="empty">Search for phones to display results</p>
            )}
          </div>

        </main>
      </div>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}

export default App;