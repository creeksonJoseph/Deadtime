import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getUserProfile } from "../api/users";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Camera, LogOut, Star } from "lucide-react";

export function AccountPage() {
  const navigate = useNavigate();
  const { user, logout, token, loading } = useAuth();

  const [userInfo, setUserInfo] = useState(null);
  const [stats, setStats] = useState({
    totalProjects: 0,
    revivedProjects: 0,
    joinDate: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user || !token) return;
    async function fetchProfile() {
      const data = await getUserProfile(user.id, token);
      setUserInfo(data.user);
      setStats({
        totalProjects: data.postedProjects.length,
        revivedProjects: data.revivedProjects.length,
        joinDate: data.user.createdAt,
      });
    }
    fetchProfile();
  }, [user, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#34e0a1] border-b-4 border-[#141d38]" />
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Loading profile...</p>
      </div>
    );
  }

  const achievements = [
    {
      name: "Gravekeeper",
      description: "5 posted projects",
      icon: "⚰️",
      earned: true,
    },
    {
      name: "Necromancer",
      description: "3 revived projects",
      icon: "🪄",
      earned: true,
    },
    {
      name: "Digital Ghost",
      description: "10 posted projects",
      icon: "👻",
      earned: false,
    },
    {
      name: "Project Phoenix",
      description: "5 revived projects",
      icon: "🔥",
      earned: false,
    },
    {
      name: "Master Curator",
      description: "25 posted projects",
      icon: "🏛️",
      earned: false,
    },
    {
      name: "Soul Shepherd",
      description: "10 revived projects",
      icon: "🌟",
      earned: false,
    },
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Here you would save to backend
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const avatarUrl = URL.createObjectURL(file);
      setUserInfo((prev) => ({ ...prev, avatar: avatarUrl }));
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen pb-20 px-6 pt-8 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-zasline text-3xl text-[#34e0a1] mb-2">
            My Account
          </h1>
          <p className="text-slate-400">Manage your graveyard profile</p>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Profile Section */}
      <div className="glass rounded-2xl p-8 mb-8 neon-glow">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full glass flex items-center justify-center overflow-hidden">
              {userInfo.avatar ? (
                <img
                  src={userInfo.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-3xl">👤</div>
              )}
            </div>
            {isEditing && (
              <div className="absolute -bottom-2 -right-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-8 h-8 bg-[#34e0a1] text-[#141d38] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <Camera className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username" className="text-slate-300">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={userInfo.username}
                    onChange={(e) =>
                      setUserInfo((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    className="mt-1 glass border-[#34e0a1]/30 focus:border-[#34e0a1] text-slate-200"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-slate-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={userInfo.email}
                    onChange={(e) =>
                      setUserInfo((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="mt-1 glass border-[#34e0a1]/30 focus:border-[#34e0a1] text-slate-200"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleSave}
                    className="bg-[#34e0a1] text-[#141d38] hover:bg-[#34e0a1]/90 neon-glow"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="border-slate-600 text-slate-400 hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="font-zasline text-2xl text-slate-200 mb-2">
                  {userInfo.username}
                </h2>
                <p className="text-slate-400 mb-4">{userInfo.email}</p>
                <p className="text-slate-500 text-sm mb-4">
                  Joined{" "}
                  {new Date(stats.joinDate).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="border-[#34e0a1] text-[#34e0a1] hover:bg-[#34e0a1]/10"
                >
                  Edit Profile
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass rounded-lg p-6 text-center hover:glass-strong transition-all duration-300">
          <div className="text-2xl mb-2">⚰️</div>
          <div className="text-2xl font-bold text-[#34e0a1] mb-1">
            {stats.totalProjects}
          </div>
          <div className="text-slate-400 text-sm">Projects Buried</div>
        </div>
        <div className="glass rounded-lg p-6 text-center hover:glass-strong transition-all duration-300">
          <div className="text-2xl mb-2">🪄</div>
          <div className="text-2xl font-bold text-[#34e0a1] mb-1">
            {stats.projectsRevived}
          </div>
          <div className="text-slate-400 text-sm">Projects Revived</div>
        </div>
        <div className="glass rounded-lg p-6 text-center hover:glass-strong transition-all duration-300">
          <div className="text-2xl mb-2">❤️</div>
          <div className="text-2xl font-bold text-[#34e0a1] mb-1">
            {stats.revivedProjects}
          </div>
          <div className="text-slate-400 text-sm">Got Revived</div>
        </div>
        <div className="glass rounded-lg p-6 text-center hover:glass-strong transition-all duration-300">
          <div className="text-2xl mb-2">🏆</div>
          <div className="text-2xl font-bold text-[#34e0a1] mb-1">
            {achievements.filter((a) => a.earned).length}
          </div>
          <div className="text-slate-400 text-sm">Achievements</div>
        </div>
      </div>

      {/* Achievements */}
      <div className="glass rounded-2xl p-8 neon-glow">
        <h3 className="font-zasline text-xl text-[#34e0a1] mb-6">
          Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`glass rounded-lg p-4 transition-all duration-300 ${
                achievement.earned
                  ? "hover:glass-strong neon-glow"
                  : "opacity-50 hover:opacity-75"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-slate-200">
                      {achievement.name}
                    </h4>
                    {achievement.earned && (
                      <Star className="w-4 h-4 text-[#34e0a1] fill-current" />
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">
                    {achievement.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
