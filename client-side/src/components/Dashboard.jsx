import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ProjectCard } from "./ProjectCard";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Skull,
  Heart,
  Award,
  Plus,
  Map,
  TrendingUp,
  Calendar,
} from "lucide-react";

export function Dashboard({ projects, onOpenProject, onDelete }) {
  const [revivedProjects, setRevivedProjects] = useState([]);
  const [userStats, setUserStats] = useState({
    buried: 0,
    revived: 0,
    badges: [],
  });
  const { user, token, loading } = useAuth();

  useEffect(() => {
    if (!user || !token) return;
    async function fetchData() {
      const revived = projects.filter(
        (p) => Array.isArray(p.revivedBy) && p.revivedBy.includes(user.id)
      );
      setRevivedProjects(revived);
      setUserStats({
        buried: projects.length,
        revived: revived.length,
        badges: [],
      });
    }
    fetchData();
  }, [token, user, projects]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#34e0a1] border-b-4 border-[#141d38]" />
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
    <div className="min-h-screen py-8 px-4 pb-24">
      <div className="container mx-auto">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-zasline text-[#34e0a1] mb-2">
            Welcome back, {user.username}
          </h1>
          <p className="text-lg text-slate-400">
            Your digital necromancy dashboard
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-10 w-full">
          <Card className="tombstone-card p-3 md:p-6 text-center">
            <Skull className="w-6 h-6 md:w-10 md:h-10 mx-auto mb-1 md:mb-2 text-[#34e0a1]" />
            <h3 className="text-lg md:text-2xl font-bold text-white mb-1">
              {userStats.buried}
            </h3>
            <p className="text-xs md:text-sm text-slate-400">Buried</p>
          </Card>

          <Card className="tombstone-card p-3 md:p-6 text-center">
            <Heart className="w-6 h-6 md:w-10 md:h-10 mx-auto mb-1 md:mb-2 text-[#34e0a1]" />
            <h3 className="text-lg md:text-2xl font-bold text-white mb-1">
              {userStats.revived}
            </h3>
            <p className="text-xs md:text-sm text-slate-400">Revived</p>
          </Card>

          <Card className="tombstone-card p-3 md:p-6 text-center">
            <Award className="w-6 h-6 md:w-10 md:h-10 mx-auto mb-1 md:mb-2 text-[#34e0a1]" />
            <h3 className="text-lg md:text-2xl font-bold text-white mb-1">
              {userStats.badges.length}
            </h3>
            <p className="text-xs md:text-sm text-slate-400">Badges</p>
          </Card>
        </div>

        {/* User Projects */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-4xl font-bold text-white flex items-center gap-2">
              <Skull className="w-6 h-6 text-[#34e0a1]" />
              Your Buried Projects
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-4xl font-bold text-white flex items-center gap-2">
              <Heart className="w-6 h-6 text-[#34e0a1]" />
              Revived projects
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {revivedProjects.length > 0 ? (
              revivedProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onClick={() => onOpenProject(project)}
                  currentUserId={user?.id}
                  token={token}
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
