import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Register page just opens the Login page on the Register tab
const Register = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/login", { state: { tab: "register" }, replace: true });
  }, [navigate]);
  return null;
};

export default Register;