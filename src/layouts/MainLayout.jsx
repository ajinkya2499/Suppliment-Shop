import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const MainLayout = () => (
  <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column" }}>
    <Navbar />
    <main style={{ flex: 1, background: "#f5f5f0" }}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default MainLayout;