import "./Navbar.css";

export default function Navbar({ openSidebar }) {
  return (
    <header className="navbar">

      {/* LEFT: LOGO */}
      <div className="nav-left">
        <h1 className="logo">PhoneArena</h1>
      </div>

      {/* RIGHT: ACTIONS */}
      <div className="nav-right">

        <input
          type="text"
          placeholder="Quick search..."
          className="nav-search"
        />

        <div className="nav-icons">
          <span className="icon">🔔</span>
          <span className="icon">⚙️</span>
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