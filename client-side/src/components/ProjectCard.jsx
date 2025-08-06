import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { ExternalLink } from "lucide-react";

export function ProjectCard({ project, onClick }) {
  const [username, setUsername] = useState("Loading...");

  // Map backend statuses to UI labels & colors
  const getStatusLabel = (status) => {
    switch (status) {
      case "abandoned":
        return "RIP";
      case "on-hold":
        return "Reviving";
      case "revived":
        return "Still Hopeful";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "abandoned":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "on-hold":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "revived":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const truncatedDescription =
    project.description?.length > 60
      ? project.description.slice(0, 60) + "..."
      : project.description;

  // Fetch creator username
  useEffect(() => {
    if (!project.creatorId) return;
    fetch(`https://your-api/users/${project.creatorId}`)
      .then((res) => res.json())
      .then((user) => setUsername(user.name || "Unknown"))
      .catch(() => setUsername("Unknown"));
  }, [project.creatorId]);

  return (
    <div className="glass rounded-lg overflow-hidden hover:glass-strong hover:scale-105 transition-all duration-300 cursor-pointer neon-glow w-full max-w-sm">
      {/* Image Section */}
      {project.logoUrl && (
        <div className="h-40 w-full overflow-hidden">
          <img
            src={project.logoUrl}
            alt={project.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content Section */}
      <div className="p-4 flex flex-col justify-between min-h-[180px]">
        <div>
          <h3 className="font-semibold text-slate-200 mb-1 line-clamp-1">
            {project.title}
          </h3>
          <p className="text-xs text-slate-500 mb-1">
            {formatDate(project.createdAt)}
          </p>

          <p className="text-xs text-slate-400 mb-2">Posted by: {username}</p>

          <Badge className={getStatusColor(project.status)}>
            {getStatusLabel(project.status)}
          </Badge>

          <p className="text-sm text-slate-400 mt-3 line-clamp-2">
            {truncatedDescription}
          </p>
        </div>

        <button
          onClick={onClick}
          className="mt-4 text-[#34e0a1] hover:underline text-sm self-start"
        >
          View More
        </button>
      </div>
    </div>
  );
}
