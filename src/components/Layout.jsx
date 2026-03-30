// components/Layout.jsx
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />

      <div className="layout">
        <Sidebar />
        <main className="content">{children}</main>
      </div>

      <Footer />
    </>
  );
}