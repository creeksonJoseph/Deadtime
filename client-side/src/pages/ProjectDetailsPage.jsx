import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Edit,
  Heart,
  FileText,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { getGhostCardById } from "../api/ghostcards";
import {
  getNotesForProject,
  createGhostNote,
  deleteGhostNote,
} from "../api/ghostnotes";
import { ReviveProjectModal } from "../components/ReviveProjectModal";
import { Textarea } from "../components/ui/textarea";

export function ProjectDetailsPage({ onEdit, onDelete, onProjectRevived }) {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [project, setProject] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loadingNote, setLoadingNote] = useState(false);
  const [error, setError] = useState("");
  const [showRevive, setShowRevive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [commentMenuOpen, setCommentMenuOpen] = useState(null);

  const isOwner = project?.creatorId === user?.id;

  useEffect(() => {
    if (projectId && token) {
      getGhostCardById(projectId, token).then(setProject);
    }
  }, [projectId, token]);

  useEffect(() => {
    if (project?._id) {
      getNotesForProject(project._id, token)
        .then(setNotes)
        .catch((err) => {
          if (err.message === "Failed to fetch notes") {
            setError("You do not have permission to view comments for this project.");
          } else {
            setError("Failed to fetch comments.");
          }
        });
    }
  }, [project, token]);

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "N/A";

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

  const handlePostNote = async () => {
    if (!newNote.trim()) return;
    setLoadingNote(true);
    try {
      await createGhostNote(
        { projectId: project._id, note: newNote, isAnonymous },
        token
      );
      const updatedNotes = await getNotesForProject(project._id, token);
      setNotes(updatedNotes);
      setNewNote("");
    } catch {
      setError("Failed to post comment.");
    } finally {
      setLoadingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteGhostNote(noteId, token);
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
    } catch {
      setError("Failed to delete comment.");
    }
  };

  const canDeleteNote = (note) => {
    if (user?.role === "admin") return true;
    if (project.creatorId === user?.id) return true;
    if (!note.userId && !note.isAnonymous) return true;
    if (!note.isAnonymous && note.userId?._id === user?.id) return true;
    return false;
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-[#34e0a1] border-b-[#141d38]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141d38] pb-20">
      {/* Header with back button */}
      <div className="sticky top-0 z-40 bg-[#141d38]/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          {isOwner && (
            <div className="relative">
              <button
                className="bg-slate-800/80 hover:bg-slate-700/80 rounded-full p-2 transition-all border border-slate-600/40"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <MoreVertical className="w-5 h-5 text-slate-300" />
              </button>
              {menuOpen && (
                <div className="absolute top-12 right-0 z-50 bg-[#141d38] border border-slate-700/40 rounded-xl shadow-lg py-2 w-40">
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
            </div>
          )}
        </div>
      </div>

      {/* Hero Images */}
      {project.images && project.images.length > 0 ? (
        <div className="w-full">
          {project.images.length === 1 ? (
            <div className="w-full h-80 overflow-hidden">
              <img
                src={project.images[0]}
                alt="Project showcase"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-80 flex gap-1">
              {project.images.slice(0, 3).map((img, idx) => (
                <div
                  key={idx}
                  className={`overflow-hidden ${
                    project.images.length === 2 ? "w-1/2" : "w-1/3"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Project image ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : project.logoUrl ? (
        <div className="w-full h-80 overflow-hidden">
          <img
            src={project.logoUrl}
            className="w-full h-full object-cover"
            alt={project.title}
          />
        </div>
      ) : null}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {project.logoUrl && project.images && project.images.length > 0 && (
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-600/30 flex-shrink-0">
                    <img
                      src={project.logoUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h1 className="text-4xl font-roboto font-bold text-white mb-2 leading-tight">
                    {project.title}
                  </h1>
                  <div className="space-y-0.5">
                    <p className="text-slate-400">
                      Started: {formatDate(project.dateStarted)}
                    </p>
                    {project.dateAbandoned && (
                      <p className="text-red-400">
                        Abandoned: {formatDate(project.dateAbandoned)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Badge
              className={`${getStatusColor(project.status)} px-3 py-1 rounded-lg border text-sm font-medium`}
            >
              {getStatusLabel(project.status)}
            </Badge>
          </div>
        </div>

        {/* Rest of the content from ProjectModal */}
        {/* Project Details, Resources, Action Buttons, Comments - same as modal */}
        
        {/* Action Buttons */}
        <div className="border-t border-slate-700/50 pt-8 mb-8">
          <div className="flex flex-wrap gap-4">
            {isOwner && (
              <Button
                onClick={() => onEdit(project)}
                className="bg-transparent border-2 border-[#fcdb32] text-[#fcdb32] hover:bg-[#fcdb32] hover:text-[#141d38] px-8 py-3 rounded-xl transition-all duration-200 font-semibold text-base"
              >
                <Edit className="w-5 h-5 mr-2" />
                Edit Project
              </Button>
            )}
            {!isOwner && project.creatorId !== user?.id && (
              <Button
                className="bg-[#fcdb32] text-[#141d38] hover:bg-[#fcdb32]/90 px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-[#fcdb32]/20 text-base"
                onClick={() => setShowRevive(true)}
              >
                <Heart className="w-5 h-5 mr-2" />
                Revive Project
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Revive Modal */}
      {showRevive && (
        <ReviveProjectModal
          projectId={project._id}
          onClose={() => setShowRevive(false)}
          onRevived={(updatedCard) => {
            if (updatedCard) {
              setProject(updatedCard);
            }
            if (onProjectRevived) onProjectRevived();
          }}
        />
      )}
    </div>
  );
}