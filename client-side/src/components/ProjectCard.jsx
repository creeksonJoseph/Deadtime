import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { ExternalLink, User } from "lucide-react";

function PostedBy({ username }) {
  return (
    <div className="flex items-center gap-3 pt-2 border-t border-slate-700/50">
      <div className="w-8 h-8 bg-gradient-to-br from-[#fcdb32] to-[#fcdb32]/70 rounded-full flex items-center justify-center flex-shrink-0">
        <User className="w-4 h-4 text-[#141d38]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-400 text-xs">Posted by</p>
        <p className="text-white text-sm font-medium truncate">{username}</p>
      </div>
    </div>
  );
}

export function ProjectCard({ project, token, onClick, showPostedBy = true }) {
  const [username, setUsername] = useState("Loading...");

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

  const truncateDescription = (text, maxLength = 120) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  useEffect(() => {
    if (!project.creatorId) {
      console.warn("No creatorId found for project:", project);
      return;
    }

    fetch(`https://deadtime.onrender.com/api/users/${project.creatorId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }
        return res.json();
      })
      .then((user) => {
        setUsername(user.user?.username || "Unknown");
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setUsername("Unknown");
      });
  }, [project.creatorId, token]);

  return (
    <div className="w-[300px] h-[380px] bg-[#141d38] rounded-2xl border border-slate-600/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col overflow-hidden">
      {project.logoUrl && (
        <div className="h-32 w-full overflow-hidden">
          <img
            src={project.logoUrl}
            alt={project.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        <div className="mb-3">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 flex-1 mr-2">
              {project.title}
            </h3>
            <Badge
              className={`${getStatusColor(project.status)} text-xs px-2 py-1 rounded-md border`}
            >
              {getStatusLabel(project.status)}
            </Badge>
          </div>

          <p className="text-slate-400 text-xs mb-1">
            Posted on {formatDate(project.createdAt)}
          </p>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed mb-4 flex-1">
          {truncateDescription(project.description)}
        </p>

        <div className="space-y-4 mt-auto">
          <button
            onClick={onClick}
            className="w-full bg-transparent border border-[#fcdb32] text-[#fcdb32] py-2.5 px-4 rounded-lg hover:bg-[#fcdb32] hover:text-[#141d38] transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <span>View More</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {showPostedBy && <PostedBy username={username} />}
        </div>
      </div>
    </div>
  );
}
