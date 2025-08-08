import { useEffect, useState } from "react";
import {
  X,
  ExternalLink,
  Edit,
  Heart,
  FileText,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { getGhostCardById } from "../api/ghostcards";
import { getNotesForProject, createGhostNote } from "../api/ghostnotes";
import { ReviveProjectModal } from "./ReviveProjectModal";
import { Textarea } from "./ui/textarea";

export function ProjectModal({
  project,
  projectId,
  token,
  onClose,
  onEdit,
  isOwner = false,
  onDelete,
  onProjectRevived,
}) {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [loadedProject, setLoadedProject] = useState(project);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  const [loadingNote, setLoadingNote] = useState(false);
  const [error, setError] = useState("");
  const [showRevive, setShowRevive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);


  const projectToUse = loadedProject || project;

  // Animate in
  useEffect(() => setVisible(true), []);

  // Fetch project if ID passed
  useEffect(() => {
    if (!project && projectId) {
      getGhostCardById(projectId, token).then(setLoadedProject);
    }
  }, [project, projectId, token]);

  // Fetch notes
  useEffect(() => {
    if (projectToUse?._id) {
      getNotesForProject(projectToUse._id, token)
        .then(async (fetchedNotes) => {

          setNotes(fetchedNotes);
        })
        .catch((err) => {
          if (err.message === "Failed to fetch notes") {
            setError(
              "You do not have permission to view comments for this project."
            );
          } else {
            setError("Failed to fetch comments.");
          }
          console.error("❌ Failed to fetch notes:", err);
        });
    }
  }, [projectToUse, token]);

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
      const response = await createGhostNote(
        { projectId: projectToUse._id, note: newNote, isAnonymous: true },
        token
      );
      // Ensure the note has all required fields
      const noteWithDefaults = {
        _id: response._id || Date.now().toString(),
        note: response.note || newNote,
        createdAt: response.createdAt || new Date().toISOString(),
        system: response.system || false,
        isAnonymous: response.isAnonymous || true,
        ...response
      };
      setNotes((prev) => [noteWithDefaults, ...prev]);
      setNewNote("");
    } catch {
      setError("Failed to post comment.");
    } finally {
      setLoadingNote(false);
    }
  };

  if (!projectToUse)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-[#141d38] rounded-2xl p-8 border border-slate-600/30">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#fcdb32] mx-auto"></div>
          <p className="text-slate-400 mt-4 text-center">Loading...</p>
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] mb-4 md:mb-0 flex flex-col bg-[#141d38] rounded-2xl overflow-hidden shadow-2xl border border-slate-600/20 transition-all duration-300 transform ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Fixed */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 w-10 h-10 bg-slate-800/80 hover:bg-slate-700/80 rounded-full flex items-center justify-center transition-all duration-200 border border-slate-600/40"
        >
          <X className="w-5 h-5 text-slate-300" />
        </button>

        {/* 3-dots menu in header */}
        {isOwner && (
          <>
            <button
              className="absolute top-6 right-20 z-50 bg-slate-800/80 hover:bg-slate-700/80 rounded-full p-2 transition-all border border-slate-600/40"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <MoreVertical className="w-5 h-5 text-slate-300" />
            </button>
            {menuOpen && (
              <div className="absolute top-16 right-20 z-50 bg-[#141d38] border border-slate-700/40 rounded-xl shadow-lg py-2 w-40">
                <button
                  className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 transition-all"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete && onDelete(projectToUse);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Project
                </button>
              </div>
            )}
          </>
        )}

        {/* Scrollable Content - Everything scrolls together */}
        <div className="flex-1 overflow-y-auto">
          {/* Hero Images - At the very top but scrollable */}
          {projectToUse.images && projectToUse.images.length > 0 ? (
            <div className="w-full">
              {projectToUse.images.length === 1 ? (
                // Single image - full width
                <div className="w-full h-80 overflow-hidden">
                  <img
                    src={projectToUse.images[0]}
                    alt="Project showcase"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                // Multiple images - grid layout
                <div className="w-full h-80 flex gap-1">
                  {projectToUse.images.slice(0, 3).map((img, idx) => (
                    <div
                      key={idx}
                      className={`overflow-hidden ${
                        projectToUse.images.length === 2 ? "w-1/2" : "w-1/3"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Project image ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : projectToUse.logoUrl ? (
            // Fallback to logo if no images
            <div className="w-full h-80 overflow-hidden">
              <img
                src={projectToUse.logoUrl}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                alt={projectToUse.title}
              />
            </div>
          ) : null}

          {/* Header Section */}
          <div className="p-4 pb-3">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {projectToUse.logoUrl &&
                    projectToUse.images &&
                    projectToUse.images.length > 0 && (
                      <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-600/30 flex-shrink-0">
                        <img
                          src={projectToUse.logoUrl}
                          alt={projectToUse.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-roboto font-bold text-white mb-1 leading-tight">
                      {projectToUse.title}
                    </h2>
                    <div className="space-y-0.5">
                      <p className="text-slate-400 text-sm">
                        Started: {formatDate(projectToUse.dateStarted)}
                      </p>
                      {projectToUse.dateAbandoned && (
                        <p className="text-red-400 text-sm">
                          Abandoned: {formatDate(projectToUse.dateAbandoned)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <Badge
                className={`${getStatusColor(projectToUse.status)} px-3 py-1 rounded-lg border text-sm font-medium`}
              >
                {getStatusLabel(projectToUse.status)}
              </Badge>
            </div>
          </div>

          {/* Project Details */}
          <div className="px-4 pb-4 space-y-4">
            {/* Project Info Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 bg-[#34e0a1] rounded-full"></div>
                <h3 className="text-lg font-semibold text-white">Project Information</h3>
              </div>
              
              {/* Project Type */}
              {projectToUse.type && (
                <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                    Project Type
                  </h4>
                  <p className="text-slate-200 capitalize text-sm">
                    {projectToUse.type === 'code' ? 'Coding Project' : 
                     projectToUse.type === 'business' ? 'Business Idea' :
                     projectToUse.type === 'content' ? 'Content Project' : 
                     projectToUse.type}
                  </p>
                </div>
              )}
              
              {/* Description */}
              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  About this project
                </h4>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {projectToUse.description}
                </p>
              </div>
            </div>

            {/* Abandonment Section */}
            {projectToUse.abandonmentReason && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-red-400 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-white">Cause of Death</h3>
                </div>
                <div className="bg-red-500/10 rounded-2xl p-6 border border-red-500/30">
                  <p className="text-slate-300 leading-relaxed text-lg">
                    {projectToUse.abandonmentReason}
                  </p>
                </div>
              </div>
            )}

            {/* Resources Section */}
            {(projectToUse.externalLink || projectToUse.pitchDeckUrl) && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-[#fcdb32] rounded-full"></div>
                  <h3 className="text-xl font-semibold text-white">Resources</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectToUse.externalLink && (
                    <a
                      href={projectToUse.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-slate-800/40 hover:bg-slate-700/60 text-[#fcdb32] rounded-xl transition-all duration-200 border border-slate-600/30 hover:border-[#fcdb32]/50 font-medium group"
                    >
                      <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-semibold">External Link</div>
                        <div className="text-sm text-slate-400">View project online</div>
                      </div>
                    </a>
                  )}
                  {projectToUse.pitchDeckUrl && (
                    <a
                      href={projectToUse.pitchDeckUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-slate-800/40 hover:bg-slate-700/60 text-[#fcdb32] rounded-xl transition-all duration-200 border border-slate-600/30 hover:border-[#fcdb32]/50 font-medium group"
                      onClick={(e) => {
                        e.preventDefault();
                        const link = document.createElement('a');
                        link.href = projectToUse.pitchDeckUrl;
                        link.download = `${projectToUse.title}-pitch-deck.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-semibold">Pitch Deck</div>
                        <div className="text-sm text-slate-400">Download PDF document</div>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="border-t border-slate-700/50 pt-8">
              <div className="flex flex-wrap gap-4">
              {isOwner && (
                <Button
                  onClick={() => {
                    onClose();
                    onEdit(projectToUse);
                  }}
                  className="bg-transparent border-2 border-[#fcdb32] text-[#fcdb32] hover:bg-[#fcdb32] hover:text-[#141d38] px-8 py-3 rounded-xl transition-all duration-200 font-semibold text-base"
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Edit Project
                </Button>
              )}
              {!isOwner && projectToUse.creatorId !== user?.id && (
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

          {/* Comments Section */}
          <div className="border-t border-slate-700/50 bg-slate-900/30 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-6 bg-[#fcdb32] rounded-full"></div>
              <h3 className="text-xl font-semibold text-white">Community Discussion</h3>
            </div>

            {/* New Comment Form */}
            <div className="bg-slate-800/40 rounded-2xl p-8 mb-8 border border-slate-700/30">
              <div className="space-y-6">
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Share your thoughts about this project..."
                  className="min-h-[120px] bg-slate-900/60 border-slate-600/40 text-slate-200 placeholder:text-slate-500 rounded-xl resize-none focus:border-[#fcdb32]/50 focus:ring-[#fcdb32]/20 text-base p-4"
                />
                <div className="flex items-center justify-end">
                  <Button
                    onClick={handlePostNote}
                    disabled={loadingNote || !newNote.trim()}
                    className="bg-[#fcdb32] text-[#141d38] hover:bg-[#fcdb32]/90 px-8 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 text-base"
                  >
                    {loadingNote ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-xl mb-8 text-base">
                {error}
              </div>
            )}

            {/* Comments List */}
            {notes.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-slate-800/60 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-slate-500" />
                </div>
                <p className="text-slate-500 text-xl">No comments yet</p>
                <p className="text-slate-600 text-base mt-2">
                  Be the first to share your thoughts!
                </p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-6 pr-2">
                {notes.map((note) => (
                  <div
                    key={note._id}
                    className={`bg-slate-800/40 rounded-2xl p-6 border transition-all duration-200 hover:bg-slate-800/60 ${
                      note.system
                        ? "border-[#fcdb32]/30 bg-[#fcdb32]/5"
                        : "border-slate-700/30"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#fcdb32] to-[#fcdb32]/70 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-[#141d38] text-base font-semibold">
                            {note.system ? "S" : "A"}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-white text-base">
                            {note.system ? "System" : "Anonymous User"}
                          </p>
                          <p className="text-slate-500 text-sm">
                            {formatDate(note.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed pl-14 text-base">
                      {note.note}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Revive Modal */}
      {showRevive && (
        <ReviveProjectModal
          projectId={projectToUse._id}
          onClose={() => setShowRevive(false)}
          onRevived={(updatedCard) => {
            if (updatedCard) {
              setLoadedProject(updatedCard);
            }
            if (onProjectRevived) onProjectRevived();
          }}
        />
      )}


    </div>
  );
}
