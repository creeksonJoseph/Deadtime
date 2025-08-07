import { useState, useMemo, useEffect } from "react";
import { ProjectCard } from "./ProjectCard";
import { getGhostCards } from "../api/ghostcards";
import { useAuth } from "../contexts/AuthContext";
import { Search, Filter, Skull } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export function BrowseProjects({ onOpenProject, onOpenReviveModal }) {
  const { user, token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    getGhostCards(token).then(setProjects);
  }, [token]);

  // Filter out my projects
  const otherProjects = useMemo(
    () => projects.filter((p) => p.ownerId !== user.id),
    [projects, user.id]
  );

  // Project types for filter buttons
  const projectTypes = [
    { value: "all", label: "All Projects", count: otherProjects.length },
    {
      value: "code",
      label: "Code",
      count: otherProjects.filter((p) => p.type === "code").length,
    },
    {
      value: "business",
      label: "Business",
      count: otherProjects.filter((p) => p.type === "business").length,
    },
    {
      value: "content",
      label: "Content",
      count: otherProjects.filter((p) => p.type === "content").length,
    },
    {
      value: "other",
      label: "Other",
      count: otherProjects.filter((p) => p.type === "other").length,
    },
  ];

  // Filtering and sorting logic
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = otherProjects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.author?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        );

      const matchesType =
        selectedType === "all" || project.type === selectedType;

      return matchesSearch && matchesType;
    });

    switch (sortBy) {
      case "recent":
        filtered.sort(
          (a, b) =>
            new Date(b.dateAbandoned).getTime() -
            new Date(a.dateAbandoned).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.dateAbandoned).getTime() -
            new Date(b.dateAbandoned).getTime()
        );
        break;
      case "revivals":
        filtered.sort(
          (a, b) => (b.revivals?.length || 0) - (a.revivals?.length || 0)
        );
        break;
    }

    return filtered;
  }, [otherProjects, searchTerm, selectedType, sortBy]);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Skull className="w-8 h-8 text-[#34e0a1] animate-pulse" />
            <h1 className="text-4xl font-gothic text-[#34e0a1]">
              The Graveyard
            </h1>
            <Skull className="w-8 h-8 text-[#34e0a1] animate-pulse" />
          </div>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Browse the digital remains of abandoned projects. Each tombstone
            tells a story waiting for resurrection.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="glass rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search for projects, owners, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#141d38] border border-slate-600 rounded-md px-3 py-2 text-sm text-slate-200"
              >
                <option value="recent">Recently Abandoned</option>
                <option value="oldest">Oldest First</option>
                <option value="revivals">Most Revivals</option>
              </select>
            </div>
          </div>

          {/* Type Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {projectTypes.map((type) => (
              <Button
                key={type.value}
                variant={selectedType === type.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type.value)}
                className={
                  selectedType === type.value
                    ? "bg-[#34e0a1] hover:bg-[#34e0a1]/90 text-[#141d38]"
                    : "hover:bg-[#34e0a1] hover:text-[#141d38] border-[#34e0a1]/30"
                }
              >
                {type.label} ({type.count})
              </Button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-400">
            Found {filteredAndSortedProjects.length} abandoned project
            {filteredAndSortedProjects.length !== 1 ? "s" : ""}
          </p>

          {filteredAndSortedProjects.some((p) => p.revivals?.length > 0) && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#34e0a1] rounded-full animate-pulse" />
              <span className="text-sm text-[#34e0a1]">
                Projects with revivals
              </span>
            </div>
          )}
        </div>

        {/* Projects Grid */}
        {filteredAndSortedProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                token={token}
                onClick={() => onOpenProject(project)}
                showPostedBy={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Skull className="w-16 h-16 mx-auto mb-4 text-slate-400 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Projects Found</h3>
            <p className="text-slate-400 mb-4">
              No abandoned projects match your search criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedType("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
