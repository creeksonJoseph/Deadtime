import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ProjectCard } from "../components/ProjectCard";
import { Card } from "../components/ui/card";
import {
  Skull,
  Heart,
  Award,
  Calendar,
  TrendingUp,
  Clock,
  Users,
  Target,
  Zap,
} from "lucide-react";

export function Dashboard({ projects, onOpenProject, onDelete }) {
  const [revivedProjects, setRevivedProjects] = useState([]);
  const [userStats, setUserStats] = useState({
    buried: 0,
    revived: 0,
    badges: [],
    totalRevivals: 0,
    avgRevivalsPerProject: 0,
    recentActivity: [],
    joinDate: null,
    streak: 0,
  });
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();
  const buriedSectionRef = useRef(null);
  const revivedSectionRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (!user || !token) return;
    async function fetchData() {
      // Debug: Log available data
      console.log('🔍 Dashboard Data:', {
        user: user,
        projects: projects,
        userRevivedProjects: user.revivedProjects
      });
      
      // Get projects this user has revived (from user.revivedProjects)
      const revived = user.revivedProjects || [];
      setRevivedProjects(revived);
      
      // Calculate enhanced stats
      const totalRevivals = projects.reduce((sum, p) => sum + (p.revivedBy?.length || 0), 0);
      const avgRevivalsPerProject = projects.length > 0 ? (totalRevivals / projects.length).toFixed(1) : 0;
      
      // Create recent activity timeline
      const recentActivity = [
        ...projects.slice(0, 3).map(p => ({
          type: 'buried',
          title: p.title,
          date: p.createdAt,
          icon: Skull
        })),
        ...revived.slice(0, 3).map(p => ({
          type: 'revived', 
          title: p.title,
          date: p.revivedAt || p.createdAt,
          icon: Heart
        }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
      
      // Calculate streak (days since last activity)
      const lastActivity = recentActivity[0];
      const daysSinceActivity = lastActivity ? 
        Math.floor((Date.now() - new Date(lastActivity.date)) / (1000 * 60 * 60 * 24)) : 0;
      
      setUserStats({
        buried: projects.length,
        revived: revived.length,
        badges: [],
        totalRevivals,
        avgRevivalsPerProject,
        recentActivity,
        joinDate: user.createdAt,
        streak: Math.max(0, 7 - daysSinceActivity), // Simple streak calculation
      });
    }
    fetchData();
  }, [token, user, projects]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-[#34e0a1] border-b-[#141d38]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen sm:py-3 md:py-5 lg:py-7 px-4 pb-24">
      <div className="container mx-auto">
        {/* Welcome Header */}
        <div className="text-left mb-8 px-4">
          <h1 className="text-4xl md:text-6xl font-zasline text-[#34e0a1] mb-2">
            <span className="block md:inline">Welcome </span>
            <span className="block md:inline">back, {user.username}</span>
          </h1>
          <p className="text-lg text-slate-400">
            Your digital necromancy dashboard
          </p>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 mb-10 w-full">
          <Card className="tombstone-card p-3 md:p-4 text-center flex flex-col justify-center">
            <Skull className="w-5 h-5 md:w-8 md:h-8 mx-auto mb-1 text-[#34e0a1]" />
            <h3 className="text-lg md:text-xl font-bold text-white mb-1">
              {userStats.buried}
            </h3>
            <p className="text-xs text-slate-400">Buried</p>
          </Card>

          <Card className="tombstone-card p-3 md:p-4 text-center flex flex-col justify-center">
            <Heart className="w-5 h-5 md:w-8 md:h-8 mx-auto mb-1 text-[#fcdb32]" />
            <h3 className="text-lg md:text-xl font-bold text-white mb-1">
              {userStats.revived}
            </h3>
            <p className="text-xs text-slate-400">Revived</p>
          </Card>

          <Card className="tombstone-card p-3 md:p-4 text-center flex flex-col justify-center">
            <Users className="w-5 h-5 md:w-8 md:h-8 mx-auto mb-1 text-[#ff6b6b]" />
            <h3 className="text-lg md:text-xl font-bold text-white mb-1">
              {userStats.totalRevivals}
            </h3>
            <p className="text-xs text-slate-400">Total Revivals</p>
          </Card>

          <Card className="tombstone-card p-3 md:p-4 text-center flex flex-col justify-center">
            <TrendingUp className="w-5 h-5 md:w-8 md:h-8 mx-auto mb-1 text-[#4ecdc4]" />
            <h3 className="text-lg md:text-xl font-bold text-white mb-1">
              {userStats.avgRevivalsPerProject}
            </h3>
            <p className="text-xs text-slate-400">Avg/Project</p>
          </Card>

          <Card className="tombstone-card p-3 md:p-4 text-center flex flex-col justify-center">
            <Zap className="w-5 h-5 md:w-8 md:h-8 mx-auto mb-1 text-[#ffd93d]" />
            <h3 className="text-lg md:text-xl font-bold text-white mb-1">
              {userStats.streak}
            </h3>
            <p className="text-xs text-slate-400">Day Streak</p>
          </Card>

          <Card className="tombstone-card p-3 md:p-4 text-center flex flex-col justify-center">
            <Award className="w-5 h-5 md:w-8 md:h-8 mx-auto mb-1 text-[#a78bfa]" />
            <h3 className="text-lg md:text-xl font-bold text-white mb-1">
              {userStats.badges.length}
            </h3>
            <p className="text-xs text-slate-400">Badges</p>
          </Card>
        </div>

        {/* Activity Timeline & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="tombstone-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-[#34e0a1]" />
                <h3 className="text-xl font-bold text-white">Recent Activity</h3>
              </div>
              <div className="space-y-3">
                {userStats.recentActivity.length > 0 ? (
                  userStats.recentActivity.map((activity, index) => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                        <IconComponent className={`w-5 h-5 ${
                          activity.type === 'buried' ? 'text-[#34e0a1]' : 'text-[#fcdb32]'
                        }`} />
                        <div className="flex-1">
                          <p className="text-white font-medium">{activity.title}</p>
                          <p className="text-xs text-slate-400">
                            {activity.type === 'buried' ? 'Buried' : 'Revived'} • {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-slate-400 text-center py-4">No recent activity</p>
                )}
              </div>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card className="tombstone-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-[#34e0a1]" />
                <h4 className="font-bold text-white">Member Since</h4>
              </div>
              <p className="text-slate-300">
                {userStats.joinDate ? new Date(userStats.joinDate).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                }) : new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </Card>

            <Card className="tombstone-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-[#fcdb32]" />
                <h4 className="font-bold text-white">Success Rate</h4>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[#34e0a1] to-[#fcdb32] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (userStats.avgRevivalsPerProject * 20))}%` }}
                  ></div>
                </div>
                <span className="text-sm text-slate-300">
                  {Math.min(100, Math.round(userStats.avgRevivalsPerProject * 20))}%
                </span>
              </div>
            </Card>

            <Card className="tombstone-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-[#4ecdc4]" />
                <h4 className="font-bold text-white">Impact Score</h4>
              </div>
              <div className="text-2xl font-bold text-[#4ecdc4]">
                {Math.round((userStats.buried * 10) + (userStats.revived * 15) + (userStats.totalRevivals * 5))}
              </div>
              <p className="text-xs text-slate-400">Based on activity</p>
            </Card>
          </div>
        </div>

        {/* User Projects */}
        <div ref={buriedSectionRef} className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-1 h-8 bg-[#34e0a1] rounded-full"></div>
              <h2 className="text-3xl font-roboto text-white font-bold flex items-center gap-3">
                <Skull className="w-7 h-7 text-[#34e0a1]" />
                Your Buried Projects
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 md:gap-4">
            {projects.length > 0 ? (
              projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onClick={() => onOpenProject(project)}
                  showPostedBy={false}
                  currentUserId={user?.id}
                  token={token}
                  onDelete={onDelete}
                  isMobile={true}
                />
              ))
            ) : (
              <Card className="tombstone-card p-8 text-center col-span-full">
                <Skull className="w-10 h-10 mx-auto mb-3 text-slate-500" />
                <p className="text-slate-400">
                  You haven't buried any projects yet.
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Revived Projects */}
        <div ref={revivedSectionRef} className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-1 h-8 bg-[#fcdb32] rounded-full"></div>
              <h2 className="text-3xl font-roboto text-white font-bold flex items-center gap-3">
                <Heart className="w-7 h-7 text-[#fcdb32]" />
                Projects You Revived
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 md:gap-4">
            {revivedProjects.length > 0 ? (
              revivedProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onClick={() => onOpenProject(project)}
                  currentUserId={user?.id}
                  token={token}
                  isMobile={true}
                />
              ))
            ) : (
              <Card className="tombstone-card p-8 text-center col-span-full">
                <Heart className="w-10 h-10 mx-auto mb-3 text-slate-500" />
                <p className="text-slate-400">
                  You haven't revived any projects yet.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
