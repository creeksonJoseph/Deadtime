import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";

import { Badge } from "./ui/badge";
import { LogOut, Star } from "lucide-react";

export function AccountPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [userInfo, setUserInfo] = useState(null);
  const [stats, setStats] = useState({
    totalProjects: 0,
    revivedProjects: 0,
    joinDate: "",
  });


  useEffect(() => {
    if (!user) return;
    setUserInfo(user);
    setStats({
      totalProjects: user.postedProjects?.length || 0,
      revivedProjects: user.revivedProjects?.length || 0,
      joinDate: user.createdAt,
    });
  }, [user]);

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Loading profile...</p>
      </div>
    );
  }

  const badges = [
    {
      name: "Gravekeeper",
      icon: "⚰️",
      unlocked: stats.totalProjects >= 5,
      desc: "5 posted projects",
    },
    {
      name: "Necromancer",
      icon: "🪄",
      unlocked: stats.revivedProjects >= 3,
      desc: "3 revived projects",
    },
    {
      name: "Digital Ghost",
      icon: "👻",
      unlocked: stats.totalProjects >= 10,
      desc: "10 posted projects",
    },
    {
      name: "Project Phoenix",
      icon: "🔥",
      unlocked: stats.revivedProjects >= 5,
      desc: "5 revived projects",
    },
    {
      name: "Master Curator",
      icon: "🏛️",
      unlocked: stats.totalProjects >= 25,
      desc: "25 posted projects",
    },
    {
      name: "Soul Shepherd",
      icon: "🌟",
      unlocked: stats.revivedProjects >= 10,
      desc: "10 revived projects",
    },
  ];

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
          <div className="w-24 h-24 rounded-full glass flex items-center justify-center overflow-hidden">
            <div className="text-3xl">👤</div>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h2 className="font-zasline text-4xl text-slate-200 mb-2">
              {userInfo.username}
            </h2>
            <p className="text-slate-400 mb-4">{userInfo.email}</p>
            <p className="text-slate-500 text-sm">
              Joined{" "}
              {new Date(stats.joinDate).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
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
            {badges.filter((a) => a.unlocked).length}
          </div>
          <div className="text-slate-400 text-sm">Achievements</div>
        </div>
      </div>

      {/* Achievements */}
      <div className="glass rounded-2xl p-8 neon-glow grid grid-cols-2 md:grid-cols-3 gap-4">
        {badges.map((b) => (
          <div
            key={b.name}
            className={`flex flex-col items-center p-4 rounded-lg glass ${
              b.unlocked ? "neon-glow" : "opacity-50"
            }`}
          >
            <span className="text-3xl mb-2">{b.icon}</span>
            <span className="font-bold text-slate-200">{b.name}</span>
            <span className="text-xs text-slate-400">{b.desc}</span>
            {!b.unlocked && (
              <span className="text-xs text-yellow-400 mt-1">
                {b.name === "Gravekeeper"
                  ? `${5 - stats.totalProjects} to go`
                  : b.name === "Necromancer"
                    ? `${3 - stats.revivedProjects} to go`
                    : ""}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
