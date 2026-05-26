import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";

const MainLayout = () => (
  <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8f8f8" }}>
    <Navbar />
    <main style={{ flex: 1 }}>
      <Outlet />
    </main>
    <footer style={{ background: "#0d0d0d", color: "#888", padding: "1rem", textAlign: "center", fontSize: "13px" }}>
      © 2025 FuelFit. Footer coming soon.
    </footer>
  </div>
);

export default MainLayout;