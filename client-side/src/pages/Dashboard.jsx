import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ProjectCard } from "../components/ProjectCard";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
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
  const navigate = useNavigate();
  const buriedSectionRef = useRef(null);
  const revivedSectionRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (!user || !token) return;
    async function fetchData() {
      // Get projects this user has revived (from user.revivedProjects)
      const revived = user.revivedProjects || [];
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

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-10 w-full">
          <Card
            className="tombstone-card p-3 md:p-6 text-center aspect-square md:aspect-auto flex flex-col justify-center cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => scrollToSection(buriedSectionRef)}
          >
            <Skull className="w-6 h-6 md:w-10 md:h-10 mx-auto mb-1 md:mb-2 text-[#34e0a1]" />
            <h3 className="text-lg md:text-2xl font-bold text-white mb-1">
              {userStats.buried}
            </h3>
            <p className="text-xs md:text-sm text-slate-400">Buried</p>
          </Card>

          <Card
            className="tombstone-card p-3 md:p-6 text-center aspect-square md:aspect-auto flex flex-col justify-center cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => scrollToSection(revivedSectionRef)}
          >
            <Heart className="w-6 h-6 md:w-10 md:h-10 mx-auto mb-1 md:mb-2 text-[#34e0a1]" />
            <h3 className="text-lg md:text-2xl font-bold text-white mb-1">
              {userStats.revived}
            </h3>
            <p className="text-xs md:text-sm text-slate-400">Revived</p>
          </Card>

          <Card
            className="tombstone-card p-3 md:p-6 text-center aspect-square md:aspect-auto flex flex-col justify-center cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => navigate("/account")}
          >
            <Award className="w-6 h-6 md:w-10 md:h-10 mx-auto mb-1 md:mb-2 text-[#34e0a1]" />
            <h3 className="text-lg md:text-2xl font-bold text-white mb-1">
              {userStats.badges.length}
            </h3>
            <p className="text-xs md:text-sm text-slate-400">Badges</p>
          </Card>
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
