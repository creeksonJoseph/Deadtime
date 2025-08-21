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

        const savedUser = storedUser ? JSON.parse(storedUser) : null;
        const finalUser = {
          ...(savedUser || {}),
          ...data.user,
          id: data.user._id || data.user.id,
          // Preserve profilepic if backend omits it
          profilepic: data.user.profilepic ?? savedUser?.profilepic ?? "",
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
    const finalUser = {
      ...userObj,
      id: userObj.id, // always use id from backend
    };
    setToken(newToken);
    localStorage.setItem("token", newToken);
    localStorage.setItem("userId", userObj.id);

    // Fetch full profile here
    const profileData = await getUserProfile(userObj.id, newToken);
    const savedUser = localStorage.getItem("user");
    const savedUserObj = savedUser ? JSON.parse(savedUser) : null;
    const mergedUser = {
      ...(savedUserObj || {}),
      ...(profileData?.user || {}),
      id: profileData?.user?._id || profileData?.user?.id || userObj.id,
      profilepic:
        profileData?.user?.profilepic ??
        savedUserObj?.profilepic ??
        userObj.profilepic ??
        "",
    };
    setUser(mergedUser);
    localStorage.setItem("user", JSON.stringify(mergedUser));

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
