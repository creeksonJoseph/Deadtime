import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function OAuthSuccessPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const username = urlParams.get('username');

    if (token && username) {
      setStatus('Logging you in...');
      
      // Create user object with available data
      const userData = { 
        username,
        id: username, // Use username as temporary ID
        role: 'user'
      };
      
      // Login user with GitHub token
      login(token, userData);
      
      setStatus('Success! Redirecting...');
      // Remove the timeout, let login function handle navigation
      // setTimeout(() => {
      //   navigate('/dashboard');
      // }, 1000);
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