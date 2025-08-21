import { useState, useMemo, useEffect, useRef } from "react";
import { ProjectCard } from "../components/ProjectCard";
import { Search, Filter, Skull, ChevronDown } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export function BrowseProjects({
  projects,
  token,
  onOpenProject,
  currentUserId,
  onProjectRevived,
  searchVisible = false,
  sidebarOpen,
}) {
  // projects = only other users' projects, passed from AppContent
  const [projectsWithUsernames, setProjectsWithUsernames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(searchVisible);
  const [isSticky, setIsSticky] = useState(false);
  const filtersRef = useRef(null);

  // Project types for filter buttons
  const projectTypes = [
    { value: "all", label: "All Projects", count: projects.length },
    {
      value: "code",
      label: "Code",
      count: projects.filter((p) => p.type === "code").length,
    },
    {
      value: "business",
      label: "Business",
      count: projects.filter((p) => p.type === "business").length,
    },
    {
      value: "content",
      label: "Content",
      count: projects.filter((p) => p.type === "content").length,
    },
    {
      value: "other",
      label: "Other",
      count: projects.filter((p) => p.type === "other").length,
    },
  ];

  // Filtering and sorting logic
  const filteredAndSortedProjects = useMemo(() => {
    const searchData =
      projectsWithUsernames.length > 0 ? projectsWithUsernames : projects;
    let filtered = searchData.filter((project) => {
      const matchesSearch =
        searchTerm === "" ||
        (project.title || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (project.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (project.authorUsername || project.author || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesType =
        selectedType === "all" || project.type === selectedType;

      return matchesSearch && matchesType;
    });

    switch (sortBy) {
      case "recent":
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });
        break;
      case "oldest":
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateA.getTime() - dateB.getTime();
        });
        break;
      case "revivals":
        filtered.sort(
          (a, b) => (b.revivedBy?.length || 0) - (a.revivedBy?.length || 0)
        );
        break;
    }

    return filtered;
  }, [projects, projectsWithUsernames, searchTerm, selectedType, sortBy]);

  useEffect(() => {
    const handleScroll = () => {
      if (filtersRef.current && showSearchBar) {
        const rect = filtersRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 80);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showSearchBar]);

  useEffect(() => {
    setShowSearchBar(searchVisible);
  }, [searchVisible]);

  useEffect(() => {
    const fetchUsernames = async () => {
      if (!token || !projects.length) {
        setProjectsWithUsernames(projects);
        return;
      }

      const projectsWithUsers = await Promise.all(
        projects.map(async (project) => {
          try {
            const userRes = await fetch(
              `https://deadtime.onrender.com/api/users/${project.creatorId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            if (userRes.ok) {
              const userData = await userRes.json();
              return {
                ...project,
                authorUsername: userData.user?.username || "Unknown",
              };
            }
          } catch (error) {
            // ignore
          }
          return { ...project, authorUsername: "Unknown" };
        })
      );
      setProjectsWithUsernames(projectsWithUsers);
    };

    fetchUsernames();
  }, [projects, token]);

  return (
    <div className={`min-h-screen sm:py-2 md:py-4 lg:py-6 px-4 pb-24 transition-all duration-300 ${sidebarOpen ? 'md:ml-20' : 'md:ml-0'}`}>
      <div className="container mx-auto">
        {/* Filters and Search */}
        {showSearchBar && (
          <div
            ref={filtersRef}
            className={`glass rounded-lg p-4 md:p-6 mb-8 transition-all duration-200 ${
              isSticky
                ? "fixed top-20 left-4 right-4 z-40 mx-auto max-w-7xl"
                : ""
            }`}
          >
            {/* Mobile: Search + Filter Button */}
            <div className="md:hidden">
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="px-3 border-[#34e0a1]/30 hover:bg-[#34e0a1] hover:text-[#141d38]"
                >
                  <Filter className="w-4 h-4" />
                  <ChevronDown
                    className={`w-4 h-4 ml-1 transition-transform ${filtersOpen ? "rotate-180" : ""}`}
                  />
                </Button>
              </div>

              {/* Mobile Filters Dropdown */}
              {filtersOpen && (
                <div className="space-y-4 border-t border-slate-600/30 pt-4">
                  {/* Sort */}
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">
                      Sort by
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full bg-[#141d38] border border-slate-600 rounded-md px-3 py-2 text-sm text-slate-200"
                    >
                      <option value="recent">Recently Abandoned</option>
                      <option value="oldest">Oldest First</option>
                      <option value="revivals">Most Revivals</option>
                    </select>
                  </div>

                  {/* Type Filters */}
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">
                      Project Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {projectTypes.map((type) => (
                        <Button
                          key={type.value}
                          variant={
                            selectedType === type.value ? "default" : "outline"
                          }
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
                </div>
              )}
            </div>

            {/* Desktop: Original Layout */}
            <div className="hidden md:block">
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
                    variant={
                      selectedType === type.value ? "default" : "outline"
                    }
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
          </div>
        )}

        {/* Spacer when sticky */}
        {isSticky && showSearchBar && <div className="h-32 md:h-40"></div>}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Skull className="w-8 h-8 text-[#34e0a1] animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-gothic text-[#34e0a1]">
              The Graveyard
            </h1>
            <Skull className="w-8 h-8 text-[#34e0a1] animate-pulse" />
          </div>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Browse the digital remains of abandoned projects. Each tombstone
            tells a story waiting for resurrection.
          </p>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-400">
            Found {filteredAndSortedProjects.length} abandoned project
            {filteredAndSortedProjects.length !== 1 ? "s" : ""}
          </p>

          {/* {filteredAndSortedProjects.some((p) => p.revivedBy?.length > 0) && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#34e0a1] rounded-full animate-pulse" />
              <span className="text-sm text-[#34e0a1]">
                Projects with revivals
              </span>
            </div>
          )} */}
        </div>

        {/* Projects Grid */}
        {filteredAndSortedProjects.length > 0 ? (
          <div className="grid gap-0 md:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                token={token}
                onClick={() => onOpenProject(project)}
                showPostedBy={true}
                currentUserId={currentUserId}
                isMobile={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Skull className="w-16 h-16 mx-auto mb-4 text-slate-400 opacity-50" />
            <h3 className="text-3xl font-semibold mb-2">No Projects Found</h3>
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
