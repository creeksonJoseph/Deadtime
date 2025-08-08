import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { LogOut, Star } from "lucide-react";
import { ConfirmDialog } from "../components/ConfirmDialog";

export function AccountPage() {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();

  const [stats, setStats] = useState({
    totalProjects: 0,
    revivedProjects: 0,
    projectsRevived: 0,
    joinDate: "",
  });
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);


  useEffect(() => {
    if (!user) return;
    
    // If user data doesn't have project info, refresh it
    if (!user.postedProjects && !user.revivedProjects) {
      refreshUser();
      return;
    }
    
    // Calculate stats from cached user data
    setStats({
      totalProjects: user.postedProjects?.length || 0,
      revivedProjects: user.postedProjects?.filter(p => p.status === 'revived')?.length || 0,
      projectsRevived: user.revivedProjects?.length || 0,
      joinDate: user.createdAt,
    });
  }, [user, refreshUser]);

  if (!user) {
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
      unlocked: stats.projectsRevived >= 3,
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
      unlocked: stats.projectsRevived >= 5,
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
      unlocked: stats.projectsRevived >= 10,
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
          onClick={() => setShowLogoutDialog(true)}
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
              {user.username}
            </h2>
            <p className="text-slate-400 mb-4">{user.email}</p>
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
      <div className="glass rounded-2xl p-8 neon-glow">
        <h3 className="font-zasline text-2xl text-[#34e0a1] mb-6 text-center">
          🏆 Achievements
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                    ? `${3 - stats.projectsRevived} to go`
                    : ""}
              </span>
            )}
          </div>
        ))}
        </div>
      </div>
      
      <ConfirmDialog
        isOpen={showLogoutDialog}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutDialog(false)}
        title="Confirm Logout"
        message="Are you sure you want to leave the graveyard? You'll need to sign in again to access your account."
      />
    </div>
  );
}
