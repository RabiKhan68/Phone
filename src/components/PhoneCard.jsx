import React from "react";
import { motion } from "framer-motion";

function PhoneCard({ phone, query, onView }) {

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 rounded px-1">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* IMAGE */}
      <img
        src={phone.image}
        alt={phone.phone_name}
        className="w-full h-40 object-contain bg-gray-100"
      />

      {/* CONTENT */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800">
          {highlightMatch(phone.phone_name, query)}
        </h2>

        <p className="text-sm text-gray-500 mb-2">{phone.brand}</p>

        {/* SMALL SPECS PREVIEW */}
        {phone.specs && (
          <div className="text-xs text-gray-600 space-y-1">
            {Object.entries(phone.specs)
              .slice(0, 3) // only show 3 specs (clean UI)
              .map(([key, value]) => (
                <p key={key}>
                  <span className="font-semibold">{key}:</span> {value}
                </p>
              ))}
          </div>
        )}

        {/* BUTTON */}
        <button 
        onClick={onView}
        className="mt-3 w-full bg-blue-600 text-white py-1.5 rounded-lg hover:bg-blue-700 transition">
          View Details
        </button>
      </div>
    </motion.div>
  );
}

export default PhoneCard;