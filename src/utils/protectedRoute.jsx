// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  // Access auth state from Redux store
  const auth = useSelector((state) => state.auth.auth);

  if (!auth) {
    // If not logged in, redirect to login page
    return <Navigate to="/" replace />;
  }

  // If logged in, render the child components
  return children;
};

export default ProtectedRoute;
