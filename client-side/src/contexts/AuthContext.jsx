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
      
      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      
      // For GitHub users, try to fetch complete profile from backend
      if (parsedUser?.isGitHubUser) {
        try {
          const data = await getUserProfile(parsedUser.id, token);
          if (data?.user) {
            const completeUser = {
              ...parsedUser,
              ...data.user,
              id: data.user._id || data.user.id,
              profilepic: data.user.profilepic || parsedUser.profilepic || "",
            };
            setUser(completeUser);
            localStorage.setItem("user", JSON.stringify(completeUser));
          } else {
            setUser(parsedUser);
          }
        } catch (err) {
          setUser(parsedUser);
        }
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        let userId = parsedUser?.id || localStorage.getItem("userId");
        const data = await getUserProfile(userId, token);

        if (!data || typeof data !== "object" || !data.user) {
          throw new Error("Profile API returned invalid data");
        }

        const finalUser = {
          ...(parsedUser || {}),
          ...data.user,
          id: data.user._id || data.user.id,
          profilepic: data.user.profilepic ?? parsedUser?.profilepic ?? "",
        };

        setUser(finalUser);
        localStorage.setItem("user", JSON.stringify(finalUser));
        localStorage.setItem("userId", finalUser.id);
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [token]);

  async function login(newToken, userObj) {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    
    const basicUser = {
      ...userObj,
      id: userObj.id || userObj.username || 'temp-id'
    };
    
    setUser(basicUser);
    localStorage.setItem("user", JSON.stringify(basicUser));
    localStorage.setItem("userId", basicUser.id);
    
    setLoading(false);
    navigate("/dashboard");
  }

  async function refreshUser() {
    if (!token || !user?.id) return;
    try {
      const data = await getUserProfile(user.id, token);
      if (data?.user) {
        const storedRaw = localStorage.getItem("user");
        const stored = storedRaw ? JSON.parse(storedRaw) : null;
        // Prefer the stored user (which may include profilepic) over in-memory user when merging
        const savedUser = stored || user || null;
        const updatedUser = {
          ...(savedUser || {}),
          ...data.user,
          id: data.user._id || data.user.id,
          // Preserve profilepic if backend omits it
          profilepic: data.user.profilepic ?? savedUser?.profilepic ?? "",
          // Store the project data for AccountPage
          postedProjects: data.postedProjects || [],
          revivedProjects: data.revivedProjects || [],
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (err) {
      // ignore
    }
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
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, refreshUser }}
    >
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
