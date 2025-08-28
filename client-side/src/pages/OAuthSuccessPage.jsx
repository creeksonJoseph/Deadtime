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

    console.log('OAuth callback - token:', token ? 'present' : 'missing');
    console.log('OAuth callback - username:', username);

    if (token && username) {
      setStatus('Logging you in...');
      
      // Manually save token to localStorage first
      localStorage.setItem('token', token);
      
      // Create user object with available data
      const userData = { 
        username,
        id: username,
        role: 'user'
      };
      
      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userId', username);
      
      // Login user with GitHub token
      login(token, userData);
      
      setStatus('Success! Redirecting...');
    } else {
      console.error('Missing token or username in OAuth callback');
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