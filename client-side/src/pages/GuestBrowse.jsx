import { useState, useMemo, useEffect, useRef } from "react";
import { ProjectCard } from "../components/ProjectCard";
import { Search, Filter, Skull, ChevronDown, X } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { getGhostCards } from "../api/ghostcards";

export function GuestBrowse({ searchVisible = false }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showToast, setShowToast] = useState(true);
  const [showSearchBar, setShowSearchBar] = useState(searchVisible);
  const [isSticky, setIsSticky] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const filtersRef = useRef(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getGhostCards();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

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

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter((project) => {
      const matchesSearch =
        searchTerm === "" ||
        (project.title || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (project.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (project.author || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        selectedType === "all" || project.type === selectedType;

      return matchesSearch && matchesType;
    });

    switch (sortBy) {
      case "recent":
        filtered.sort((a, b) => {
          const dateA = new Date(a.dateAbandoned || a.createdAt || 0);
          const dateB = new Date(b.dateAbandoned || b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });
        break;
      case "oldest":
        filtered.sort((a, b) => {
          const dateA = new Date(a.dateAbandoned || a.createdAt || 0);
          const dateB = new Date(b.dateAbandoned || b.createdAt || 0);
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
  }, [projects, searchTerm, selectedType, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Skull className="w-16 h-16 mx-auto mb-4 text-[#34e0a1] animate-pulse" />
          <p className="text-slate-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-6 sm:py-2 md:py-4 lg:py-6 px-4 pb-24">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-4 z-50 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-in slide-in-from-right">
          <span className="text-sm font-medium">
            👻 Browsing as guest - Sign up to revive projects!
          </span>
          <button
            onClick={() => setShowToast(false)}
            className="text-white hover:text-red-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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
              <div key={project._id} className="relative">
                <ProjectCard
                  project={project}
                  token={null} // No token for guest
                  onClick={() => setShowLoginModal(true)}
                  showPostedBy={true}
                  currentUserId={null} // No user ID for guests
                  isMobile={true}
                />
                {/* Guest overlay - only show on desktop hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-lg items-center justify-center hidden md:flex">
                  <div className="text-center">
                    <p className="text-[#34e0a1] font-medium mb-2">
                      Sign up to view details
                    </p>
                    <Button
                      size="sm"
                      className="bg-[#34e0a1] hover:bg-[#34e0a1]/90 text-[#141d38]"
                      onClick={() => (window.location.href = "/signup")}
                    >
                      Join Now
                    </Button>
                  </div>
                </div>
              </div>
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

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowLoginModal(false)}
            />

            {/* Modal */}
            <div className="relative bg-[#141d38] rounded-2xl p-8 border border-slate-600/30 shadow-2xl max-w-md w-full mx-4">
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-slate-800/60 hover:bg-slate-700/60 rounded-full flex items-center justify-center transition-all duration-200"
              >
                <X className="w-4 h-4 text-slate-300" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#34e0a1]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Skull className="w-8 h-8 text-[#34e0a1]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Join the Graveyard
                </h3>
                <p className="text-slate-400 mb-6">
                  Sign up to view project details and help revive abandoned
                  projects!
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowLoginModal(false)}
                    className="flex-1 border-slate-600/40 text-slate-300 hover:bg-slate-800/40"
                  >
                    Maybe Later
                  </Button>
                  <Button
                    onClick={() => (window.location.href = "/signup")}
                    className="flex-1 bg-[#34e0a1] hover:bg-[#34e0a1]/90 text-[#141d38] font-semibold"
                  >
                    Join to View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
