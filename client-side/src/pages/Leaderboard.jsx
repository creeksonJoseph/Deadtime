import { useEffect, useState } from "react";
import { getLeaderboard } from "../api/users";
import { useAuth } from "../contexts/AuthContext";
import { NetworkError } from "../components/NetworkError";
import { Trophy, Medal, Award, TrendingUp, Users, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Leaderboard({ sidebarOpen }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getLeaderboard(token)
      .then(users => {
        setUsers(users);
        setError("");
      })
      .catch(err => {
        if (!navigator.onLine) {
          setError("You're offline. Leaderboard will load when you're back online.");
        } else {
          setError("Failed to load leaderboard. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  }, [token]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-[#34e0a1]" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-slate-400 font-bold">{rank}</span>;
    }
  };

  const getRankBg = (rank) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-[#34e0a1]/20 to-[#34e0a1]/30 border-[#34e0a1]/30";
      case 2: return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30";
      case 3: return "bg-gradient-to-r from-amber-500/20 to-amber-600/20 border-amber-500/30";
      default: return "bg-slate-800/50 border-slate-600/30";
    }
  };

  const totalRevivals = users.reduce((sum, u) => sum + u.revivalCount, 0);
  const avgRevivals = users.length > 0 ? (totalRevivals / users.length).toFixed(1) : 0;
  const topReviver = users[0];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {error ? (
          <NetworkError 
            error={error} 
            onRetry={() => {
              setError("");
              setLoading(true);
              getLeaderboard(token)
                .then(users => {
                  setUsers(users);
                  setError("");
                })
                .catch(err => {
                  if (!navigator.onLine) {
                    setError("You're offline. Leaderboard will load when you're back online.");
                  } else {
                    setError("Failed to load leaderboard. Please try again.");
                  }
                })
                .finally(() => setLoading(false));
            }}
          />
        ) : (
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#34e0a1]"></div>
        )}
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-20 px-4 md:px-6 pt-8 transition-all duration-300 ${sidebarOpen ? 'md:ml-24' : 'md:ml-0'}`}>

        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-gothic text-[#34e0a1] mb-4">Revival Leaderboard</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Honoring the developers who breathe life back into abandoned projects
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Revivals</p>
                <p className="text-2xl font-bold text-[#34e0a1]">{totalRevivals}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-[#34e0a1]" />
            </div>
          </div>
          <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Revivers</p>
                <p className="text-2xl font-bold text-[#34e0a1]">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-[#34e0a1]" />
            </div>
          </div>
          <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Average Revivals</p>
                <p className="text-2xl font-bold text-[#34e0a1]">{avgRevivals}</p>
              </div>
              <Award className="w-8 h-8 text-[#34e0a1]" />
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        {users.length >= 3 && (
          <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-8 mb-8">
            <h3 className="text-xl font-bold text-[#34e0a1] mb-6 text-center">Top Revivers</h3>
            <div className="flex justify-center items-end space-x-4">
              {/* 2nd Place */}
              <div className="text-center">
                <div className="bg-gradient-to-t from-gray-600 to-gray-400 rounded-lg p-4 mb-2 h-20 flex items-end justify-center">
                  <Medal className="w-8 h-8 text-white" />
                </div>
                <p className="font-bold">{users[1]?.username}</p>
                <p className="text-[#34e0a1] text-lg">{users[1]?.revivalCount}</p>
              </div>
              
              {/* 1st Place */}
              <div className="text-center">
                <div className="bg-gradient-to-t from-[#34e0a1] to-[#4ade80] rounded-lg p-4 mb-2 h-32 flex items-end justify-center">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <p className="font-bold text-lg">{users[0]?.username}</p>
                <p className="text-[#34e0a1] text-xl font-bold">{users[0]?.revivalCount}</p>
              </div>
              
              {/* 3rd Place */}
              <div className="text-center">
                <div className="bg-gradient-to-t from-amber-700 to-amber-500 rounded-lg p-4 mb-2 h-16 flex items-end justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <p className="font-bold">{users[2]?.username}</p>
                <p className="text-[#34e0a1]">{users[2]?.revivalCount}</p>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-6">
          <h3 className="text-xl font-bold text-[#34e0a1] mb-6">Full Rankings</h3>
          <div className="space-y-3">
            {users.map((u, i) => {
              const rank = i + 1;
              const isCurrentUser = user && u._id === user.id;
              
              return (
                <div
                  key={u._id || u.username}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                    getRankBg(rank)
                  } ${isCurrentUser ? 'ring-2 ring-[#34e0a1]/50' : ''}`}
                >
                  <div className="flex items-center space-x-4">
                    {getRankIcon(rank)}
                    <div>
                      <p className={`font-medium ${isCurrentUser ? 'text-[#34e0a1]' : ''}`}>
                        {u.username} {isCurrentUser && '(You)'}
                      </p>
                      {rank <= 3 && (
                        <p className="text-xs text-slate-400">
                          {rank === 1 ? '👑 Revival Champion' : 
                           rank === 2 ? '🥈 Revival Master' : 
                           '🥉 Revival Expert'}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#34e0a1]">{u.revivalCount}</p>
                    <p className="text-xs text-slate-400">revivals</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {users.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No revivals yet. Be the first to revive a project!</p>
            </div>
          )}
        </div>
    </div>
  );
}
