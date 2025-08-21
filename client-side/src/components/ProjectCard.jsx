import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { ExternalLink, User, MoreVertical, Trash2 } from "lucide-react";

function PostedBy({ username }) {
  return (
    <div className="flex items-center gap-3 pt-2 border-t border-slate-700/50 bg-slate-800/10 -mx-6 px-6 pb-2">
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

export function ProjectCard({
  project,
  token,
  onClick,
  showPostedBy = true,
  onDelete,
  currentUserId,
  isMobile = false,
}) {
  const [username, setUsername] = useState("Loading...");
  const [menuOpen, setMenuOpen] = useState(false);
  const isOwner = currentUserId === project.creatorId;

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

  const truncateToWords = (text, maxWords = 40) => {
    if (!text) return "";
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + "...";
  };

  useEffect(() => {
    if (!project.creatorId) {
      console.warn("No creatorId found for project:", project);
      setUsername("Unknown");
      return;
    }

    // If no token (guest user), show generic username
    if (!token) {
      setUsername("Anonymous User");
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
    <div className={`${isMobile ? 'w-full bg-[#141d38] border-0 border-b border-b-slate-600/10 md:border md:border-slate-600/30 rounded-none md:rounded-2xl shadow-[0_4px_0_rgba(52,224,161,0.1)] md:shadow-lg mb-1 md:mb-0' : 'w-[300px] bg-[#141d38] rounded-2xl border border-slate-600/30 shadow-lg'} h-[380px] hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col overflow-hidden relative`}>
      {/* 3-dots menu - only show for project owner */}
      {isOwner && (
        <>
          <button
            className="absolute top-4 right-4 z-10 bg-slate-800/80 hover:bg-slate-700/80 rounded-full p-2 transition-all border border-slate-600/40"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((open) => !open);
            }}
          >
            <MoreVertical className="w-5 h-5 text-slate-300" />
          </button>
          {menuOpen && (
            <div className="absolute top-12 right-4 z-20 bg-[#141d38] border border-slate-700/40 rounded-xl shadow-lg py-2 w-40">
              <button
                className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 transition-all"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete && onDelete(project);
                }}
              >
                <Trash2 className="w-4 h-4" />
                Delete Project
              </button>
            </div>
          )}
        </>
      )}

      {project.logoUrl && (
        <div className="h-32 w-full overflow-hidden">
          <img
            src={project.logoUrl}
            alt={project.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className={`p-6 flex flex-col ${project.logoUrl ? 'flex-1' : 'flex-1 justify-center'}`}>
        <div className="mb-3">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-white font-bold text-xl leading-tight line-clamp-2 flex-1 mr-2">
              {project.title}
            </h3>
            <Badge
              className={`${getStatusColor(project.status)} text-xs px-2 py-1 rounded-md border`}
            >
              {getStatusLabel(project.status)}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-xs mb-1">
            <p className="text-slate-400">
              Posted on {formatDate(project.createdAt)}
            </p>
            {project.revivedBy && project.revivedBy.length > 0 && (
              <span className="text-[#34e0a1] font-medium">
                {project.revivedBy.length} revival{project.revivedBy.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed mb-4 overflow-hidden break-words flex-1">
          {truncateToWords(project.description, 40)}
        </p>

        <div className="space-y-4 mt-auto">
          <div className="relative">
            <button
              onClick={onClick}
              className="absolute top-0 right-0 bg-[#34e0a1] border border-[#34e0a1] text-[black] py-1 px-2 rounded text-xs hover:transparent hover:text-[#141d38] transition-all duration-200 flex items-center gap-1 group"
            >
              <span>View Details</span>
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {showPostedBy && <PostedBy username={username} />}
        </div>
      </div>
    </div>
  );
}
