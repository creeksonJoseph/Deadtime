import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    // Show a spinner or skeleton while loading
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#34e0a1] border-b-4 border-[#141d38]" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
