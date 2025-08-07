import { createContext, useContext, useEffect, useState } from "react";
import { getUserProfile } from "../api/users";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    // Hydrate user from localStorage for instant UX (like IG)
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const storedUser = localStorage.getItem("user");
        let userId = storedUser
          ? JSON.parse(storedUser).id
          : localStorage.getItem("userId");

        // Always use userId from storage, never "me"
        const data = await getUserProfile(userId, token);

        if (!data || typeof data !== "object" || !data.user) {
          throw new Error("Profile API returned invalid data");
        }

        const finalUser = {
          ...data.user,
          id: data.user._id || data.user.id,
        };

        setUser(finalUser);
        localStorage.setItem("user", JSON.stringify(finalUser));
        localStorage.setItem("userId", finalUser.id);
      } catch (err) {
        console.error("Auth fetchProfile error:", err);
        logout();
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [token]);

  async function login(newToken, userObj) {
    const finalUser = {
      ...userObj,
      id: userObj.id, // always use id from backend
    };
    setToken(newToken);
    localStorage.setItem("token", newToken);
    localStorage.setItem("userId", userObj.id);

    // Fetch full profile here
    const profileData = await getUserProfile(userObj.id, newToken);
    setUser(profileData.user); // or setUser(profileData) if you want everything

    setLoading(false);
    navigate("/dashboard");
  }

  function logout() {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    navigate("/login");
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
