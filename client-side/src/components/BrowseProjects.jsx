import { useEffect, useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { getGhostCards } from "../api/ghostcards";
import { useAuth } from "../contexts/AuthContext";
import { Search, Filter } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { createGhostNote } from "../api/ghostnotes";
import { toast } from "react-toastify";

export function BrowseProjects({ onOpenProject, onOpenReviveModal }) {
  const { user, token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const statusFilters = ["All", "abandoned", "on-hold", "revived"];
  const typeFilters = ["All", "code", "business", "content", "other"];
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    getGhostCards(token).then(setProjects);
  }, [token]);

  // Only show projects not owned by me
  const filteredProjects = projects
    .filter((p) => p.ownerId !== user.id)
    .filter((p) => selectedStatus === "All" || p.status === selectedStatus)
    .filter((p) => selectedType === "All" || p.type === selectedType);

  const handleReviveProject = async (project) => {
    // Call your revive API here
    await reviveProjectAPI(project.id);

    // Create a ghost note after reviving
    await createGhostNote(
      {
        projectId: project.id,
        note: `💖 This project was revived by ${user.username}!`,
        isAnonymous: false,
        system: true, // if your backend supports it
      },
      token
    );

    // Optionally, refetch projects or update state
    getGhostCards(token).then(setProjects);

    // Show success toast
    toast.success("Project revived! The owner will be notified.");
  };

  return (
    <div className="min-h-screen pb-20 px-6 pt-8 animate-fade-up">
      {/* Header */}
      <div className="mb-8">
        <div className="glass rounded-xl p-8 mb-8 flex flex-col items-center justify-center neon-glow">
          <div className="text-5xl mb-2">👻</div>
          <h2 className="font-zasline text-2xl text-[#34e0a1] mb-2">
            Browse the Graveyard
          </h2>
          <p className="text-slate-400 text-center max-w-lg">
            Discover abandoned projects from the community. Revive something
            amazing!
          </p>
        </div>
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

        {/* Type Filters */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {typeFilters.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 whitespace-nowrap ${
                selectedType === type
                  ? "bg-[#34e0a1] text-[#141d38] neon-glow"
                  : "glass text-slate-400 hover:glass-strong hover:text-[#34e0a1]"
              }`}
            >
              {type}
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
                token={token}
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
              {project.ownerId !== user.id &&
                project.status === "abandoned" && (
                  <Button
                    className="bg-[#34e0a1] text-[#141d38] hover:bg-[#34e0a1]/90 neon-glow"
                    onClick={() => onOpenReviveModal(project)}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Revive Project
                  </Button>
                )}
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
    </div>
  );
}
