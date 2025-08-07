import { useEffect, useState } from "react";
import { getGhostCards } from "../api/ghostcards";
import { useAuth } from "../contexts/AuthContext";
import { ProjectCard } from "./ProjectCard";
import { Badge } from "./ui/badge";

export function Dashboard({ onOpenProject, onOpenForm }) {
  const [userProjects, setUserProjects] = useState([]);
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
      const allProjects = await getGhostCards(token);
      const mine = allProjects.filter((p) => p.creatorId === user.id);
      const revived = allProjects.filter(
        (p) => Array.isArray(p.revivedBy) && p.revivedBy.includes(user.id)
      );
      setUserProjects(mine);
      setRevivedProjects(revived);
      setUserStats({
        buried: mine.length,
        revived: revived.length,
        badges: [],
      });
    }
    fetchData();
  }, [token, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#34e0a1] border-b-4 border-[#141d38]" />
      </div>
    );
  }

  if (!user) {
    // Optionally redirect or show a message
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 px-6 pt-8 animate-fade-up">
      <h1 className="font-zasline text-3xl text-[#34e0a1] mb-2">
        The Graveyard
      </h1>
      <p className="text-slate-400">Welcome back, {user.username}</p>
      <div className="mb-8">
        <h2 className="font-zasline text-xl text-[#34e0a1] mb-4">
          Your Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onClick={() => onOpenProject(project)}
              showPostedBy={false}
            />
          ))}
        </div>
      </div>
      <div className="mb-8">
        <h2 className="font-zasline text-xl text-[#34e0a1] mb-4">
          Revived by Me
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {revivedProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onClick={() => onOpenProject(project)}
            />
          ))}
        </div>
      </div>
      <div className="mb-8">
        <h2 className="font-zasline text-xl text-[#34e0a1] mb-4">Stats</h2>
        <div className="flex gap-4">
          <div className="glass rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-[#34e0a1] mb-1">
              {userStats.buried}
            </div>
            <div className="text-slate-400 text-sm">Buried Projects</div>
          </div>
          <div className="glass rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-[#34e0a1] mb-1">
              {userStats.revived}
            </div>
            <div className="text-slate-400 text-sm">Revived Projects</div>
          </div>
        </div>
      </div>
      <button
        onClick={onOpenForm}
        className="bg-[#34e0a1] text-[#141d38] px-6 py-3 rounded-lg hover:bg-[#34e0a1]/90 transition-all duration-300 hover:scale-105 neon-glow"
      >
        Submit New Dead Project
      </button>
    </div>
  );
}
