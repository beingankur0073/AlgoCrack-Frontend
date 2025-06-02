// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();

  if (!auth) {
    // If not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  return children; // If logged in, show the component
};

export default ProtectedRoute;
