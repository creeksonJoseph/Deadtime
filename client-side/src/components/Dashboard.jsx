import { ProjectCard } from "./ProjectCard";
import { Badge } from "./ui/badge";

// Mock data
const userStats = {
  buried: 12,
  revived: 5,
  badges: ["Gravekeeper", "Necromancer"],
};

const userProjects = [
  {
    id: "1",
    title: "TaskFlow App",
    status: "RIP",
    description: "A productivity app that never saw the light of day",
    createdAt: "2024-01-15",
    link: "https://github.com/user/taskflow",
    videos: ["https://example.com/video1.mp4"],
    isOwner: true,
  },
  {
    id: "2",
    title: "AI Chat Bot",
    status: "Reviving",
    description: "Working on bringing this chatbot back to life",
    createdAt: "2024-02-10",
    link: "https://github.com/user/chatbot",
    videos: [],
    isOwner: true,
  },
  {
    id: "3",
    title: "Weather Dashboard",
    status: "Still Hopeful",
    description: "A beautiful weather app with animated backgrounds",
    createdAt: "2024-03-05",
    link: "https://github.com/user/weather",
    videos: [],
    isOwner: true,
  },
];

const recentlyRevived = [
  {
    id: "4",
    title: "Music Player",
    status: "Reviving",
    description: "Revived from the digital graveyard",
    createdAt: "2024-01-20",
    originalAuthor: "DevGhost",
  },
];

export function Dashboard({ onOpenProject, onOpenForm }) {
  const ripProjects = userProjects.filter((p) => p.status === "RIP");
  const activeProjects = userProjects.filter((p) => p.status !== "RIP");

  return (
    <div className="min-h-screen pb-20 px-6 pt-8 animate-fade-up">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-zasline text-3xl text-[#34e0a1] mb-2">
          The Graveyard
        </h1>
        <p className="text-slate-400">Welcome back, Digital Archaeologist</p>
      </div>

      {/* The Gravekeeper's Watch - Stats Section */}
      <div className="mb-8">
        <h2 className="font-zasline text-xl text-[#34e0a1] mb-4">
          The Gravekeeper's Watch
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="glass rounded-lg p-6 text-center hover:glass-strong transition-all duration-300">
            <div className="text-3xl mb-2">⚰️</div>
            <div className="text-2xl font-bold text-[#34e0a1] mb-1">
              {userStats.buried}
            </div>
            <div className="text-slate-400 text-sm">Buried Projects</div>
          </div>
          <div className="glass rounded-lg p-6 text-center hover:glass-strong transition-all duration-300">
            <div className="text-3xl mb-2">🪄</div>
            <div className="text-2xl font-bold text-[#34e0a1] mb-1">
              {userStats.revived}
            </div>
            <div className="text-slate-400 text-sm">Back from the Dead</div>
          </div>
          <div className="glass rounded-lg p-6 text-center hover:glass-strong transition-all duration-300">
            <div className="text-3xl mb-2">🌟</div>
            <div className="text-sm text-slate-400 mb-2">Achievements</div>
            <div className="flex flex-wrap gap-1 justify-center">
              {userStats.badges.map((badge, index) => (
                <Badge
                  key={index}
                  className="bg-[#34e0a1]/20 text-[#34e0a1] border-[#34e0a1]/30"
                >
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recently Revived */}
      {recentlyRevived.length > 0 && (
        <div className="mb-8">
          <h2 className="font-zasline text-xl text-[#34e0a1] mb-4">
            Recently Revived
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {recentlyRevived.map((project) => (
              <div key={project.id} className="flex-shrink-0">
                <div className="glass rounded-lg p-4 min-w-[200px] hover:glass-strong transition-all duration-300 cursor-pointer">
                  <h3 className="font-semibold text-slate-200 mb-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 mb-2">
                    by {project.originalAuthor}
                  </p>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                    Reviving
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RIP Projects Section */}
      {ripProjects.length > 0 && (
        <div className="mb-8">
          <h2 className="font-zasline text-xl text-[#34e0a1] mb-4">
            RIP Projects
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {ripProjects.map((project) => (
              <div key={project.id} className="flex-shrink-0">
                <ProjectCard
                  project={project}
                  onClick={() => onOpenProject(project)}
                  variant="tombstone"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Projects Section */}
      {activeProjects.length > 0 && (
        <div className="mb-8">
          <h2 className="font-zasline text-xl text-[#34e0a1] mb-4">
            Active Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => onOpenProject(project)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {userProjects.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">💀</div>
          <h3 className="font-zasline text-xl text-[#34e0a1] mb-2">
            Your graveyard is empty
          </h3>
          <p className="text-slate-400 mb-6">
            Start by burying your first project
          </p>
          <button
            onClick={() => onOpenForm()}
            className="bg-[#34e0a1] text-[#141d38] px-6 py-3 rounded-lg hover:bg-[#34e0a1]/90 transition-all duration-300 hover:scale-105 neon-glow"
          >
            Bury Your First Project
          </button>
        </div>
      )}
    </div>
  );
}
