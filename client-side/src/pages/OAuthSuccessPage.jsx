import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function OAuthSuccessPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState('Processing...');
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const username = urlParams.get('username');

    if (token && username) {
      setStatus('Logging you in...');
      
      // Clear URL parameters to prevent re-processing
      window.history.replaceState({}, document.title, window.location.pathname);
      
      const userData = { 
        username,
        id: username,
        role: 'user',
        isGitHubUser: true
      };
      
      login(token, userData);
      setStatus('Success! Redirecting...');
    } else {
      setStatus('Authentication failed. Redirecting...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  }, [login, navigate]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#141d38]">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#34e0a1] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-[#34e0a1]">{status}</p>
      </div>
    </div>
  );
}