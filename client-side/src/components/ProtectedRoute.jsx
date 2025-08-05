import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // make sure this file exists

export function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
