import { useState } from 'react';
import SearchBar from './components/SearchBar';
import PhoneCard from './components/PhoneCard';

function App() {
  const [phones, setPhones] = useState([]);

  // Search handler
  const searchPhone = async (query) => {
    if (!query) return;

    try {
      const res = await fetch('/phones.json'); // Make sure phones.json exists in public/
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
    <div className='min-h-screen bg-gradient-to-r from-red-500 to-pink-500 text-white p-6'>
      <h1 className='text-4xl font-bold text-center mb-8 drop-shadow-lg'>Phone Arena</h1>
      
      <SearchBar onSearch={searchPhone} />

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10'>
        {phones.map((phone, index) => (
          <PhoneCard
            key={index}
            phone={phone}
            query="" // You can optionally pass the search term
          />
        ))}
      </div>
    </div>
  );
}

export default App;
