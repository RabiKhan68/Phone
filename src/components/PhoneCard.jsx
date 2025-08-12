import React from "react";
import { motion } from "framer-motion";

function PhoneCard({ phone, query }) {
  // Function to highlight query matches
  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex justify-center items-center py-10">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white text-black rounded-2xl p-6 shadow-xl w-full max-w-lg"
      >
        <img
          src={phone.image}
          alt={phone.phone_name}
          loading="lazy"
          className="w-full h-60 object-contain mb-4 rounded-xl"
        />

        <h2 className="text-2xl font-extrabold text-purple-700 mb-1">
          {highlightMatch(phone.phone_name, query)}
        </h2>

        <p className="text-sm text-gray-600 mb-4">{phone.brand}</p>

        {phone.specs ? (
          <>
            <h3 className="text-lg font-bold mb-2 border-b border-gray-300 pb-1">
              Specifications
            </h3>
            <div className="text-sm leading-relaxed space-y-1 max-h-64 overflow-y-auto pr-2">
              {Object.entries(phone.specs).map(([key, value]) => (
                <p key={key}>
                  <strong>{key}:</strong> {value}
                </p>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm italic text-gray-400">No specifications available.</p>
        )}
      </motion.div>
    </div>
  );
}

export default PhoneCard;
