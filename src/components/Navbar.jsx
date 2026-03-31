import "./Navbar.css";
import { Link } from "react-router-dom";

export default function Navbar({ openSidebar }) {
  return (
    <header className="navbar">

      {/* LEFT: LOGO */}
      <div className="nav-left">
        <h1 className="logo">
          <img
            src="/phone.png"
            alt="PhoneArena Logo"
          />
          <span className="logo-text">Phone Arena</span>
          </h1>
      </div>

      {/* RIGHT: ACTIONS */}
      <div className="nav-right">

        <input
          type="text"
          placeholder="Quick search..."
          className="nav-search"
        />

        <div className="nav-icons">
          <Link to="/favorites">
            <span className="icon">❤️</span>
          </Link>
          <Link to="/settings">
            <span className="icon">⚙️</span>
          </Link>
        </div>

        <div className="profile">
          👤
        </div>

        <button
        className="menu-btn"
        onClick={openSidebar}
        >
            ☰
        </button>

      </div>

    </header>
  );
}