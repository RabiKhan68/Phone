import { useState, useEffect } from "react";
import PhoneCard from "../components/PhoneCard";
import PhoneModal from "../components/PhoneModal";
import "./PhonesPage.css";

export default function PhonesPage({ showToast }) {
  const [phones, setPhones] = useState([]);
  const [filteredPhones, setFilteredPhones] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [brandQuery, setBrandQuery] = useState("");
  const [brands, setBrands] = useState([]);

  // Fetch phones on mount
  useEffect(() => {
    const fetchPhones = async () => {
      try {
        const res = await fetch("/phones.json");
        const data = await res.json();
        const phoneList = data.phones || [];
        setPhones(phoneList);
        setFilteredPhones(phoneList);

        // Extract unique brands for dropdown
        const uniqueBrands = [
          ...new Set(phoneList.map((p) => p.brand))
        ].sort();
        setBrands(uniqueBrands);
      } catch (error) {
        console.error("Failed to load phone data:", error);
        setPhones([]);
        setFilteredPhones([]);
      }
    };
    fetchPhones();
  }, []);

  // Filter phones based on selected brand
  const filterByBrand = (brand) => {
    setBrandQuery(brand);
    if (!brand) {
      setFilteredPhones(phones);
    } else {
      const filtered = phones.filter(
        (phone) => phone.brand.toLowerCase() === brand.toLowerCase()
      );
      setFilteredPhones(filtered);
    }
  };

  return (
    <div className="phones-page-container">
    <div style={{ padding: "20px" }}>
      <h1 style={{color: "black"}}>Phones</h1>

      {/* Brand dropdown */}
      <div className="brand-filter">
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="brand-select">Filter by Brand: </label>
        <select
          id="brand-select"
          value={brandQuery}
          onChange={(e) => filterByBrand(e.target.value)}
        >
          <option value="">All Brands</option>
          {brands.map((brand, index) => (
            <option key={index} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>
      </div>

      <div className="phone-grid" style={{ marginTop: "20px" }}>
        {filteredPhones.length > 0 ? (
          filteredPhones.map((phone, index) => (
            <PhoneCard
              key={index}
              phone={phone}
              query={brandQuery}
              onView={() => setSelectedPhone(phone)}
              showToast={showToast}
            />
          ))
        ) : (
          <p>No phones found for this brand.</p>
        )}
      </div>

      {selectedPhone && (
        <PhoneModal
          phone={selectedPhone}
          onClose={() => setSelectedPhone(null)}
        />
      )}
    </div>
    </div>
  );
}