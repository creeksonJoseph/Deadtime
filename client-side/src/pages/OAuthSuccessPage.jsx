import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function OAuthSuccessPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const username = urlParams.get('username');

    if (token && username) {
      // Login user with GitHub token
      login(token, { username });
      navigate('/dashboard');
    } else {
      // If no token, redirect to login
      navigate('/login');
    }
  }, [login, navigate]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#141d38]">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#34e0a1] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-[#34e0a1]">Completing GitHub login...</p>
      </div>
    </div>
  );
}