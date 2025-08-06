import { useEffect, useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { getGhostCards } from "../api/ghostcards";
import { useAuth } from "../contexts/AuthContext";
import { Search, Filter } from "lucide-react";
import { Input } from "./ui/input";

export function BrowseProjects({ onOpenProject }) {
  const [projects, setProjects] = useState([]);
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const statusFilters = ["All", "RIP", "Reviving", "Still Hopeful"];
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    getGhostCards(token).then(setProjects);
  }, [token]);

  const filteredProjects = projects.filter((p) => {
    const matchesStatus =
      selectedStatus === "All" || p.status === selectedStatus;
    const matchesQuery =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description &&
        p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.author && p.author.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="min-h-screen pb-20 px-6 pt-8 animate-fade-up">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-zasline text-3xl text-[#34e0a1] mb-2">
          Browse the Graveyard
        </h1>
        <p className="text-slate-400">Discover projects waiting for revival</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, descriptions, or authors..."
            className="pl-10 glass border-[#34e0a1]/30 focus:border-[#34e0a1] text-slate-200 placeholder:text-slate-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          {statusFilters.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 whitespace-nowrap ${
                selectedStatus === status
                  ? "bg-[#34e0a1] text-[#141d38] neon-glow"
                  : "glass text-slate-400 hover:glass-strong hover:text-[#34e0a1]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Project Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="space-y-2">
              <ProjectCard
                project={project}
                onClick={() => onOpenProject(project)}
              />
              <div className="flex items-center justify-between px-2">
                <span className="text-xs text-slate-500">
                  by {project.author}
                </span>
                {project.status === "RIP" && (
                  <Badge className="bg-[#34e0a1]/20 text-[#34e0a1] border-[#34e0a1]/30 text-xs">
                    Available to Revive
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="font-zasline text-xl text-[#34e0a1] mb-2">
            No projects found
          </h3>
          <p className="text-slate-400">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Stats */}
      <div className="mt-12 glass rounded-lg p-6">
        <h3 className="font-zasline text-lg text-[#34e0a1] mb-4">
          Graveyard Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#34e0a1]">
              {projects.filter((p) => p.status === "RIP").length}
            </div>
            <div className="text-slate-400 text-sm">RIP Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {projects.filter((p) => p.status === "Reviving").length}
            </div>
            <div className="text-slate-400 text-sm">Being Revived</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {projects.filter((p) => p.status === "Still Hopeful").length}
            </div>
            <div className="text-slate-400 text-sm">Still Hopeful</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#34e0a1]">
              {projects.length}
            </div>
            <div className="text-slate-400 text-sm">Total Projects</div>
          </div>
        </div>
      </div>
    </div>
  );
}
