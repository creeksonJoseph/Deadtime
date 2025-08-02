import { ProjectCard } from "./ProjectCard";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen w-full animate-fade-up">
      {/* Desktop Header */}
      <header className="hidden lg:block glass-strong border-b border-[#34e0a1]/30 sticky top-0 z-50 backdrop-blur-xl w-full">
        <div className="px-8 py-6 w-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <h1 className="font-zasline text-4xl text-[#34e0a1] neon-glow-strong animate-pulse-glow">
              DeadTime
            </h1>
            <div className="w-px h-8 bg-[#34e0a1]/30" />
            <span className="text-slate-400">Digital Graveyard</span>
          </div>

          {/* User Welcome */}
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-slate-200">Welcome back,</p>
              <p className="text-[#34e0a1] font-zasline">
                Digital Archaeologist
              </p>
            </div>

            {/* SPA Link for Profile */}
            <Link
              to="/account"
              className="w-10 h-10 rounded-full glass flex items-center justify-center 
                         hover:glass-strong hover:scale-110 transition-transform duration-300"
              title="Go to Account"
            >
              <span className="text-xl">👤</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Full Width */}
      <div className="pb-20 pt-8 lg:pt-12 px-4 sm:px-6 lg:px-10 w-full">
        {/* Mobile Header */}
        <div className="lg:hidden mb-8">
          <h1 className="font-zasline text-3xl text-[#34e0a1] mb-2">
            The Graveyard
          </h1>
          <p className="text-slate-400">Welcome back, Digital Archaeologist</p>
        </div>

        {/* Desktop Section Title */}
        <div className="hidden lg:block mb-8">
          <h1 className="font-zasline text-4xl text-[#34e0a1] mb-3 neon-glow">
            The Graveyard
          </h1>
          <p className="text-slate-300 text-lg">
            Manage your digital afterlife
          </p>
        </div>

        {/* The Gravekeeper's Watch */}
        <div className="mb-8">
          <h2 className="font-zasline text-xl lg:text-2xl text-[#34e0a1] mb-6 neon-glow">
            The Gravekeeper&apos;s Watch
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6 w-full">
            <div className="glass rounded-xl p-8 text-center hover:glass-strong transition-all duration-300 neon-glow group w-full">
              <div className="text-4xl lg:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                ⚰️
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-[#34e0a1] mb-2">
                {userStats.buried}
              </div>
              <div className="text-slate-400">Buried Projects</div>
            </div>

            <div className="glass rounded-xl p-8 text-center hover:glass-strong transition-all duration-300 neon-glow group w-full">
              <div className="text-4xl lg:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🪄
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-[#34e0a1] mb-2">
                {userStats.revived}
              </div>
              <div className="text-slate-400">Back from the Dead</div>
            </div>

            <div className="glass rounded-xl p-8 text-center hover:glass-strong transition-all duration-300 neon-glow group w-full">
              <div className="text-4xl lg:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🌟
              </div>
              <div className="text-slate-400 mb-3">Achievements</div>
              <div className="flex flex-wrap gap-2 justify-center">
                {userStats.badges.map((badge, index) => (
                  <Badge
                    key={index}
                    className="bg-[#34e0a1]/20 text-[#34e0a1] border-[#34e0a1]/30 hover:bg-[#34e0a1]/30 transition-colors"
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
          <div className="mb-10 w-full">
            <h2 className="font-zasline text-xl lg:text-2xl text-[#34e0a1] mb-6 neon-glow">
              Recently Revived
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-4 w-full">
              {recentlyRevived.map((project) => (
                <div key={project.id} className="flex-shrink-0">
                  <div className="glass rounded-xl p-6 min-w-[240px] lg:min-w-[280px] hover:glass-strong transition-all duration-300 cursor-pointer hover:scale-105 neon-glow">
                    <h3 className="font-semibold text-slate-200 mb-2 text-lg">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-400 mb-3">
                      by {project.originalAuthor}
                    </p>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      Reviving
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RIP Projects */}
        {ripProjects.length > 0 && (
          <div className="mb-10 w-full">
            <h2 className="font-zasline text-xl lg:text-2xl text-[#34e0a1] mb-6 neon-glow">
              RIP Projects
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-4 w-full">
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

        {/* Active Projects */}
        {activeProjects.length > 0 && (
          <div className="mb-10 w-full">
            <h2 className="font-zasline text-xl lg:text-2xl text-[#34e0a1] mb-6 neon-glow">
              Active Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
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

        {/* Empty State */}
        {userProjects.length === 0 && (
          <div className="text-center py-20 lg:py-32 w-full">
            <div className="text-8xl lg:text-9xl mb-8 animate-float">💀</div>
            <h3 className="font-zasline text-2xl lg:text-3xl text-[#34e0a1] mb-4 neon-glow">
              Your graveyard is empty
            </h3>
            <p className="text-slate-400 mb-8 text-lg lg:text-xl">
              Start by burying your first project
            </p>
            <button
              onClick={onOpenForm}
              className="bg-[#34e0a1] text-[#141d38] px-8 py-4 rounded-xl hover:bg-[#34e0a1]/90 transition-all duration-300 hover:scale-105 neon-glow-strong text-lg font-semibold"
            >
              Bury Your First Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
