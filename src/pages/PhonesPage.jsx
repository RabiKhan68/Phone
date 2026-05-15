import { useState, useEffect, useMemo } from "react";
import PhoneCard from "../components/PhoneCard";
import PhoneModal from "../components/PhoneModal";
import "./PhonesPage.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const PHONES_URL = "/phones.json";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fetchPhones = async () => {
  const res = await fetch(PHONES_URL);
  if (!res.ok) throw new Error(`Failed to fetch phones: ${res.status}`);
  const data = await res.json();
  return data.phones ?? [];
};

const extractBrands = (phones) =>
  [...new Set(phones.map((p) => p.brand).filter(Boolean))].sort();

// ─── Hook ─────────────────────────────────────────────────────────────────────

function usePhones() {
  const [phones, setPhones] = useState([]);

  useEffect(() => {
    fetchPhones()
      .then(setPhones)
      .catch((err) => {
        console.error("Failed to load phone data:", err);
        setPhones([]);
      });
  }, []);

  return phones;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PhonesPage({ showToast }) {
  const phones                          = usePhones();
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [brandQuery, setBrandQuery]       = useState("");

  const brands = useMemo(() => extractBrands(phones), [phones]);

  const filteredPhones = useMemo(() => {
    if (!brandQuery) return phones;
    const lower = brandQuery.toLowerCase();
    return phones.filter((p) => p.brand?.toLowerCase() === lower);
  }, [phones, brandQuery]);

  return (
    <div className="phones-page-container">
      <h1 className="page-title">Phones</h1>

      <div className="brand-filter">
        <label htmlFor="brand-select">Filter by Brand:</label>
        <select
          id="brand-select"
          value={brandQuery}
          onChange={(e) => setBrandQuery(e.target.value)}
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <div className="phone-grid">
        {filteredPhones.length > 0 ? (
          filteredPhones.map((phone) => (
            <PhoneCard
              key={phone.phone_name}
              phone={phone}
              query={brandQuery}
              onView={() => setSelectedPhone(phone)}
              showToast={showToast}
            />
          ))
        ) : (
          <p className="empty">No phones found for this brand.</p>
        )}
      </div>

      {selectedPhone && (
        <PhoneModal
          phone={selectedPhone}
          onClose={() => setSelectedPhone(null)}
        />
      )}
    </div>
  );
}