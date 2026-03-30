import React, { useState, useEffect } from "react";
import "./Settings.css"; // We'll create a separate CSS for styling

export default function Settings() {
  // Load saved states from localStorage
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("profile");
    return saved
      ? JSON.parse(saved)
      : { name: "", email: "", avatar: null };
  });
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );

  // Apply dark mode effect
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#1f2937" : "#f9fafb";
    document.body.style.color = darkMode ? "#f9fafb" : "#1f2937";
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("profile", JSON.stringify(profile));
  }, [profile]);

  // Save language
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleProfileChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files && files[0]) {
        const reader = new FileReader();
        reader.onload = () => {
          setProfile({ ...profile, avatar: reader.result });
        };
        reader.readAsDataURL(files[0]);
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleLanguageChange = (e) => setLanguage(e.target.value);

  return (
    <div className="settings-container">
      <h1 className="settings-title">⚙️ Settings</h1>

      {/* Dark Mode */}
      <div className="settings-card">
        <h2>Appearance</h2>
        <label className="switch">
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
          <span className="slider round"></span>
        </label>
        <span style={{ marginLeft: "10px" }}>Enable Dark Mode</span>
      </div>

      {/* Profile Settings */}
      <div className="settings-card">
        <h2>Profile</h2>
        <div className="profile-form">
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              placeholder="Your Name"
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              placeholder="Your Email"
            />
          </label>
          <label>
            Avatar:
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleProfileChange}
            />
          </label>
          {profile.avatar && (
            <img
              src={profile.avatar}
              alt="Avatar Preview"
              className="avatar-preview"
            />
          )}
        </div>
      </div>

      {/* Language Selection */}
      <div className="settings-card">
        <h2>Language</h2>
        <select value={language} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
          <option value="hi">Hindi</option>
          <option value="ar">Arabic</option>
          <option value="ru">Russian</option>
          <option value="ja">Japanese</option>
          <option value="pt">Portuguese</option>
        </select>
      </div>

      {/* About */}
      <div className="settings-card">
        <h2>About</h2>
        <p>
          Welcome to <strong>Phone Arena</strong>! 📱  
          Search, explore, and compare phones easily. Save your favorites and
          manage your preferences in a simple dashboard. Enjoy discovering new
          devices with ease!
        </p>
      </div>
    </div>
  );
}