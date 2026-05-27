import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import MainLayout    from "../layouts/MainLayout";
import Home          from "../pages/Home";
import Products      from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import Cart          from "../pages/Cart";
import Login         from "../pages/Login";
import Register      from "../pages/Register";

/* Wraps pages that need login */
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((s) => s.auth);
  const location = useLocation();
  if (!isLoggedIn)
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route path="/"            element={<Home />} />
      <Route path="/products"    element={<Products />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/cart"        element={<Cart />} />
      <Route path="/login"       element={<Login />} />
      <Route path="/register"    element={<Register />} />
      {/* Protected — add more here later */}
      <Route path="/profile"     element={<ProtectedRoute><div style={{padding:"2rem"}}><h2>Profile page coming soon</h2></div></ProtectedRoute>} />
      <Route path="/orders"      element={<ProtectedRoute><div style={{padding:"2rem"}}><h2>Orders page coming soon</h2></div></ProtectedRoute>} />
    </Route>
  </Routes>
);

export default AppRoutes;